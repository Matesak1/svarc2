const GRID_SIZE = 10;
const TOTAL_CARDS = 100; 
const CARD_VALUES = ["apple", "stone", "brave", "quick", "light",
"small", "green", "blue", "round", "short",
"plant", "chair", "table", "sweet", "fresh",
"smile", "bread", "water", "grass", "cloud",
"wind", "rain", "snow", "leaf", "bird",
"fish", "milk", "salt", "sand", "rock",
"star", "moon", "fire", "tree", "seed",
"hand", "foot", "back", "door", "road",
"path", "hill", "lake", "home", "song",
"word", "book", "time", "name", "heart"]; 
const UNIQUE_PAIRS = TOTAL_CARDS / 2;

let gameBoard = [];
let flippedCards = []; 
let matchedCards = new Set(); 
let pairsFound = 0;
let mistakes = 0;
let lockBoard = false; 

function createBoard() {
    let values = [...CARD_VALUES, ...CARD_VALUES];
    for (let i = values.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [values[i], values[j]] = [values[j], values[i]];
    }
    gameBoard = values;
}

function renderBoard() {
    const container = document.getElementById('game-container');
    container.innerHTML = ''; 
    container.className = 'game-grid'; 
    for (let i = 0; i < gameBoard.length; i++) {
            const button = document.createElement('button');
            button.id = 'card-' + i;
            button.className = 'card-button';
            button.textContent = "?";
            button.onclick = () => handleCardClick(i);
            container.appendChild(button);
    }
}

function handleCardClick(index) {
    if (lockBoard || matchedCards.has(index) || flippedCards.includes(index)) {
        return;
    }
    const cardElement = document.getElementById('card-' + index);
    cardElement.textContent = gameBoard[index];
    cardElement.style.backgroundColor = "orange";
    cardElement.disabled = true;
    flippedCards.push(index);

    if (flippedCards.length === 2) {
        lockBoard = true;
        const [idx1, idx2] = flippedCards;
        const value1 = gameBoard[idx1];
        const value2 = gameBoard[idx2];
        if (value1 === value2) { //pair matched
            pairsFound++;
            matchedCards.add(idx1);
            matchedCards.add(idx2);
            document.getElementById('card-' + idx1).style.backgroundColor = "green";
            document.getElementById('card-' + idx2).style.backgroundColor = "green";
            updateMessage();
            if (pairsFound === UNIQUE_PAIRS) {
                document.getElementById('message').textContent = "Game Done!";
            }
            flippedCards = [];
            lockBoard = false;
        } else { //pair not matched
            document.getElementById('card-' + idx1).style.backgroundColor = "red";
            document.getElementById('card-' + idx2).style.backgroundColor = "red";
            mistakes++; 
            updateMessage();
            setTimeout(() => { // Flip cards back
                document.getElementById('card-' + idx1).textContent = "?";
                document.getElementById('card-' + idx2).textContent = "?";
                document.getElementById('card-' + idx1).style.backgroundColor = "white"; 
                document.getElementById('card-' + idx2).style.backgroundColor = "white";
                document.getElementById('card-' + idx1).disabled = false;
                document.getElementById('card-' + idx2).disabled = false;
                flippedCards = [];
                lockBoard = false;
            }, 1000); // 1 second delay
        }
    }
}

function updateMessage() {
    const remaining = UNIQUE_PAIRS - pairsFound;
    document.getElementById('pairs-remaining').textContent = `Pairs Remaining: ${remaining}`;
    document.getElementById('mistakes').textContent = `Mistakes: ${mistakes}`;
}

function startGame() {
    createBoard();
    renderBoard();
    updateMessage();
}

window.onload = startGame;