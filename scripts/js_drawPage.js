const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const color = document.getElementById("Color");
const brush = document.getElementById("Brush");
const erase = document.getElementById("Erase");
const range = document.getElementById("Range");
const startTimerBtn = document.getElementById("startTimer");
const clearCanvasBtn = document.getElementById("clearCanvas");
const timerDisplay = document.getElementById("timerDisplay");
const wordDisplay = document.getElementById("wordDisplay");

const INITIAL_COLOR = "#2c2c2c";
const INITIAL_LINEWIDTH = 5.0;
const CANVAS_SIZE = 500;

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;
ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = range.value;

const MODE_BUTTON = [brush, erase];
let mode = brush;
let painting = false;

const words = ["사과", "바나나", "포도", "오렌지", "수박"]; // 미리 저장된 제시어들

function startPainting() { painting = true; }
function stopPainting() { painting = false; }

function onMouseMove(event) {
    const x = event.offsetX;
    const y = event.offsetY;
    if (mode === brush) {
        if (!painting) {
            ctx.beginPath();
            ctx.moveTo(x, y);
        }
        else {
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    }
    else if (mode === erase) {
        if (painting) {
            ctx.clearRect(x - ctx.lineWidth / 2, y - ctx.lineWidth / 2, ctx.lineWidth, ctx.lineWidth);
        }
    }
}

function handleModeChange(event) {
    mode = event.target;
    for (let i = 0; i < MODE_BUTTON.length; i++) {
        const button = MODE_BUTTON[i];
        if (button === mode) {
            button.style.backgroundColor = "skyblue";
        }
        else {
            button.style.backgroundColor = "white";
        }
    }
    if (mode === brush) {
        ctx.strokeStyle = INITIAL_COLOR;
    }
}


function startTimer() {
    const timerDuration = 5000; // 5 seconds for example
    let timeLeft = timerDuration / 1000;

    // 제시어 선택
    const randomIndex = Math.floor(Math.random() * words.length);
    const selectedWord = words[randomIndex];
    wordDisplay.textContent = `제시어: ${selectedWord}`;

    timerDisplay.textContent = `타이머: ${timeLeft}초`;

    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `타이머: ${timeLeft}초`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("시간 종료");
            window.location.reload(); // Reload the main page
        }
    }, 1000);
}


function handleRangeChange(event) {
    const size = event.target.value;
    ctx.lineWidth = size;
    range.value = size;
}

function onLineWidthChange(event) {
    ctx.lineWidth = event.target.value;
}

function onColorChange(event) {
    ctx.strokeStyle = event.target.value;
    ctx.fillStyle = event.target.value;
}

function clearCanvas() {
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
}

if (canvas) {
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mouseleave", stopPainting);
}

MODE_BUTTON.forEach(mode => mode.addEventListener("click", handleModeChange));
startTimerBtn.addEventListener("click", startTimer);
range.addEventListener("input", onLineWidthChange);
color.addEventListener("change", onColorChange);
clearCanvasBtn.addEventListener("click", clearCanvas);