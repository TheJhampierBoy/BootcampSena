<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'conexion.php';


$json = file_get_contents('php://input');
if (empty($json)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'No se recibieron datos']);
    exit;
}

$data = json_decode($json, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'JSON inválido']);
    exit;
}


if (!isset($data['jugador1']) || empty($data['jugador1'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Faltan datos de jugadores']);
    exit;
}

try {
 
    $stmt = $conexion->prepare("INSERT INTO jugadores (nombre_jugador) VALUES (:nombre)");
    

    $ids = [];
    foreach ($data as $key => $nombre) {
        if (strpos($key, 'jugador') === 0 && !empty($nombre)) {
            $stmt->execute([':nombre' => $nombre]);
            $ids[] = $conexion->lastInsertId();
        }
    }
    
  
    $stmtSala = $conexion->prepare("INSERT INTO salas (fecha_creacion) VALUES (NOW())");
    $stmtSala->execute();
    $idSala = $conexion->lastInsertId();
    
 
    $stmtAsoc = $conexion->prepare("UPDATE jugadores SET id_sala = ? WHERE id IN (".implode(',', $ids).")");
    $stmtAsoc->execute([$idSala]);
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Jugadores registrados correctamente',
        'idSala' => $idSala,
        'jugadores' => array_filter($data, function($key) {
            return strpos($key, 'jugador') === 0;
        }, ARRAY_FILTER_USE_KEY)
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Error en el servidor: ' . $e->getMessage(),
        'error_details' => $e->getTraceAsString()
    ]);
}
?>