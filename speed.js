const textContainer = document.getElementById('text-to-type');
const startBtn = document.getElementById('startBtn');
const resultElement = document.getElementById('result');
const accuracyElement = document.getElementById('accuracy');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const difficultySelect = document.getElementById('difficulty-select');

const texts = {
    easy: [
        "The quick brown fox jumps over the lazy dog.",
        "Hello World!",
        "I love coding.",
        "JavaScript is fun.",
        "Learning to type fast."
    ],
    medium: [
        "A journey of a thousand miles begins with a single step.",
        "The best way to predict the future is to create it.",
        "In the middle of difficulty lies opportunity.",
        "Success is not final, failure is not fatal.",
        "The only limit to our realization of tomorrow is our doubts of today."
    ],
    hard: [
        "It does not matter how slowly you go as long as you do not stop.",
        "Life is what happens when you're busy making other plans.",
        "The future belongs to those who believe in the beauty of their dreams.",
        "Do not go where the path may lead, go instead where there is no path and leave a trail.",
        "The only way to do great work is to love what you do.",
        "Success is not just about what you accomplish in your life; it's about what you inspire others to do."
    ]
};

let currentText = '';
let userTyping = '';
let startTime = 0;
let typingErrors = 0;
let currentIndex = 0;

// Generate random text based on selected difficulty
function generateRandomText() {
    const selectedDifficulty = difficultySelect.value;
    const randomIndex = Math.floor(Math.random() * texts[selectedDifficulty].length);
    currentText = texts[selectedDifficulty][randomIndex];
    textContainer.textContent = currentText;
}

// Start the typing test
function startTest() {
    currentIndex = 0;  // Reset sentence index
    generateRandomText();
    userTyping = '';
    typingErrors = 0;
    resultElement.textContent = '';
    accuracyElement.textContent = 'Accuracy: 100%';
    startBtn.disabled = true;
    startTime = Date.now();
    drawTypingProgress();
}

// Real-time feedback for user input
document.addEventListener('keydown', function (event) {
    if (startBtn.disabled) {
        if (event.key === 'Backspace') {
            userTyping = userTyping.slice(0, -1);
        } else if (event.key.length === 1) {
            userTyping += event.key;
        }

        typingErrors = 0;
        for (let i = 0; i < userTyping.length; i++) {
            if (userTyping[i] !== currentText[i]) {
                typingErrors++;
            }
        }

        const accuracy = Math.floor(((userTyping.length - typingErrors) / userTyping.length) * 100);
        accuracyElement.textContent = `Accuracy: ${accuracy}%`;

        drawTypingProgress();

        if (event.key === 'Enter') {  // Check if Enter key is pressed
            const timeTaken = Math.floor((Date.now() - startTime) / 1000);
            const wordsTyped = userTyping.trim().split(' ').length;
            const wpm = Math.floor((wordsTyped / timeTaken) * 60);

            resultElement.textContent = `You typed at ${wpm} words per minute with ${typingErrors} errors. Time: ${timeTaken}s`;
            resultElement.style.opacity = 1; // Fade in result
            startBtn.disabled = false; // Enable the start button for the next test
        }
    }
});

// Draw typing progress on the canvas
function drawTypingProgress() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '20px Arial';
    ctx.fillStyle = '#333';
    ctx.textBaseline = 'top';

    ctx.fillText(currentText, 10, 10);

    ctx.fillStyle = '#e74c3c';
    ctx.fillText(userTyping, 10, 40);

    ctx.fillStyle = '#2ecc71';
    ctx.fillText(currentText.substring(0, userTyping.length), 10, 40);

    ctx.fillStyle = '#ccc';
    ctx.fillText(currentText.substring(userTyping.length), 10 + ctx.measureText(userTyping).width, 40);
}

// Start button click event
startBtn.addEventListener('click', function () {
    startTest();
});

// Refresh text when difficulty level changes
difficultySelect.addEventListener('change', function () {
    generateRandomText();
    userTyping = '';
    resultElement.textContent = '';
    accuracyElement.textContent = 'Accuracy: 100%';
});