<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';

function promotions_response(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function require_admin(): array
{
    $user = $_SESSION['user'] ?? null;
    if (!$user || ($user['rol'] ?? '') !== 'administrador') {
        promotions_response(403, ['ok' => false, 'message' => 'Solo un administrador puede gestionar promociones.']);
    }
    return $user;
}

function clean_phone(string $phone): string
{
    return preg_replace('/[^0-9+]/', '', $phone);
}

function send_whatsapp(string $phone, string $message): void
{
    if (WHATSAPP_ACCESS_TOKEN === '' || WHATSAPP_PHONE_NUMBER_ID === '') {
        throw new RuntimeException('Configura WHATSAPP_ACCESS_TOKEN y WHATSAPP_PHONE_NUMBER_ID en api/config.php.');
    }
    $url = 'https://graph.facebook.com/' . WHATSAPP_API_VERSION . '/' . WHATSAPP_PHONE_NUMBER_ID . '/messages';
    $body = json_encode([
        'messaging_product' => 'whatsapp',
        'to' => clean_phone($phone),
        'type' => 'text',
        'text' => ['preview_url' => false, 'body' => $message],
    ], JSON_UNESCAPED_UNICODE);
    $curl = curl_init($url);
    curl_setopt_array($curl, [
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . WHATSAPP_ACCESS_TOKEN, 'Content-Type: application/json'],
        CURLOPT_POSTFIELDS => $body,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 20,
    ]);
    $response = curl_exec($curl);
    $status = (int) curl_getinfo($curl, CURLINFO_HTTP_CODE);
    $error = curl_error($curl);
    curl_close($curl);
    if ($response === false || $status < 200 || $status >= 300) {
        throw new RuntimeException($error ?: 'Meta rechazó el mensaje de WhatsApp (' . $status . ').');
    }
}

try {
    $admin = require_admin();
    $connection = db();
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method === 'GET') {
        $promotions = $connection->query('SELECT id, titulo, mensaje, activa, creado_en FROM promociones ORDER BY creado_en DESC')->fetchAll();
        $audience = (int) $connection->query("SELECT COUNT(*) FROM usuarios WHERE rol = 'cliente' AND activo = 1 AND telefono <> ''")->fetchColumn();
        promotions_response(200, ['ok' => true, 'promotions' => $promotions, 'audience' => $audience]);
    }
    $payload = json_decode(file_get_contents('php://input'), true) ?: [];
    if ($method === 'POST' && ($payload['action'] ?? '') === 'send') {
        $id = filter_var($payload['id'] ?? null, FILTER_VALIDATE_INT);
        $statement = $connection->prepare('SELECT titulo, mensaje FROM promociones WHERE id = ? AND activa = 1');
        $statement->execute([$id]);
        $promotion = $statement->fetch();
        if (!$promotion) promotions_response(404, ['ok' => false, 'message' => 'La promoción no existe o está inactiva.']);
        $users = $connection->query("SELECT id, telefono FROM usuarios WHERE rol = 'cliente' AND activo = 1 AND telefono <> ''")->fetchAll();
        $sent = 0;
        $failed = 0;
        foreach ($users as $user) {
            try {
                send_whatsapp($user['telefono'], $promotion['titulo'] . "\n\n" . $promotion['mensaje']);
                $sent++;
            } catch (Throwable $error) {
                $failed++;
                error_log('WhatsApp user ' . $user['id'] . ': ' . $error->getMessage());
            }
        }
        promotions_response(200, ['ok' => true, 'sent' => $sent, 'failed' => $failed, 'total' => count($users)]);
    }
    if ($method === 'POST') {
        $title = trim((string) ($payload['titulo'] ?? ''));
        $message = trim((string) ($payload['mensaje'] ?? ''));
        if ($title === '' || mb_strlen($title) > 120 || $message === '' || mb_strlen($message) > 4000) {
            promotions_response(422, ['ok' => false, 'message' => 'Escribe un título y un mensaje de hasta 4000 caracteres.']);
        }
        $statement = $connection->prepare('INSERT INTO promociones (titulo, mensaje, creado_por) VALUES (?, ?, ?)');
        $statement->execute([$title, $message, $admin['id']]);
        promotions_response(201, ['ok' => true, 'promotionId' => (int) $connection->lastInsertId()]);
    }
    if ($method === 'PATCH') {
        $id = filter_var($payload['id'] ?? null, FILTER_VALIDATE_INT);
        if ($id === false) promotions_response(422, ['ok' => false, 'message' => 'Promoción no válida.']);
        $statement = $connection->prepare('UPDATE promociones SET activa = ? WHERE id = ?');
        $statement->execute([(int) !empty($payload['activa']), $id]);
        promotions_response(200, ['ok' => true]);
    }
    if ($method === 'DELETE') {
        $id = filter_var($payload['id'] ?? null, FILTER_VALIDATE_INT);
        if ($id === false) promotions_response(422, ['ok' => false, 'message' => 'Promoción no válida.']);
        $statement = $connection->prepare('DELETE FROM promociones WHERE id = ?');
        $statement->execute([$id]);
        promotions_response(200, ['ok' => true]);
    }
    promotions_response(405, ['ok' => false, 'message' => 'Método no permitido.']);
} catch (Throwable $error) {
    error_log($error->getMessage());
    promotions_response(500, ['ok' => false, 'message' => $error->getMessage()]);
}
