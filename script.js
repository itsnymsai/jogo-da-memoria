const cards = [
    '❤️', '❤️',
    '🩷', '🩷',
    '💙', '💙', 
    '🧡', '🧡',
    '💛', '💛',
    '💚', '💚',
    '🖤', '🖤',
    '🤎', '🤎' 
];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let attempts = 5; 
let gameStarted = false; 
let timerInterval; 
let elapsedTime = 0; 

const gameBoard = document.getElementById('game-board');
const restartButton = document.getElementById('restart');
const winModal = document.getElementById('modal'); 
const loseModal = document.getElementById('lose-modal'); 
const closeWinButton = document.getElementById('close'); 
const closeLoseButton = document.getElementById('close-lose'); 
const introModal = document.getElementById('intro-modal'); 
const closeIntroButton = document.getElementById('close-intro'); 
const startButton = document.getElementById('start-game'); 

window.onload = function() {
    introModal.style.display = "block"; 
};

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function createBoard() {
    gameBoard.innerHTML = ''; 
    shuffle(cards).forEach((card) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');

        const front = document.createElement('div');
        front.classList.add('front');
        front.textContent = card; 

        const back = document.createElement('div');
        back.classList.add('back');
        back.textContent = ''; 

        cardElement.appendChild(front);
        cardElement.appendChild(back);
        
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });
}

function updateTimer() {
    elapsedTime++; 
    document.getElementById('timer').textContent = `Tempo: ${elapsedTime}s`; 
}

function updateAttempts() {
    document.getElementById('attempts-counter').textContent = `Tentativas restantes: ${attempts}`; 
}

function flipCard() {
    if (lockBoard || !gameStarted) return; 
    if (this === firstCard) return;

    this.classList.add('flipped');
    const front = this.querySelector('.front');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;

    checkForMatch();
}

function checkForMatch() {
    if (firstCard.querySelector('.front').textContent === secondCard.querySelector('.front').textContent) {
        resetBoard();
        checkForWin(); 
    } else {
        attempts--; 
        updateAttempts(); 

        if (attempts <= 0) {
            endGame(); 
            return; 
        }

        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1000);
    }
}

function endGame() {
    clearInterval(timerInterval); 

    const allCards = document.querySelectorAll('.card');
    const totalPairs = allCards.length / 2; 
    const flippedCards = document.querySelectorAll('.flipped').length / 2; 
    const remainingPairs = totalPairs - flippedCards; 

    document.getElementById('attempts').textContent = attempts; 
    document.getElementById('time').textContent = `${elapsedTime}s`; 
    document.getElementById('remaining-cards').textContent = `Faltaram ${remainingPairs} pares!🥺`; 
    loseModal.style.display = "block"; 
}

function checkForWin() {
    const allCards = document.querySelectorAll('.card');
    const flippedCards = document.querySelectorAll('.flipped');

    if (allCards.length === flippedCards.length) {
        clearInterval(timerInterval); 
        document.getElementById('attempts').textContent = attempts; 
        document.getElementById('time').textContent = `${elapsedTime}s`; 
        winModal.style.display = "block"; 
    }
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

function restartGame() {
    gameBoard.innerHTML = '';
    createBoard();
    attempts = 5; 
    updateAttempts(); 
    lockBoard = false; 
    winModal.style.display = "none"; 
    loseModal.style.display = "none"; 
    introModal.style.display = "block"; 
    clearInterval(timerInterval); 
    elapsedTime = 0; 
    document.getElementById('timer').textContent = `Tempo: ${elapsedTime}s`; 
}

document.getElementById('restart-from-win').onclick = function() {
    restartGame(); 
};

document.getElementById('restart-from-lose').onclick = function() {
    restartGame(); 
};

closeWinButton.onclick = function() {
    winModal.style.display = "none";
}

closeLoseButton.onclick = function() {
    loseModal.style.display = "none";
}

closeIntroButton.onclick = function() {
    introModal.style.display = "none";
}

startButton.onclick = function() {
    introModal.style.display = "none"; 
    gameStarted = true; 
    createBoard(); 
    elapsedTime = 0; 
    document.getElementById('timer').textContent = `Tempo: ${elapsedTime}s`; 
    updateAttempts(); 

    setTimeout(() => {
        timerInterval = setInterval(updateTimer, 1000); 
    }, 2000); 

    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => {
        card.classList.add('flipped');
    });

    setTimeout(() => {
        allCards.forEach(card => {
            card.classList.remove('flipped');
        });
    }, 2000); 
}

restartButton.addEventListener('click', restartGame);
