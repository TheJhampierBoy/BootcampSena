<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "magicalcriatures";

try {
    $conexion = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8", $username, $password);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(['status' => 'error', 'message' => 'Error de conexión: ' . $e->getMessage()]));
}
?>