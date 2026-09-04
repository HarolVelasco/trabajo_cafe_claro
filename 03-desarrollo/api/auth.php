<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';
function auth_response(int $status, array $payload): void { http_response_code($status); echo json_encode($payload, JSON_UNESCAPED_UNICODE); exit; }
function current_user(): ?array { return isset($_SESSION['user']) ? $_SESSION['user'] : null; }
try {
    $connection = db();
    $method = $_SERVER['REQUEST_METHOD'];
    $payload = json_decode(file_get_contents('php://input'), true) ?: [];
    if ($method === 'GET') auth_response(200, ['ok' => true, 'user' => current_user()]);
    if ($method !== 'POST') auth_response(405, ['ok' => false, 'message' => 'Método no permitido.']);
    $action = $payload['action'] ?? '';
    if ($action === 'logout') { session_destroy(); auth_response(200, ['ok' => true]); }
    $email = strtolower(trim((string) ($payload['email'] ?? '')));
    if ($action === 'register') {
        $name = trim((string) ($payload['name'] ?? ''));
        $phone = preg_replace('/[^0-9+]/', '', (string) ($payload['phone'] ?? ''));
        $password = (string) ($payload['password'] ?? '');
        if ($name === '' || mb_strlen($name) > 120 || !filter_var($email, FILTER_VALIDATE_EMAIL) || !preg_match('/^\+?[0-9]{10,15}$/', $phone) || strlen($password) < 8) auth_response(422, ['ok' => false, 'message' => 'Nombre, correo, teléfono o contraseña no válidos. Usa el teléfono con indicativo, por ejemplo +573001234567.']);
        $statement = $connection->prepare('INSERT INTO usuarios (nombre, correo, telefono, password_hash) VALUES (?, ?, ?, ?)');
        try { $statement->execute([$name, $email, $phone, password_hash($password, PASSWORD_DEFAULT)]); } catch (PDOException $error) { if ($error->getCode() === '23000') auth_response(409, ['ok' => false, 'message' => 'Ese correo ya está registrado.']); throw $error; }
        $_SESSION['user'] = ['id' => (int) $connection->lastInsertId(), 'nombre' => $name, 'correo' => $email, 'telefono' => $phone, 'rol' => 'cliente'];
        auth_response(201, ['ok' => true, 'user' => $_SESSION['user']]);
    }
    if ($action === 'login') {
        $statement = $connection->prepare('SELECT id, nombre, correo, telefono, password_hash, rol FROM usuarios WHERE correo = ? AND activo = 1');
        $statement->execute([$email]); $user = $statement->fetch();
        if (!$user || !password_verify((string) ($payload['password'] ?? ''), $user['password_hash'])) auth_response(401, ['ok' => false, 'message' => 'Credenciales incorrectas.']);
        unset($user['password_hash']); $user['id'] = (int) $user['id']; $_SESSION['user'] = $user; auth_response(200, ['ok' => true, 'user' => $user]);
    }
    auth_response(422, ['ok' => false, 'message' => 'Acción no válida.']);
} catch (Throwable $error) { error_log($error->getMessage()); auth_response(500, ['ok' => false, 'message' => 'No fue posible procesar la cuenta.']); }
