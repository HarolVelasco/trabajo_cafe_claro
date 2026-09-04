<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';
function products_response(int $status, array $payload): void { http_response_code($status); echo json_encode($payload, JSON_UNESCAPED_UNICODE); exit; }
function admin_only(): void { if (($_SESSION['user']['rol'] ?? '') !== 'administrador') products_response(403, ['ok' => false, 'message' => 'Solo un administrador puede realizar esta operación.']); }
try {
    $connection = db(); $method = $_SERVER['REQUEST_METHOD'];
    if ($method === 'GET') { $rows = $connection->query('SELECT p.*, c.nombre AS categoria FROM productos p JOIN categorias c ON c.id = p.categoria_id ORDER BY p.id')->fetchAll(); products_response(200, ['ok' => true, 'products' => $rows]); }
    admin_only(); $payload = json_decode(file_get_contents('php://input'), true) ?: []; $id = filter_var($payload['id'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
    if ($method === 'DELETE') { if ($id === false) products_response(422, ['ok' => false, 'message' => 'Producto no válido.']); $statement = $connection->prepare('UPDATE productos SET estado = "inactivo" WHERE id = ?'); $statement->execute([$id]); products_response(200, ['ok' => true]); }
    if (!in_array($method, ['POST', 'PUT'], true)) products_response(405, ['ok' => false, 'message' => 'Método no permitido.']);
    $name = trim((string) ($payload['nombre'] ?? '')); $description = trim((string) ($payload['descripcion'] ?? '')); $category = filter_var($payload['categoria_id'] ?? null, FILTER_VALIDATE_INT); $price = filter_var($payload['precio'] ?? null, FILTER_VALIDATE_FLOAT); $stock = filter_var($payload['cantidad_disponible'] ?? null, FILTER_VALIDATE_INT); $minimum = filter_var($payload['stock_minimo'] ?? 5, FILTER_VALIDATE_INT);
    if ($name === '' || $description === '' || $category === false || $price === false || $price < 0 || $stock === false || $stock < 0 || $minimum === false || $minimum < 0) products_response(422, ['ok' => false, 'message' => 'Completa correctamente los datos del producto.']);
    if ($method === 'POST') { $statement = $connection->prepare('INSERT INTO productos (categoria_id,nombre,descripcion,precio,imagen,cantidad_disponible,stock_minimo,estado) VALUES (?,?,?,?,?,?,?,?)'); $statement->execute([$category, $name, $description, $price, trim((string) ($payload['imagen'] ?? '')), $stock, $minimum, ($payload['estado'] ?? 'activo') === 'inactivo' ? 'inactivo' : 'activo']); }
    else { if ($id === false) products_response(422, ['ok' => false, 'message' => 'Producto no válido.']); $statement = $connection->prepare('UPDATE productos SET categoria_id=?,nombre=?,descripcion=?,precio=?,imagen=?,cantidad_disponible=?,stock_minimo=?,estado=? WHERE id=?'); $statement->execute([$category, $name, $description, $price, trim((string) ($payload['imagen'] ?? '')), $stock, $minimum, ($payload['estado'] ?? 'activo') === 'inactivo' ? 'inactivo' : 'activo', $id]); }
    products_response(200, ['ok' => true]);
} catch (Throwable $error) { error_log($error->getMessage()); products_response(500, ['ok' => false, 'message' => 'No fue posible guardar el producto.']); }
