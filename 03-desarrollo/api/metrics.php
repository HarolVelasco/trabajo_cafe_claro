<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';

function metrics_response(int $status, array $payload)
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $connection = db();
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (($_SESSION['user']['rol'] ?? '') !== 'administrador') {
            metrics_response(403, ['ok' => false, 'message' => 'Solo un administrador puede editar las métricas.']);
        }
        $payload = json_decode(file_get_contents('php://input'), true);
        $action = $payload['action'] ?? 'metrics';
        if ($action === 'opinion') {
            $opinionId = filter_var($payload['id'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
            $rating = filter_var($payload['rating'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1, 'max_range' => 5]]);
            $recommendation = trim((string) ($payload['recommendation'] ?? ''));
            if ($rating === false || $recommendation === '' || mb_strlen($recommendation) > 1000) {
                metrics_response(422, ['ok' => false, 'message' => 'Ingresa una calificación y recomendación válidas.']);
            }
            if ($opinionId === false) {
                $statement = $connection->prepare('INSERT INTO opiniones_clientes (calificacion, recomendacion) VALUES (?, ?)');
                $statement->execute([$rating, $recommendation]);
            } else {
                $statement = $connection->prepare('UPDATE opiniones_clientes SET calificacion = ?, recomendacion = ? WHERE id = ?');
                $statement->execute([$rating, $recommendation, $opinionId]);
            }
            $connection->exec('UPDATE metricas_atencion SET suma_calificaciones = (SELECT COALESCE(SUM(calificacion), 0) FROM opiniones_clientes), cantidad_calificaciones = (SELECT COUNT(*) FROM opiniones_clientes) WHERE id = 1');
        } elseif ($action === 'delete-opinion') {
            $opinionId = filter_var($payload['id'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
            if ($opinionId === false) {
                metrics_response(422, ['ok' => false, 'message' => 'La opinión no es válida.']);
            }
            $statement = $connection->prepare('DELETE FROM opiniones_clientes WHERE id = ?');
            $statement->execute([$opinionId]);
            $connection->exec('UPDATE metricas_atencion SET suma_calificaciones = (SELECT COALESCE(SUM(calificacion), 0) FROM opiniones_clientes), cantidad_calificaciones = (SELECT COUNT(*) FROM opiniones_clientes) WHERE id = 1');
        }
        $people = filter_var($payload['people'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 0, 'max_range' => 100000000]]);
        $ratingSum = filter_var($payload['ratingSum'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 0, 'max_range' => 500000000]]);
        $ratingCount = filter_var($payload['ratingCount'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 0, 'max_range' => 100000000]]);
        if ($action === 'metrics' && ($people === false || $ratingSum === false || $ratingCount === false || ($ratingCount > 0 && $ratingSum / $ratingCount > 5))) {
            metrics_response(422, ['ok' => false, 'message' => 'Los valores de métricas no son válidos.']);
        }
        if ($action === 'metrics') {
            $statement = $connection->prepare('UPDATE metricas_atencion SET personas_atendidas = ?, suma_calificaciones = ?, cantidad_calificaciones = ? WHERE id = 1');
            $statement->execute([$people, $ratingSum, $ratingCount]);
        }
    }
    $metrics = $connection->query('SELECT personas_atendidas, suma_calificaciones, cantidad_calificaciones FROM metricas_atencion WHERE id = 1')->fetch();
    if (!$metrics) {
        metrics_response(500, ['ok' => false, 'message' => 'No existe la fila de métricas. Importa database.sql nuevamente.']);
    }
    $metrics['rating'] = $metrics['cantidad_calificaciones'] > 0 ? round($metrics['suma_calificaciones'] / $metrics['cantidad_calificaciones'], 1) : 0;
    $opinions = $connection->query('SELECT id, calificacion, recomendacion, creado_en, actualizado_en FROM opiniones_clientes ORDER BY actualizado_en DESC, id DESC')->fetchAll();
    $distribution = [1 => 0, 2 => 0, 3 => 0, 4 => 0, 5 => 0];
    foreach ($connection->query('SELECT calificacion, COUNT(*) AS total FROM opiniones_clientes GROUP BY calificacion') as $row) {
        $distribution[(int) $row['calificacion']] = (int) $row['total'];
    }
    $metrics['distribution'] = $distribution;
    $metrics['usuarios'] = (int) $connection->query('SELECT COUNT(*) FROM usuarios WHERE activo = 1')->fetchColumn();
    metrics_response(200, ['ok' => true, 'metrics' => $metrics, 'opinions' => $opinions]);
} catch (Throwable $error) {
    error_log($error->getMessage());
    metrics_response(500, ['ok' => false, 'message' => 'No fue posible consultar las métricas.']);
}