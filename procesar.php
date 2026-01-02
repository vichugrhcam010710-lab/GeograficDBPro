<?php
/**
 * PROCESAR.PHP - Motor de inyección de datos con validación de duplicados
 */
require_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $tabla = $_POST['tabla'] ?? '';
    $filtro = $_POST['filtro'] ?? '';
    $cantidad = (int)($_POST['cantidad'] ?? 0);

    // 1. Obtener datos de la API
    $url = "https://restcountries.com/v3.1/" . str_replace(' ', '%20', $filtro);
    $json = @file_get_contents($url);

    if (!$json) {
        die("❌ Error de API: No hay conexión.");
    }

    $paises = json_decode($json, true);
    $insertados = 0;

    // 2. Ciclo de procesamiento
    foreach ($paises as $p) {
        if ($insertados >= $cantidad) break;

        $nombre = $conn->real_escape_string($p['name']['common'] ?? 'N/A');

        // VALIDACIÓN: ¿Ya existe este país en la tabla?
        $check = $conn->query("SELECT id FROM $tabla WHERE nombre = '$nombre'");

        if ($check && $check->num_rows == 0) {
            // Solo si NO existe, lo extraemos e insertamos
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

    // 3. Respuesta final
    if ($insertados > 0) {
        echo "✅ Éxito: Se inyectaron $insertados países nuevos.";
    } else {
        echo "⚠️ Nota: Los países ya existen en la base de datos.";
    }
} // <--- Esta es la llave que cierra el IF inicial y que probablemente faltaba
?>