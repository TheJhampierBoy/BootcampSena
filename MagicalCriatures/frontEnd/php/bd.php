<?php
header('Content-Type: application/json');

// Configuración de la base de datos
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "magicalcriatures";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Obtener datos JSON del request
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    if (empty($data)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'No se recibieron datos']);
        exit;
    }
    
    // Primero crear la sala
    $stmtSala = $conn->prepare("INSERT INTO salas (fecha_creacion) VALUES (NOW())");
    $stmtSala->execute();
    $idSala = $conn->lastInsertId();
    
    // Insertar jugadores en la base de datos
    $stmt = $conn->prepare("INSERT INTO jugadores (nombre_jugador, avatar_num, id_sala) VALUES (:nombre, :avatar, :id_sala)");
    
    foreach ($data as $key => $jugador) {
        if (strpos($key, 'jugador') === 0 && is_array($jugador)) {
            $stmt->execute([
                ':nombre' => $jugador['nombre'],
                ':avatar' => $jugador['avatar'],
                ':id_sala' => $idSala
            ]);
        }
    }
    
    // Respuesta exitosa
    echo json_encode([
        'status' => 'success',
        'message' => 'Jugadores registrados correctamente',
        'idSala' => $idSala
    ]);

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Error en la base de datos: ' . $e->getMessage(),
        'error_details' => $e->getTraceAsString()
    ]);
}
?>