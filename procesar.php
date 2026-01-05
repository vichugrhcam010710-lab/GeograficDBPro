<?php
require_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $tabla = $_POST['tabla'] ?? '';
    $filtro = $_POST['filtro'] ?? '';
    $cantidad = (int)($_POST['cantidad'] ?? 0);

    $url = "https://restcountries.com/v3.1/" . str_replace(' ', '%20', $filtro);
    $json = @file_get_contents($url);

    if (!$json) {
        die("❌ Error de API: No hay conexión.");
    }

    $paises = json_decode($json, true);
    $insertados = 0;

    foreach ($paises as $p) {
        if ($insertados >= $cantidad) break;

        $nombre = $conn->real_escape_string($p['name']['common'] ?? 'N/A');

        $check = $conn->query("SELECT id FROM $tabla WHERE nombre = '$nombre'");

        if ($check && $check->num_rows == 0) {
            $capital   = $conn->real_escape_string($p['capital'][0] ?? 'N/A');
            $poblacion = (int)($p['population'] ?? 0);
            $bandera   = $conn->real_escape_string($p['flags']['png'] ?? '');
            $mapa      = $conn->real_escape_string($p['maps']['googleMaps'] ?? '');

            $sql = "INSERT INTO $tabla (nombre, capital, poblacion, bandera, mapa) 
                    VALUES ('$nombre', '$capital', $poblacion, '$bandera', '$mapa')";
            
            if ($conn->query($sql)) {
                $insertados++;
            }
        }
    }

    if ($insertados > 0) {
        echo "✅ Éxito: Se inyectaron $insertados países nuevos.";
    } else {
        echo "⚠️ Nota: Los países ya existen en la base de datos.";
    }
}
?>