<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/db.php';

function respond(int $status, array $payload)
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['ok' => false, 'message' => 'Método no permitido.']);
}

$payload = json_decode(file_get_contents('php://input'), true) ?: [];
$user = $_SESSION['user'] ?? null;
$name = trim((string) ($user['nombre'] ?? $payload['name'] ?? ''));
$email = trim((string) ($user['correo'] ?? $payload['email'] ?? ''));
$need = trim((string) ($payload['need'] ?? 'Quiero hacer un pedido'));
$items = $payload['items'] ?? [];

if (!$user) {
    respond(401, ['ok' => false, 'message' => 'Inicia sesión para confirmar el pedido.']);
}

if ($name === '' || mb_strlen($name) > 120 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, ['ok' => false, 'message' => 'Ingresa un nombre y correo válidos.']);
}
if (!is_array($items) || count($items) < 1 || count($items) > 20) {
    respond(422, ['ok' => false, 'message' => 'El carrito no es válido.']);
}

$validItems = [];
$total = 0;
foreach ($items as $item) {
    $productId = filter_var($item['productId'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
    $quantity = filter_var($item['quantity'] ?? 0, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1, 'max_range' => 99]]);
    if ($productId === false || $quantity === false) {
        respond(422, ['ok' => false, 'message' => 'Uno de los productos no es válido.']);
    }
    $validItems[] = [$productId, $quantity];
}

try {
    $connection = db();
    $connection->beginTransaction();

    $clientStatement = $connection->prepare('INSERT INTO clientes (nombre, correo) VALUES (?, ?) ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), id = LAST_INSERT_ID(id)');
    $clientStatement->execute([$name, $email]);
    $clientId = (int) $connection->lastInsertId();

    $lockedProducts = [];
    foreach ($validItems as [$productId, $quantity]) {
        $productStatement = $connection->prepare('SELECT id, nombre, precio, cantidad_disponible, estado FROM productos WHERE id = ? FOR UPDATE');
        $productStatement->execute([$productId]);
        $product = $productStatement->fetch();
        if (!$product || $product['estado'] !== 'activo' || (int) $product['cantidad_disponible'] < $quantity) {
            throw new RuntimeException('Uno de los productos no tiene inventario suficiente.');
        }
        $subtotal = (float) $product['precio'] * $quantity;
        $lockedProducts[] = [$product, $quantity, $subtotal];
        $total += $subtotal;
    }

    $orderStatement = $connection->prepare('INSERT INTO pedidos (cliente_id, usuario_id, necesidad, total) VALUES (?, ?, ?, ?)');
    $orderStatement->execute([$clientId, $user['id'], mb_substr($need, 0, 80), $total]);
    $orderId = (int) $connection->lastInsertId();

    $detailStatement = $connection->prepare('INSERT INTO pedido_detalles (pedido_id, producto, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)');
    $stockStatement = $connection->prepare('UPDATE productos SET cantidad_disponible = cantidad_disponible - ? WHERE id = ?');
    foreach ($lockedProducts as [$product, $quantity, $subtotal]) {
        $detailStatement->execute([$orderId, $product['nombre'], $quantity, $product['precio'], $subtotal]);
        $stockStatement->execute([$quantity, $product['id']]);
    }

    $connection->exec('UPDATE metricas_atencion SET personas_atendidas = personas_atendidas + 1 WHERE id = 1');

    $connection->commit();
    respond(201, ['ok' => true, 'orderId' => $orderId, 'message' => 'Solicitud recibida correctamente.']);
} catch (Throwable $error) {
    if (isset($connection) && $connection->inTransaction()) {
        $connection->rollBack();
    }
    error_log($error->getMessage());
    respond(500, ['ok' => false, 'message' => 'No fue posible guardar el pedido. Revisa la conexión con XAMPP.']);
}
