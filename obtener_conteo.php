<?php
require_once 'conexion.php';

$tabla = $_GET['tabla'] ?? '';
$tablas_permitidas = ['sur_america', 'norte_america', 'sur_europa', 'norte_europa', 'este_asia', 'sur_asia', 'norte_africa', 'sur_africa', 'oceania', 'antartida'];

if (in_array($tabla, $tablas_permitidas)) {
    $result = $conn->query("SELECT COUNT(*) as total FROM $tabla");
    $row = $result->fetch_assoc();
    echo $row['total'];
} else {
    echo "0";
}
?>