window.onload = () => {
    regs.forEach(r => {
        fetch(`https://restcountries.com/v3.1/${r[2]}`)
        .then(res => res.json())
        .then(apiData => {
            const totalAPI = apiData.length;
            
            fetch(`obtener_conteo.php?tabla=${r[1]}`)
            .then(res => res.text())
            .then(registrados => {
                const yaInsertados = parseInt(registrados);
                const disponibles = totalAPI - yaInsertados;
                
                const input = document.getElementById('cant_' + r[1]);
                const label = document.getElementById('max_' + r[1]);
                const btn = document.getElementById('btn_' + r[1]);

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

function validar(tabla) {
    const input = document.getElementById('cant_' + tabla);
    const btn = document.getElementById('btn_' + tabla);
    const max = parseInt(input.max);
    const val = parseInt(input.value);

    if (val > max) {
        btn.disabled = true;
        input.style.borderColor = "var(--danger)";
        input.style.backgroundColor = "rgba(239, 68, 68, 0.05)";
        
        mostrarToast(`⚠️ La región ${tabla} solo tiene ${max} países disponibles.`, "var(--warning)");
    } 
    else if (val < 1 || isNaN(val)) {
        btn.disabled = true;
        input.style.borderColor = "var(--danger)";
    } 
    else {
        btn.disabled = false;
        input.style.borderColor = "var(--gray-light)";
        input.style.backgroundColor = "white";
    }
}

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
        
        actualizarContador(tabla, filtro);
    })
    .catch(() => {
        mostrarToast("❌ Error de red", "var(--danger)");
        btn.disabled = false;
    });
}


function mostrarToast(mensaje, color) {
    const container = document.getElementById('toast-container');
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.backgroundColor = color;
    toast.innerText = mensaje;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 500);
    }, 3500);
}

function actualizarContador(tabla, filtro) {
    const label = document.getElementById('max_' + tabla);
    const input = document.getElementById('cant_' + tabla);
    const btn = document.getElementById('btn_' + tabla);

    fetch(`https://restcountries.com/v3.1/${filtro}`)
    .then(res => res.json())
    .then(apiData => {
        const totalAPI = apiData.length;

        fetch(`obtener_conteo.php?tabla=${tabla}`)
        .then(res => res.text())
        .then(registrados => {
            const yaInsertados = parseInt(registrados);
            const disponibles = totalAPI - yaInsertados;

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

window.onload = () => {
    regs.forEach(r => {
        actualizarContador(r[1], r[2]);
    });
};