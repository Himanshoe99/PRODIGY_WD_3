const app = document.getElementById('app');
const themeToggle = document.getElementById('themeToggle');
const menuContent = document.getElementById('menuContent');
const gameContent = document.getElementById('gameContent');
const gameBoard = document.getElementById('gameBoard');
const gameStatus = document.getElementById('gameStatus');
const resetGame = document.getElementById('resetGame');
const backToMenu = document.getElementById('backToMenu');
const aiDifficulty = document.getElementById('aiDifficulty');
const streakElement = document.getElementById('streak');

let isDarkMode = false;
let gameMode = 'menu';
let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let winner = null;
let streak = 0;

function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.documentElement.classList.toggle('dark', isDarkMode);
    themeToggle.innerHTML = `<i data-lucide="${isDarkMode ? 'sun' : 'moon'}"></i>`;
    themeToggle.setAttribute('aria-label', `Switch to ${isDarkMode ? 'light' : 'dark'} mode`);
    lucide.createIcons();
}

function setGameMode(mode) {
    gameMode = mode;
    menuContent.classList.add('hidden');
    gameContent.classList.remove('hidden');
    aiDifficulty.classList.toggle('hidden', mode !== 'ai');
    resetBoard();
}

function resetBoard() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    winner = null;
    renderBoard();
    updateGameStatus();
}

function renderBoard() {
    gameBoard.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('button');
        cell.className = 'btn game-cell';
        cell.textContent = board[i];
        cell.addEventListener('click', () => handleCellClick(i));
        gameBoard.appendChild(cell);
    }
}

function handleCellClick(index) {
    if (board[index] || winner) return;
    makeMove(index);
    if (!winner && !board.includes('')) {
        winner = 'draw';
    }
    if (!winner && gameMode === 'ai' && currentPlayer === 'O') {
        setTimeout(makeAIMove, 500);
    }
    updateGameStatus();
}

function makeMove(index) {
    board[index] = currentPlayer;
    renderBoard();
    checkGameEnd();
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function checkGameEnd() {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let line of lines) {
        const [a, b, c] = line;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            winner = board[a];
            updateStreak(winner === 'X' ? 'win' : 'lose');
            return;
        }
    }
    if (!board.includes('')) {
        winner = 'draw';
        updateStreak('draw');
    }
}

function updateGameStatus() {
    if (winner) {
        gameStatus.textContent = winner === 'draw' ? "It's a draw!" : `Winner: ${winner}`;
    } else {
        gameStatus.textContent = `Next player: ${currentPlayer}`;
    }
}

function updateStreak(result) {
    if (result === 'win') {
        streak++;
    } else {
        streak = 0;
    }
    streakElement.textContent = `Streak: ${streak}`;
}

function makeAIMove() {
    if (winner) return;

    // Check for winning move
    for (let i = 0; i < 9; i++) {
        if (!board[i]) {
            board[i] = 'O';
            if (checkWinner('O')) {
                makeMove(i);
                return;
            }
            board[i] = '';
        }
    }

    // Check for blocking move
    for (let i = 0; i < 9; i++) {
        if (!board[i]) {
            board[i] = 'X';
            if (checkWinner('X')) {
                makeMove(i);
                return;
            }
            board[i] = '';
        }
    }

    // Take center if available
    if (!board[4]) {
        makeMove(4);
        return;
    }

    // Take a corner
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => !board[i]);
    if (availableCorners.length > 0) {
        const randomCorner = availableCorners[Math.floor(Math.random() * availableCorners.length)];
        makeMove(randomCorner);
        return;
    }

    // Take any available space
    const availableSpaces = board.reduce((acc, cell, index) => !cell ? [...acc, index] : acc, []);
    if (availableSpaces.length > 0) {
        const randomSpace = availableSpaces[Math.floor(Math.random() * availableSpaces.length)];
        makeMove(randomSpace);
    }
}

function checkWinner(player) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return lines.some(([a, b, c]) => 
        board[a] === player && board[b] === player && board[c] === player
    );
}

themeToggle.addEventListener('click', toggleTheme);
document.getElementById('playHuman').addEventListener('click', () => setGameMode('human'));
document.getElementById('playAI').addEventListener('click', () => setGameMode('ai'));
resetGame.addEventListener('click', resetBoard);
backToMenu.addEventListener('click', () => {
    gameMode = 'menu';
    menuContent.classList.remove('hidden');
    gameContent.classList.add('hidden');
});

lucide.createIcons();
renderBoard();
updateGameStatus();

