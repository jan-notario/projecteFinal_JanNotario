// CREACION DEL MAPA

document.addEventListener("DOMContentLoaded", function () {

    const contenedor = document.getElementById("contenedor");
    const tabla = document.createElement("table");

    for (let fila = 0; fila < 10; fila++) {
        const filas = document.createElement("tr");

        for (let columna = 0; columna < 10; columna++) {
            const celdas = document.createElement("td");

            celdas.id = `celda-${fila}-${columna}`;
            celdas.textContent = `${fila},${columna}`;

            filas.appendChild(celdas);
        }

        tabla.appendChild(filas);
    }

    contenedor.appendChild(tabla);
});

// MOVIMIENTO PLAYER

const player = document.getElementById('player');
let x = 5, y = 5;
let velocidad = 5;

const teclas = {};
window.addEventListener('keydown', e => teclas[e.key] = true);
window.addEventListener('keyup', e => teclas[e.key] = false);

function actualizar() {
    if (teclas['w'] && y > 0) y -= velocidad;
    if (teclas['s'] && y < 595) y += velocidad;
    if (teclas['a'] && x > 0) x -= velocidad;
    if (teclas['d'] && x < 595) x += velocidad;

    player.style.transform = `translate3d(${x}px, ${y}px, 0)`;

    requestAnimationFrame(actualizar);
}
requestAnimationFrame(actualizar);


// LOGICA BUSCAMINAS


const tamaño = 63;

window.addEventListener("keydown", accion);
let primeraAccion = true;

function accion(e) {

    const fila = Math.floor(y / tamaño);
    const columna = Math.floor(x / tamaño);
    const idCelda = `celda-${fila}-${columna}`;
    const celda = document.getElementById(idCelda);



    const imgExistente = celda.querySelector("img");

    // COLOCAR / QUITAR BANDERA

    if (e.key === "Enter") {

        if (!imgExistente) {
            const img = document.createElement("img");
            img.src = "img/flag.png";
            img.style.width = "100%";
            img.style.height = "100%";
            celda.textContent = "";
            celda.appendChild(img);
        } else if (imgExistente.src.includes("flag.png")) {
            celda.removeChild(imgExistente);
            celda.textContent = `${fila},${columna}`;
        }
    }

    // DESTAPAR CELDA

    else if (e.key === "1") {

        if (primeraAccion) {
            colocarBombaAleatoria();
            primeraAccion = false;
        }

        if (celda.classList.contains("bomba")) {

            const img = document.createElement("img");
            img.src = "img/bom.png";
            img.style.width = "100%";
            img.style.height = "100%";
            celda.textContent = "";
            celda.appendChild(img);

        } else {

            destaparCelda(fila, columna);
        }
    }
}

// CONTADOR DE MINAS

function contarMinas(fila, columna) {
    let minas = 0;

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {

            const nuevaFila = fila + i;
            const nuevaColumna = columna + j;

            if (nuevaFila >= 0 && nuevaFila < 10 &&
                nuevaColumna >= 0 && nuevaColumna < 10) {

                const vecina = document.getElementById(`celda-${nuevaFila}-${nuevaColumna}`);

                if (vecina && vecina.classList.contains("bomba")) {
                    minas++;
                }
            }
        }
    }

    return minas;
}

// DESTAPADO MULTIPLE

function destaparCelda(fila, columna) {

    const celda = document.getElementById(`celda-${fila}-${columna}`);

    if (celda.classList.contains("abierta") || celda.classList.contains("bomba")) {
        return;
    }

    celda.classList.add("abierta");

    const minas = contarMinas(fila, columna);

    celda.textContent = "";

    const img = document.createElement("img");
    img.src = `img/${minas}.png`;
    img.style.width = "100%";
    img.style.height = "100%";
    celda.appendChild(img);

    // Si no hay minas alrededor sigue expandiendo
    if (minas === 0) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {

                const nuevaFila = fila + i;
                const nuevaColumna = columna + j;

                if (nuevaFila >= 0 && nuevaFila < 10 && nuevaColumna >= 0 && nuevaColumna < 10) {
                    destaparCelda(nuevaFila, nuevaColumna);
                }
            }
        }
    }
}

// COLOCAR BOMBAS

function colocarBombaAleatoria() {
    for (let i = 0; i < 12; i++) {

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