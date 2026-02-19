// Creacion del mapa
document.addEventListener("DOMContentLoaded", function () {

    const contenedor = document.getElementById("contenedor");
    const tabla = document.createElement("table");

    for (let fila = 0; fila < 10; fila++) {
        const filas = document.createElement("tr");

        for (let columna = 0; columna < 10; columna++) {
            const celdas = document.createElement("td");

            // ID único
            celdas.id = `celda-${fila}-${columna}`;
            celdas.classList = ""

            // Mostrar coordenadas dentro de la celda (opcional)
            celdas.textContent = `${fila},${columna}`;

            filas.appendChild(celdas);
        }

        tabla.appendChild(filas);
    }

    contenedor.appendChild(tabla);

});

// MOVIMIENTO PLAYER

// Variables del jugador
const player = document.getElementById('player');
let x = 5, y = 5;
let velocidad = 5;

// Registro de teclas
const teclas = {};
window.addEventListener('keydown', e => teclas[e.key] = true);
window.addEventListener('keyup', e => teclas[e.key] = false);

// Actualizacion del movimiento
function actualizar() {
    if (teclas['w'] && y > 0) y -= velocidad;
    if (teclas['s'] && y < 595) y += velocidad;
    if (teclas['a'] && x > 0) x -= velocidad;
    if (teclas['d'] && x < 595) x += velocidad;

    // Renderizado optimizado para la GPU
    player.style.transform = `translate3d(${x}px, ${y}px, 0)`;

    // Solicita el siguiente cuadro al navegador
    requestAnimationFrame(actualizar);
}
// Iniciar el bucle
requestAnimationFrame(actualizar);

// Tamaño de las celdas (ajusta si tu CSS cambia)
const tamaño = 60;

// Función para detectar la celda donde está el player

window.addEventListener("keydown", accion);
let primeraAccion = true;

function accion(e) {

    const fila = Math.floor(y / tamaño);
    const columna = Math.floor(x / tamaño);
    const idCelda = `celda-${fila}-${columna}`;
    const celda = document.getElementById(idCelda);

    if (!celda) return;

    const imgExistente = celda.querySelector("img");

    // Colocar bomba solo la primera vez que se interactúa

    if (e.key === "Enter") {

        if (!imgExistente) {
            const img = document.createElement("img");
            img.src = "img/flag.png";
            img.style.width = "100%";
            img.style.height = "100%";
            celda.textContent = "";
            celda.appendChild(img);
        } else if (imgExistente.src === "http://127.0.0.1:5500/img/flag.png") {
            celda.removeChild(imgExistente);
            celda.textContent = `${fila},${columna}`;
        }

    }
    else if (e.key === "1" && !imgExistente) {
        if (celda.classList.contains("bomba")) {
            const img = document.createElement("img");
            img.src = "img/bom.png";
            img.style.width = "100%";
            img.style.height = "100%";
            celda.textContent = "";
            celda.appendChild(img);
        }
        else {
            let minas = 0;

            for (let f = -1; f <= 1; f++) {
                for (let c = -1; c <= 1; c++) {

                    const nuevaFila = fila + f;
                    const nuevaColumna = columna + c;

                    if (nuevaFila >= 0 && nuevaFila < 10 &&
                        nuevaColumna >= 0 && nuevaColumna < 10) {

                        const vecina = document.getElementById(`celda-${nuevaFila}-${nuevaColumna}`);

                        if (vecina && vecina.classList.contains("bomba")) {
                            minas++;
                        }
                    }
                }
            }

            const img = document.createElement("img");
            img.src = `img/${minas}.png`;
            img.style.width = "100%";
            img.style.height = "100%";
            celda.textContent = "";
            celda.appendChild(img);
        }
        if (primeraAccion) {
            colocarBombaAleatoria();
            primeraAccion = false;
        }
    }
}

function colocarBombaAleatoria() {
    for (let i = 0; i < 5; i++) {
        const fila = Math.floor(Math.random() * 10);
        const columna = Math.floor(Math.random() * 10);

        const idCelda = `celda-${fila}-${columna}`;
        const celda = document.getElementById(idCelda);

        if (!celda.classList.contains("bomba")) {
            celda.classList.add("bomba");
        } else {
            i--;
        }
    }
}
