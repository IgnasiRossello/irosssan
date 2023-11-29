document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board'); // Referencia HTML en 'board'
    const size = 20; // Tamaño del tablero
    const bombCount = 99; // Número de bombas

    // Función para generar un tablero aleatorio con bombas y establecer lo que hace cada click

    function generateBoard() { //Genera un Tablero
        const cells = []; // Crea un array 'cells' para almacenar información
        for (let i = 0; i < size * size; i++) { // Crea un bucle sobre las posiciones posibles y crea una celda para cada posición
            const cell = document.createElement('div'); // Crea un div para representar cada celda 
            cell.classList.add('cell'); //Agrega información del CSS a cada celda
            cell.dataset.index = i; // establece un 'index' en cada celda. Identifica cada celda (mas facil para trabajar con ellas)
            cell.addEventListener('click', () => revealCell(i)); //añade un evento en el click izquierdo (inicio temporizador)
            cell.addEventListener('contextmenu', (e) => { //añade un evento en el click derecho
                e.preventDefault(); //detiene el comportamiento predeterminado del click derecho
                toggleFlag(i); //marcar o desmarcar una bomba
            });
            cells.push(cell); //agrega la celda actual al array 'cells'
            board.appendChild(cell); //agrega la celda actual al tablero 'board'
        }

        // Generar bombas de manera aleatoria
        const bombIndices = Array.from({ length: bombCount }, () => Math.floor(Math.random() * (size * size)));
        bombIndices.forEach(index => cells[index].classList.add('bomb'));
        // Creas la constante 'bombIndices' que tiene en cuenta tu 'bombCount' y esparce por todas las celdas de manera aleatoria todas las bombas
        // Se agrega la clase bomb a las celdas del tablero que contienen bomba
    }

    // Función para revelar una celda

    function revealCell(index) {
        const cell = board.querySelector(`[data-index="${index}"]`); // Crea una constante que obtiene referencia a la celda en el array 'cells'
        if (cell.classList.contains('revealed') || cell.classList.contains('flagged')) {
            return; // verifica si la celda ha sido revelada o marcada, si es así no realiza ninguna otra acción
        }

        if (cell.classList.contains('bomb')) {
            // Fin del juego si se revela una bomba
            window.location.href = 'Lose.html'; // Si clickas una bomba pierdes y te sale el siguiente mensaje
            resetGame(); // Se resetea todo
        } else {
            const bombCount = countAdjacentBombs(index); //cuenta el número de celdas vecinas con bomba
            cell.classList.add('revealed'); //marca la celda actual como revelada
            cell.textContent = bombCount > 0 ? bombCount : ''; //si la celda tiene bombas vecinas, se muestra el número de bombas
            if (bombCount === 0) {
                // Si no hay bombas adyacentes, revelar celdas vecinas
                revealAdjacentCells(index);
            }
        }
    }

    // Función para contar el número de bombas adyacentes a una celda
    function countAdjacentBombs(index) {
        const neighbors = getNeighbors(index); //obtener los índices de las celdas vecinas a la celda que marcas
        return neighbors.filter(neighbor => board.querySelector(`[data-index="${neighbor}"]`).classList.contains('bomb')).length;
    }

    // Función para revelar celdas adyacentes si no hay bombas
    function revealAdjacentCells(index) {
        const neighbors = getNeighbors(index); //lo mismo que arriba
        neighbors.forEach(neighbor => revealCell(neighbor)); //revela las celdas que no tienen bomba alrededor
    }

    // Función para marcar/desmarcar una bomba con una banderita
    function toggleFlag(index) { //alterna la clase
        const cell = board.querySelector(`[data-index="${index}"]`); // obtiene la referencia a la celda a partir del indice dado 
        if (!cell.classList.contains('revealed')) { // verifica si la clase 'revealed' esta presente en la celda
            cell.classList.toggle('flagged'); // cambia la clase a 'abanderada' 
        }
    }

    // Función para obtener los índices de las celdas adyacentes a una celda
    function getNeighbors(index) {
        const row = Math.floor(index / size);
        const col = index % size;

        const neighbors = [];

        for (let i = Math.max(0, row - 1); i <= Math.min(size - 1, row + 1); i++) { //establece que no sea negativo y que el máximo de alcance vecino es 1 (filas)
            for (let j = Math.max(0, col - 1); j <= Math.min(size - 1, col + 1); j++) { //lo mismo pero con las columnas
                if (!(i === row && j === col)) { //verifica que 'row', 'col' es diferente que 'i', 'j'. Si es lo mismo se elude como vecino
                    neighbors.push(i * size + j); //si es diferente se cuentan el número de celdas adyacentes con bomba 
                }
            }
        }

        return neighbors;
    }

    // Función para reiniciar el juego
    function resetGame() {
        board.innerHTML = '';
        generateBoard();
    }

    // Generar el tablero al cargar la página
    generateBoard();

    //TEMPORIZADOR
    function startTimer(seconds=0) {
        timerInterval = setInterval(() => {
        console.log(seconds)
          seconds++;
          updateTimer(seconds);
        }, 1000);
    }

    function updateTimer(seconds) {
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = seconds;
        }
    }
    function stopTimer(seconds) {
        clearInterval(timerInterval);

    }
    function resetGame(seconds) {
        stopTimer(seconds); // Detener el temporizador al reiniciar
        seconds = 0; // Reiniciar el tiempo
        board.innerHTML = '';
        generateBoard(seconds);
        updateTimer(seconds); // Actualizar el temporizador en la interfaz
        startTimer(seconds); //Iniciar de nuevo la cuenta
    }
    startTimer();

    
});
