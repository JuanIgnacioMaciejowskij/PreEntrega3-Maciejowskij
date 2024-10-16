// Comienzo

class JuegoMemoria {
    constructor() {
        this.simbolos = ['🍎', '🍌', '🍒', '🍇', '🍉', '🍍', '🥝', '🍓'];
        this.cartas = [...this.simbolos, ...this.simbolos];  // se duplican los símbolos para crear pares
        this.tablero = document.getElementById('tablero');
        this.reiniciarBtn = document.getElementById('reiniciar');
        this.tarjetas = [];
        this.primeraSeleccion = null;
        this.segundaSeleccion = null;
        this.paresEncontrados = 0;
        this.movimientos = 0;
        this.maxPares = this.simbolos.length;

        // Se carga el progreso desde localStorage si existe
        this.cargarProgreso();

        // Se inicializa el juego
        this.crearTablero();
        this.eventos();
    }

    // Con este método, se crea el tablero
    crearTablero() {
        // Se mezclan las cartas usando con función de orden superior
        this.cartas.sort(() => Math.random() - 0.5);

        // Se limpia el tablero
        this.tablero.innerHTML = '';
        this.tarjetas = [];

        // Se crean las tarjetas en el DOM
        this.cartas.forEach((simbolo, index) => {
            const tarjeta = document.createElement('div');
            tarjeta.classList.add('tarjeta');
            tarjeta.dataset.simbolo = simbolo;
            tarjeta.dataset.index = index;
            tarjeta.innerHTML = '?';
            tarjeta.addEventListener('click', this.seleccionarTarjeta.bind(this));  // Evento click
            this.tablero.appendChild(tarjeta);
            this.tarjetas.push(tarjeta);
        });
    }

    //  Se selecciona la tarjeta
    seleccionarTarjeta(e) {
        const tarjetaSeleccionada = e.target;

        // Condicional para no hacer nada si es la misma tarjeta o ya está oculta
        if (tarjetaSeleccionada === this.primeraSeleccion || tarjetaSeleccionada.classList.contains('oculta')) {
            return;
        }

        tarjetaSeleccionada.innerHTML = tarjetaSeleccionada.dataset.simbolo;

        // Condicional para manejar la primera y segunda selección
        if (!this.primeraSeleccion) {
            this.primeraSeleccion = tarjetaSeleccionada;
        } else {
            this.segundaSeleccion = tarjetaSeleccionada;
            this.movimientos++;

            // Se verifican si las tarjetas coinciden
            if (this.primeraSeleccion.dataset.simbolo === this.segundaSeleccion.dataset.simbolo) {
                this.paresEncontrados++;
                this.primeraSeleccion.classList.add('oculta');
                this.segundaSeleccion.classList.add('oculta');
                this.resetearSeleccion();
                this.guardarProgreso();
            } else {
                setTimeout(() => {
                    this.primeraSeleccion.innerHTML = '?';
                    this.segundaSeleccion.innerHTML = '?';
                    this.resetearSeleccion();
                }, 1000);
            }

            // Se verifica si el juego ha terminado
            if (this.paresEncontrados === this.maxPares) {
                setTimeout(() => {
                    alert(`¡Felicidades! Has encontrado todos los pares en ${this.movimientos} movimientos.`);
                    this.reiniciarJuego();
                }, 500);
            }
        }
    }

    // Se reinicia la selección
    resetearSeleccion() {
        this.primeraSeleccion = null;
        this.segundaSeleccion = null;
    }

    // Se reinicia el juego
    reiniciarJuego() {
        this.paresEncontrados = 0;
        this.movimientos = 0;
        localStorage.removeItem('progresoMemoria');
        this.crearTablero();
    }

    // Se guarda el progreso en localStorage
    guardarProgreso() {
        const progreso = {
            paresEncontrados: this.paresEncontrados,
            movimientos: this.movimientos
        };
        localStorage.setItem('progresoMemoria', JSON.stringify(progreso));
    }

    // Se carga el progreso desde localStorage
    cargarProgreso() {
        const progresoGuardado = localStorage.getItem('progresoMemoria');
        if (progresoGuardado) {
            const { paresEncontrados, movimientos } = JSON.parse(progresoGuardado);
            this.paresEncontrados = paresEncontrados;
            this.movimientos = movimientos;
            alert(`Progreso cargado: ${this.paresEncontrados} pares encontrados en ${this.movimientos} movimientos.`);
        }
    }

    // Con este método se manejan los eventos
    eventos() {
        this.reiniciarBtn.addEventListener('click', this.reiniciarJuego.bind(this));
    }
}

// Se inciializa el juego al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    new JuegoMemoria();
});