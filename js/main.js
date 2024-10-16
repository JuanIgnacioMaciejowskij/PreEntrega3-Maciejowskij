class JuegoMemoria {
    constructor() {
        this.simbolos = ['🍎', '🍌', '🍒', '🍇', '🍉', '🍍', '🥝', '🍓'];
        this.cartas = [...this.simbolos, ...this.simbolos];  // Duplicamos los símbolos para crear pares
        this.tablero = document.getElementById('tablero');
        this.reiniciarBtn = document.getElementById('reiniciar');
        this.tarjetas = [];
        this.primeraSeleccion = null;
        this.segundaSeleccion = null;
        this.paresEncontrados = 0;
        this.movimientos = 0;
        this.maxPares = this.simbolos.length;

        // Cargar el progreso desde localStorage si existe
        this.cargarProgreso();

        // Inicializar juego
        this.crearTablero();
        this.eventos();
    }

    // Método para crear el tablero
    crearTablero() {
        // Mezclar las cartas usando una función de orden superior
        this.cartas.sort(() => Math.random() - 0.5);

        // Limpiar el tablero
        this.tablero.innerHTML = '';
        this.tarjetas = [];

        // Crear las tarjetas en el DOM
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

    // Método para seleccionar tarjeta
    seleccionarTarjeta(e) {
        const tarjetaSeleccionada = e.target;

        // No hacer nada si es la misma tarjeta o ya está oculta
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

            // Verificar si las tarjetas coinciden
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

            // Verificar si el juego ha terminado
            if (this.paresEncontrados === this.maxPares) {
                setTimeout(() => {
                    alert(`¡Felicidades! Has encontrado todos los pares en ${this.movimientos} movimientos.`);
                    this.reiniciarJuego();
                }, 500);
            }
        }
    }

    // Método para reiniciar la selección
    resetearSeleccion() {
        this.primeraSeleccion = null;
        this.segundaSeleccion = null;
    }

    // Método para reiniciar el juego
    reiniciarJuego() {
        this.paresEncontrados = 0;
        this.movimientos = 0;
        localStorage.removeItem('progresoMemoria');
        this.crearTablero();
    }

    // Método para guardar el progreso en localStorage
    guardarProgreso() {
        const progreso = {
            paresEncontrados: this.paresEncontrados,
            movimientos: this.movimientos
        };
        localStorage.setItem('progresoMemoria', JSON.stringify(progreso));
    }

    // Método para cargar el progreso desde localStorage
    cargarProgreso() {
        const progresoGuardado = localStorage.getItem('progresoMemoria');
        if (progresoGuardado) {
            const { paresEncontrados, movimientos } = JSON.parse(progresoGuardado);
            this.paresEncontrados = paresEncontrados;
            this.movimientos = movimientos;
            alert(`Progreso cargado: ${this.paresEncontrados} pares encontrados en ${this.movimientos} movimientos.`);
        }
    }

    // Método para manejar eventos
    eventos() {
        this.reiniciarBtn.addEventListener('click', this.reiniciarJuego.bind(this));
    }
}

// Inicializar el juego al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    new JuegoMemoria();
});