<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Geo Injector Pro</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div id="toast-container"></div>

    <h1>🌍 Inyector Geográfico Inteligente</h1>
    
    <table>
        <thead>
            <tr>
                <th>Región</th>
                <th>Tabla SQL</th>
                <th>Cantidad</th>
                <th>Acción</th>
            </tr>
        </thead>
        <tbody>
            <?php
            $regiones = [
                ["Sur América", "sur_america", "subregion/south america"],
                ["Norte América", "norte_america", "subregion/north america"],
                ["Sur Europa", "sur_europa", "subregion/southern europe"],
                ["Norte Europa", "norte_europa", "subregion/northern europe"],
                ["Este Asia", "este_asia", "subregion/eastern asia"],
                ["Sur Asia", "sur_asia", "subregion/southern asia"],
                ["Norte África", "norte_africa", "subregion/northern africa"],
                ["África Sub", "sur_africa", "region/africa"],
                ["Oceanía", "oceania", "region/oceania"],
                ["Antártida", "antartida", "region/antarctic"]
            ];
            foreach ($regiones as $r): ?>
            <tr>
                <td><strong><?= $r[0] ?></strong></td>
                <td><code><?= $r[1] ?></code></td>
                <td>
                    <input type="number" id="cant_<?= $r[1] ?>" value="1" min="1" oninput="validar('<?= $r[1] ?>')">
                    <small id="max_<?= $r[1] ?>" style="display:block; color: #7f8c8d;">Cargando...</small>
                </td>
                <td>
                    <button id="btn_<?= $r[1] ?>" class="btn" onclick="lanzar('<?= $r[1] ?>', '<?= $r[2] ?>')" disabled>INYECTAR</button>
                </td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>

    <script>const regs = <?= json_encode($regiones) ?>;</script>
    <script src="script.js"></script>
</body>
</html>