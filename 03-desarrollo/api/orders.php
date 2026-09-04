<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';
function orders_response(int $status, array $payload): void { http_response_code($status); echo json_encode($payload, JSON_UNESCAPED_UNICODE); exit; }
try {
    $connection = db(); $user = $_SESSION['user'] ?? null; if (!$user) orders_response(401, ['ok' => false, 'message' => 'Inicia sesión para consultar pedidos.']);
    if ($_SERVER['REQUEST_METHOD'] === 'GET') { $sql = $user['rol'] === 'administrador' ? 'SELECT p.*, u.nombre, u.correo FROM pedidos p LEFT JOIN usuarios u ON u.id=p.usuario_id ORDER BY p.creado_en DESC' : 'SELECT p.* FROM pedidos p WHERE p.usuario_id = ? ORDER BY p.creado_en DESC'; $statement = $connection->prepare($sql); $statement->execute($user['rol'] === 'administrador' ? [] : [$user['id']]); orders_response(200, ['ok' => true, 'orders' => $statement->fetchAll()]); }
    if ($user['rol'] !== 'administrador' || $_SERVER['REQUEST_METHOD'] !== 'PATCH') orders_response(403, ['ok' => false, 'message' => 'Operación no permitida.']);
    $payload = json_decode(file_get_contents('php://input'), true) ?: []; $id = filter_var($payload['id'] ?? null, FILTER_VALIDATE_INT); $status = $payload['estado'] ?? ''; if ($id === false || !in_array($status, ['recibido','en_revision','confirmado','cancelado'], true)) orders_response(422, ['ok' => false, 'message' => 'Estado no válido.']);
    $statement = $connection->prepare('UPDATE pedidos SET estado=? WHERE id=?'); $statement->execute([$status, $id]); orders_response(200, ['ok' => true]);
} catch (Throwable $error) { error_log($error->getMessage()); orders_response(500, ['ok' => false, 'message' => 'No fue posible consultar los pedidos.']); }
