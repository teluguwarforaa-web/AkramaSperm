const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const startBtn = document.getElementById("startBtn");
const startScreen = document.getElementById("startScreen");
const resultScreen = document.getElementById("resultScreen");
const finalScore = document.getElementById("finalScore");

const bgMusic = document.getElementById("bgMusic");
const victorySound = document.getElementById("victorySound");

let gameStarted = false;
let score = 0;

let sperm = {
  x: 50,
  y: canvas.height / 2,
  gravity: 0.5,
  velocity: 0,
  lift: -10
};

let gates = [];

document.body.addEventListener("click", () => {
  bgMusic.load();
  victorySound.load();
}, { once: true });

startBtn.onclick = () => {
  startScreen.style.display = "none";
  resultScreen.style.display = "none";
  gameStarted = true;
  score = 0;
  gates = [];

  bgMusic.currentTime = 0;
  bgMusic.play().catch(e => console.log(e));
};

canvas.addEventListener("click", () => {
  if (gameStarted) sperm.velocity = sperm.lift;
});

function createGate() {
  let gap = 150;
  let top = Math.random() * (canvas.height - gap - 100) + 50;

  gates.push({
    x: canvas.width,
    top: top,
    bottom: top + gap
  });
}

function update() {
  if (!gameStarted) return;

  sperm.velocity += sperm.gravity;
  sperm.y += sperm.velocity;

  if (Math.random() < 0.02) createGate();

  for (let i = 0; i < gates.length; i++) {
    gates[i].x -= 3;

    if (
      sperm.x > gates[i].x &&
      sperm.x < gates[i].x + 50 &&
      (sperm.y < gates[i].top || sperm.y > gates[i].bottom)
    ) {
      gameOver();
    }

    if (gates[i].x + 50 < sperm.x && !gates[i].passed) {
      score++;
      gates[i].passed = true;
      document.getElementById("score").innerText = "Babies: " + score;
    }
  }

  if (sperm.y > canvas.height || sperm.y < 0) gameOver();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(sperm.x, sperm.y, 10, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "green";
  gates.forEach(g => {
    ctx.fillRect(g.x, 0, 50, g.top);
    ctx.fillRect(g.x, g.bottom, 50, canvas.height);
  });
}

function gameOver() {
  gameStarted = false;

  // Stop background music
  bgMusic.pause();
  bgMusic.currentTime = 0;

  // Show result
  resultScreen.style.display = "flex";
  finalScore.innerText = "Final Babies: " + score;

  // Victory sound WITH result
  setTimeout(() => {
    victorySound.currentTime = 0;
    victorySound.play().catch(e => console.log(e));
  }, 100);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
