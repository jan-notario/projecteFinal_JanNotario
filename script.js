let primeraAccion = true;
let tamaño = 20;
let totalBombas = 12;

document.addEventListener("DOMContentLoaded", function () {

    const contenedor = document.getElementById("contenedor");
    const tabla = document.createElement("table");

    // ===== FILA MENU =====
    const filaMenu = document.createElement("tr");
    const celdaMenu = document.createElement("td");

    celdaMenu.colSpan = tamaño;
    celdaMenu.id = "menu";
    celdaMenu.textContent = "Buscaminas - 12 minas";

    filaMenu.appendChild(celdaMenu);
    tabla.appendChild(filaMenu);

    // ===== TABLERO =====
    for (let fila = 0; fila < tamaño; fila++) {
        const filas = document.createElement("tr");

        for (let columna = 0; columna < tamaño; columna++) {
            const celda = document.createElement("td");
            celda.id = `celda-${fila}-${columna}`;
            filas.appendChild(celda);
        }

        tabla.appendChild(filas);
    }

    contenedor.appendChild(tabla);

    // CLICK IZQUIERDO
    tabla.addEventListener("click", function (e) {

        const celda = e.target.closest("td");
        if (!celda || celda.id === "menu") return;

        if (celda.textContent === "🚩") return;

        const partes = celda.id.split("-");
        const fila = parseInt(partes[1]);
        const columna = parseInt(partes[2]);

        if (primeraAccion) {
            colocarBombaAleatoria(fila, columna);
            primeraAccion = false;
        }

        if (celda.classList.contains("bomba")) {
            celda.textContent = "💣";
            celda.style.backgroundColor = "red";
        } else {
            destaparCelda(fila, columna);
        }
    });

    // CLICK DERECHO
    tabla.addEventListener("contextmenu", function (e) {

        e.preventDefault();

        const celda = e.target.closest("td");
        if (!celda || celda.id === "menu") return;

        if (celda.classList.contains("abierta")) return;

        if (celda.textContent === "🚩") {
            celda.textContent = "";
        } else if (celda.textContent === "") {
            celda.textContent = "🚩";
        }
    });

});

function contarMinas(fila, columna) {

    let minas = 0;

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {

            const nuevaFila = fila + i;
            const nuevaColumna = columna + j;

            if (
                nuevaFila >= 0 && nuevaFila < tamaño &&
                nuevaColumna >= 0 && nuevaColumna < tamaño
            ) {

                const vecina = document.getElementById(`celda-${nuevaFila}-${nuevaColumna}`);

                if (vecina && vecina.classList.contains("bomba")) {
                    minas++;
                }
            }
        }
    }

    return minas;
}

function destaparCelda(fila, columna) {

    const celda = document.getElementById(`celda-${fila}-${columna}`);

    if (
        celda.classList.contains("abierta") ||
        celda.classList.contains("bomba") ||
        celda.textContent === "🚩"
    ) return;

    celda.classList.add("abierta");
    celda.classList.add("destapado");

    const minas = contarMinas(fila, columna);

    if (minas > 0) {
        celda.textContent = minas;
        celda.setAttribute("data-num", minas);
    }

    if (minas === 0) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {

                const nuevaFila = fila + i;
                const nuevaColumna = columna + j;

                if (
                    nuevaFila >= 0 && nuevaFila < tamaño &&
                    nuevaColumna >= 0 && nuevaColumna < tamaño
                ) {
                    destaparCelda(nuevaFila, nuevaColumna);
                }
            }
        }
    }
}

function colocarBombaAleatoria(filaInicial, columnaInicial) {

    let bombasColocadas = 0;

    while (bombasColocadas < totalBombas) {

        const fila = Math.floor(Math.random() * tamaño);
        const columna = Math.floor(Math.random() * tamaño);

        if (fila === filaInicial && columna === columnaInicial) continue;

        const celda = document.getElementById(`celda-${fila}-${columna}`);

        if (!celda.classList.contains("bomba")) {
            celda.classList.add("bomba");
            bombasColocadas++;
        }
    }
}