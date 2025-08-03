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
    
    // Obtener ID de sala
    $idSala = $_GET['idSala'] ?? null;
    
    if (!$idSala) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'ID de sala no proporcionado']);
        exit;
    }
    
    // Obtener jugadores de la sala
    $stmt = $conn->prepare("SELECT nombre_jugador, avatar_num FROM jugadores WHERE id_sala = :id_sala");
    $stmt->execute([':id_sala' => $idSala]);
    $jugadores = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Formatear respuesta
    $resultado = [];
    foreach ($jugadores as $index => $jugador) {
        $resultado[] = [
            'numero' => $index + 1,
            'nombre' => $jugador['nombre_jugador'],
            'avatar' => $jugador['avatar_num']
        ];
    }
    
    echo json_encode([
        'status' => 'success',
        'jugadores' => $resultado
    ]);

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Error en la base de datos: ' . $e->getMessage()
    ]);
}
?>