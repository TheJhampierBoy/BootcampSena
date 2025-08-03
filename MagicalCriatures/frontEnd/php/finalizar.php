<?php
include 'conexion.php';

header('Content-Type: application/json');

try {
    // Obtener datos del POST
    $input = file_get_contents('php://input');
    if (empty($input)) {
        throw new Exception("No se recibieron datos");
    }

    $data = json_decode($input, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Error al decodificar JSON: " . json_last_error_msg());
    }

    if (!isset($data['idSala']) || !isset($data['ganador']) || !isset($data['puntos'])) {
        throw new Exception("Datos incompletos");
    }

    $idSala = intval($data['idSala']);
    $ganador = mysqli_real_escape_string($conn, $data['ganador']);
    $puntos = intval($data['puntos']);

    // 1. Actualizar sala (marcar como finalizada)
    $stmt = mysqli_prepare($conn, "UPDATE sala SET fecha_fin = NOW(), estado = 'finalizada' WHERE id_Sala = ?");
    mysqli_stmt_bind_param($stmt, "i", $idSala);
    if (!mysqli_stmt_execute($stmt)) {
        throw new Exception("Error al actualizar sala: " . mysqli_error($conn));
    }

    // 2. Actualizar puntos del ganador
    // Primero obtener el id_usuSala del ganador
    $stmt = mysqli_prepare($conn, 
        "SELECT us.id_usuSala 
         FROM usuario_Sala us
         JOIN usuario u ON us.id_Usuario = u.id_Usuario
         WHERE us.id_Sala = ? AND u.nombre = ?");
    mysqli_stmt_bind_param($stmt, "is", $idSala, $ganador);
    if (!mysqli_stmt_execute($stmt)) {
        throw new Exception("Error al buscar ganador: " . mysqli_error($conn));
    }

    $result = mysqli_stmt_get_result($stmt);
    $row = mysqli_fetch_assoc($result);
    if (!$row) {
        throw new Exception("No se encontró al ganador en la sala");
    }

    $idUsuSala = $row['id_usuSala'];

    // Actualizar puntos
    $stmt = mysqli_prepare($conn, 
        "UPDATE usuario_Sala 
         SET puntosTotales = puntosTotales + ? 
         WHERE id_usuSala = ?");
    mysqli_stmt_bind_param($stmt, "ii", $puntos, $idUsuSala);
    if (!mysqli_stmt_execute($stmt)) {
        throw new Exception("Error al actualizar puntos: " . mysqli_error($conn));
    }

    echo json_encode(["status" => "success", "message" => "Partida finalizada correctamente"]);

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}

if (isset($conn)) {
    mysqli_close($conn);
}
?>