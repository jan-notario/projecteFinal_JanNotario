// ===== VARIABLES ===== 
let primeraAccion = true;
let tamaño = 10;
let totalBombas = 10;
let dificultadActual = "Facil";
let juegoTerminado = false;

// ===== INICIO =====
document.addEventListener("DOMContentLoaded", function () {
    crearTablero();
});

function crearTablero() {

    primeraAccion = true;
    juegoTerminado = false;

    const contenedor = document.getElementById("contenedor");
    contenedor.innerHTML = "";

    const tabla = document.createElement("table");
    tabla.style.position = "relative";

    const filaMenu = document.createElement("tr");
    const celdaMenu = document.createElement("td");
    celdaMenu.colSpan = tamaño;
    celdaMenu.id = "menu";

    const titulo = document.createElement("span");
    titulo.textContent = `Buscaminas - ${totalBombas} minas `;

    const miSelect = document.createElement("select");

    const niveles = [
        { nombre: "Facil", tamaño: 10, minas: 10 },
        { nombre: "Intermedio", tamaño: 16, minas: 40 },
        { nombre: "Difícil", tamaño: 20, minas: 80 }
    ];

    niveles.forEach(nivel => {
        const opcion = new Option(nivel.nombre, nivel.nombre);
        if (nivel.nombre === dificultadActual) opcion.selected = true;
        miSelect.add(opcion);
    });

    miSelect.addEventListener("change", function () {

        dificultadActual = miSelect.value;

        if (dificultadActual === "Facil") {
            tamaño = 10; totalBombas = 10;
        }
        if (dificultadActual === "Intermedio") {
            tamaño = 16; totalBombas = 40;
        }
        if (dificultadActual === "Difícil") {
            tamaño = 20; totalBombas = 80;
        }

        crearTablero();
    });

    celdaMenu.appendChild(titulo);
    celdaMenu.appendChild(miSelect);
    filaMenu.appendChild(celdaMenu);
    tabla.appendChild(filaMenu);

    for (let fila = 0; fila < tamaño; fila++) {
        const filaTabla = document.createElement("tr");

        for (let columna = 0; columna < tamaño; columna++) {
            const celda = document.createElement("td");
            celda.id = `celda-${fila}-${columna}`;
            filaTabla.appendChild(celda);
        }

        tabla.appendChild(filaTabla);
    }

    contenedor.appendChild(tabla);

    tabla.addEventListener("click", function (e) {

        if (juegoTerminado) return;

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
            mostrarGameOver();
        } else {
            destaparCelda(fila, columna);
            comprobarVictoria();
        }
    });

    tabla.addEventListener("contextmenu", function (e) {

        if (juegoTerminado) return;

        e.preventDefault();

        const celda = e.target.closest("td");
        if (!celda || celda.id === "menu") return;
        if (celda.classList.contains("abierta")) return;

        celda.textContent = celda.textContent === "🚩" ? "" : "🚩";
    });
}

// ===== CONTAR MINAS =====
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
                if (vecina.classList.contains("bomba")) minas++;
            }
        }
    }

    return minas;
}

// ===== DESTAPAR =====
function destaparCelda(fila, columna) {

    const celda = document.getElementById(`celda-${fila}-${columna}`);

    if (
        celda.classList.contains("abierta") ||
        celda.classList.contains("bomba") ||
        celda.textContent === "🚩"
    ) return;

    celda.classList.add("abierta", "destapado");

    const minas = contarMinas(fila, columna);

    if (minas > 0) {
        celda.textContent = minas;
        celda.setAttribute("data-num", minas);
        return;
    }

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

// ===== COLOCAR BOMBAS =====
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

// ===== GAME OVER =====
function mostrarGameOver() {

    juegoTerminado = true;

    document.querySelectorAll(".bomba").forEach(celda => {
        celda.textContent = "💣";
        celda.classList.add("destapado");
    });

    mostrarOverlay("💣 GAME OVER", "gameOverBox");
}

// ===== VICTORIA =====
function comprobarVictoria() {

    const celdas = document.querySelectorAll("td:not(#menu)");
    let abiertas = 0;

    celdas.forEach(celda => {
        if (celda.classList.contains("abierta")) abiertas++;
    });

    if (abiertas === (tamaño * tamaño - totalBombas)) {
        mostrarVictoria();
    }
}

function mostrarVictoria() {

    juegoTerminado = true;

    document.querySelectorAll(".bomba").forEach(celda => {
        celda.textContent = "🚩";
    });

    mostrarOverlay("🎉 ¡VICTORIA!", "victoriaBox");
}

// ===== OVERLAY GENERAL =====
function mostrarOverlay(texto, claseExtra) {

    const contenedor = document.getElementById("contenedor");

    const overlay = document.createElement("div");
    overlay.className = "overlay";

    const caja = document.createElement("div");
    caja.className = `overlayBox ${claseExtra}`;

    caja.innerHTML = `
        ${texto}
        <br>
        <button id="reiniciar">Reintentar</button>
    `;

    overlay.appendChild(caja);
    contenedor.appendChild(overlay);

    document.getElementById("reiniciar").onclick = () => {
        crearTablero();
    };
}