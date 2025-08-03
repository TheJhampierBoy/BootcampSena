<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include 'conexion.php';

try {
    if (!isset($_GET['idSala']) || empty($_GET['idSala'])) {
        throw new Exception("ID de sala no proporcionado");
    }

    $idSala = intval($_GET['idSala']);
    
    // Obtener jugadores de la sala
    $query = "SELECT u.nombre 
              FROM usuario u
              JOIN usuario_Sala us ON u.id_Usuario = us.id_Usuario
              WHERE us.id_Sala = ?";
    
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "i", $idSala);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    
    $jugadores = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $jugadores[] = $row['nombre'];
    }
    
    if (empty($jugadores)) {
        throw new Exception("No se encontraron jugadores para esta sala");
    }
    
    echo json_encode([
        "status" => "success",
        "jugadores" => $jugadores
    ]);

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}

if (isset($conn)) {
    mysqli_close($conn);
}
?>