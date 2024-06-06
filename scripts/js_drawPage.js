const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const color = document.getElementById("Color");
const colorOptions = Array.from(document.getElementsByClassName("color-option"));
const brush = document.getElementById("Brush");
const erase = document.getElementById("Erase");
const range = document.getElementById("Range");
const startTimerBtn = document.getElementById("startTimer");
const clearCanvasBtn = document.getElementById("clearCanvas");
const saveCanvasBtn = document.getElementById("saveCanvas");
const loadCanvasBtn = document.getElementById("loadCanvas");
const deleteCanvasBtn = document.getElementById("deleteCanvas");
const timerDisplay = document.getElementById("timerDisplay");
const wordDisplay = document.getElementById("wordDisplay");

const INITIAL_COLOR = "#2c2c2c";
const INITIAL_LINEWIDTH = 5.0;
const CANVAS_WIDTH_SIZE = 700;
const CANVAS_HEIGHT_SIZE = 500;

canvas.width = CANVAS_WIDTH_SIZE;
canvas.height = CANVAS_HEIGHT_SIZE;
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

function onColorChange(event) {     // 색 팔레트 바꾸기
    ctx.strokeStyle = event.target.value;
    ctx.fillStyle = event.target.value;
}

function onColorClik(event) {   // 색 선택 버튼
    const colorValue = event.target.dataset.color;
    ctx.strokeStyle = colorValue;
    ctx.fillStyle = colorValue;
    color.value = colorValue;
}

function clearCanvas() {
    ctx.clearRect(0, 0, CANVAS_WIDTH_SIZE, CANVAS_HEIGHT_SIZE);
}

function saveCanvas() {
    const title = prompt("제목을 입력하세요:");
    if (!title) return;
    const dataURL = canvas.toDataURL();
    let drawings = JSON.parse(localStorage.getItem("drawings")) || [];
    drawings.push({ title, dataURL });
    localStorage.setItem("drawings", JSON.stringify(drawings));
    alert("그림이 저장되었습니다.");
}

function loadCanvas() {
    const drawings = JSON.parse(localStorage.getItem("drawings")) || [];
    const titles = drawings.map(d => d.title).join("\n");
    const title = prompt(`불러올 그림의 제목을 입력하세요:\n${titles}`);
    const drawing = drawings.find(d => d.title === title);
    if (drawing) {
        const img = new Image();
        img.src = drawing.dataURL;
        img.onload = function () {
            ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
            ctx.drawImage(img, 0, 0);
        }
    } else {
        alert("해당 제목의 그림이 없습니다.");
    }
}

function deleteCanvas() {
    const drawings = JSON.parse(localStorage.getItem("drawings")) || [];
    const titles = drawings.map(d => d.title).join("\n");
    const title = prompt(`삭제할 그림의 제목을 입력하세요:\n${titles}`);
    const newDrawings = drawings.filter(d => d.title !== title);
    localStorage.setItem("drawings", JSON.stringify(newDrawings));
    alert("그림이 삭제되었습니다.");
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
saveCanvasBtn.addEventListener("click", saveCanvas);
loadCanvasBtn.addEventListener("click", loadCanvas);
deleteCanvasBtn.addEventListener("click", deleteCanvas);

colorOptions.forEach(color => color.addEventListener("click", onColorClik));
