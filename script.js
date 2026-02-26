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

    let primeraAccion = true;

    // DESTAPAR
    tabla.addEventListener("click", function (e) {

        if (e.target.tagName !== "TD") return;

        const celda = e.target;
        const partes = celda.id.split("-");
        const fila = parseInt(partes[1]);
        const columna = parseInt(partes[2]);

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
    });

    // BANDERA
    tabla.addEventListener("contextmenu", function (e) {

        e.preventDefault();

        if (e.target.tagName !== "TD") return;

        const celda = e.target;
        const imgExistente = celda.querySelector("img");

        if (!celda.classList.contains("abierta")) {

            if (!imgExistente) {

                const img = document.createElement("img");
                img.src = "img/flag.png";
                img.style.width = "100%";
                img.style.height = "100%";
                celda.textContent = "";
                celda.appendChild(img);

            } else if (imgExistente.src.includes("flag.png")) {

                celda.removeChild(imgExistente);

                const partes = celda.id.split("-");
                celda.textContent = `${partes[1]},${partes[2]}`;
            }
        }
    });

});

const tamaño = 63;


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

    if (
        celda.classList.contains("abierta") ||
        celda.classList.contains("bomba") ||
        celda.querySelector("img")?.src.includes("flag.png")
    ) {
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

    if (minas === 0) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {

                const nuevaFila = fila + i;
                const nuevaColumna = columna + j;

                if (nuevaFila >= 0 && nuevaFila < 10 &&
                    nuevaColumna >= 0 && nuevaColumna < 10) {
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