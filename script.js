/* ============================================
   GEO INJECTOR - LOGIC & NOTIFICATIONS
   ============================================ */

window.onload = () => {
    regs.forEach(r => {
        // 1. Consultamos la API
        fetch(`https://restcountries.com/v3.1/${r[2]}`)
        .then(res => res.json())
        .then(apiData => {
            const totalAPI = apiData.length;
            
            // 2. Consultamos cuántos hay ya en nuestra DB
            fetch(`obtener_conteo.php?tabla=${r[1]}`)
            .then(res => res.text())
            .then(registrados => {
                const yaInsertados = parseInt(registrados);
                const disponibles = totalAPI - yaInsertados;
                
                const input = document.getElementById('cant_' + r[1]);
                const label = document.getElementById('max_' + r[1]);
                const btn = document.getElementById('btn_' + r[1]);

                // Guardamos el disponible real en el atributo max
                input.max = disponibles;
                
                if (disponibles <= 0) {
                    label.innerText = `(Sin cupo: ${yaInsertados}/${totalAPI})`;
                    label.style.color = "var(--danger)";
                    input.disabled = true;
                    btn.disabled = true;
                    btn.innerText = "COMPLETO";
                } else {
                    label.innerText = `(Libres: ${disponibles} de ${totalAPI})`;
                    btn.disabled = false;
                }
            });
        });
    });
};

// Actualiza también la función validar para que use este nuevo max
function validar(tabla) {
    const input = document.getElementById('cant_' + tabla);
    const btn = document.getElementById('btn_' + tabla);
    const max = parseInt(input.max);
    const val = parseInt(input.value);

    if (val > max) {
        btn.disabled = true;
        input.style.borderColor = "var(--danger)";
        mostrarToast(`⚠️ Solo quedan ${max} espacios disponibles en esta categoría.`, "var(--warning)");
    } else if (val < 1 || isNaN(val)) {
        btn.disabled = true;
    } else {
        btn.disabled = false;
        input.style.borderColor = "var(--gray-light)";
    }
}

/**
 * Valida la entrada del usuario sin mover la tabla
 */
/**
 * Valida la entrada del usuario en tiempo real.
 * Si excede el máximo, lanza un Toast de advertencia.
 */
function validar(tabla) {
    const input = document.getElementById('cant_' + tabla);
    const btn = document.getElementById('btn_' + tabla);
    const max = parseInt(input.max);
    const val = parseInt(input.value);

    // 1. Si el usuario escribe un número mayor al disponible
    if (val > max) {
        btn.disabled = true; // Bloqueamos el botón por seguridad
        input.style.borderColor = "var(--danger)";
        input.style.backgroundColor = "rgba(239, 68, 68, 0.05)";
        
        // Lanzamos la alerta flotante
        mostrarToast(`⚠️ La región ${tabla} solo tiene ${max} países disponibles.`, "var(--warning)");
    } 
    // 2. Si el número es menor a 1 o está vacío
    else if (val < 1 || isNaN(val)) {
        btn.disabled = true;
        input.style.borderColor = "var(--danger)";
    } 
    // 3. Todo correcto
    else {
        btn.disabled = false;
        input.style.borderColor = "var(--gray-light)";
        input.style.backgroundColor = "white";
    }
}

/**
 * Lanza la petición AJAX y muestra notificaciones flotantes
 */
function lanzar(tabla, filtro) {
    const cant = document.getElementById('cant_' + tabla).value;
    const btn = document.getElementById('btn_' + tabla);

    btn.disabled = true;
    mostrarToast("⏳ Procesando...", "var(--warning)");

    const form = new FormData();
    form.append('tabla', tabla);
    form.append('filtro', filtro);
    form.append('cantidad', cant);

    fetch('procesar.php', { method: 'POST', body: form })
    .then(res => res.text())
    .then(data => {
        mostrarToast(data, "var(--success)");
        
        // --- LA MAGIA ESTÁ AQUÍ ---
        // Volvemos a contar para que el número "Libres" se refresque al instante
        actualizarContador(tabla, filtro);
    })
    .catch(() => {
        mostrarToast("❌ Error de red", "var(--danger)");
        btn.disabled = false;
    });
}

/**
 * Crea y destruye las notificaciones flotantes (Toasts)
 */
function mostrarToast(mensaje, color) {
    const container = document.getElementById('toast-container');
    
    // Crear el elemento de la notificación
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.backgroundColor = color;
    toast.innerText = mensaje;

    // Agregar al contenedor
    container.appendChild(toast);

    // Desvanecer y eliminar después de 3.5 segundos
    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 500);
    }, 3500);
}

// Función para actualizar los números de una fila específica
function actualizarContador(tabla, filtro) {
    const label = document.getElementById('max_' + tabla);
    const input = document.getElementById('cant_' + tabla);
    const btn = document.getElementById('btn_' + tabla);

    // 1. Consultar la API para el total
    fetch(`https://restcountries.com/v3.1/${filtro}`)
    .then(res => res.json())
    .then(apiData => {
        const totalAPI = apiData.length;

        // 2. Consultar nuestra DB para lo ya insertado
        fetch(`obtener_conteo.php?tabla=${tabla}`)
        .then(res => res.text())
        .then(registrados => {
            const yaInsertados = parseInt(registrados);
            const disponibles = totalAPI - yaInsertados;

            // Actualizamos el atributo max y el texto
            input.max = disponibles;
            
            if (disponibles <= 0) {
                label.innerText = `(Sin cupo: ${yaInsertados}/${totalAPI})`;
                label.style.color = "var(--danger)";
                input.disabled = true;
                btn.disabled = true;
                btn.innerText = "COMPLETO";
            } else {
                label.innerText = `(Libres: ${disponibles} de ${totalAPI})`;
                label.style.color = "var(--gray)";
                input.disabled = false;
                btn.disabled = false;
                btn.innerText = "INYECTAR";
            }
        });
    });
}

// Al cargar la página, inicializamos todas las filas
window.onload = () => {
    regs.forEach(r => {
        actualizarContador(r[1], r[2]);
    });
};