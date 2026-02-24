const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 350;
canvas.height = 600;

// Start system
let gameStarted = false;
let gameOver = false;

const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");
const scoreDisplay = document.getElementById("score");

// Sounds
const bgMusic = document.getElementById("bgMusic");
const victorySound = document.getElementById("victorySound");

// Images
const spermImg = new Image();
spermImg.src = "sperm.png";

const gateTop = new Image();
gateTop.src = "gate-top.png";

const gateBottom = new Image();
gateBottom.src = "gate-bottom.png";

// Player
let sperm = {
  x: 80,
  y: 200,
  radius: 20,
  gravity: 0.5,
  lift: -9,
  velocity: 0
};

let walls = [];
let frame = 0;
let babies = 0;

// Draw sperm
function drawSperm() {
  ctx.drawImage(
    spermImg,
    sperm.x - sperm.radius,
    sperm.y - sperm.radius,
    sperm.radius * 2,
    sperm.radius * 2
  );
}

// Physics
function updateSperm() {
  sperm.velocity += sperm.gravity;
  sperm.y += sperm.velocity;

  if (sperm.y > canvas.height || sperm.y < 0) {
    endGame();
  }
}

// Walls
function createWall() {
  let gap = 150;
  let topHeight = Math.random() * 250 + 50;

  walls.push({
    x: canvas.width,
    top: topHeight,
    bottom: topHeight + gap,
    width: 70,
    passed: false
  });
}

function drawWalls() {
  walls.forEach(wall => {

    wall.x -= 2;

    ctx.drawImage(gateTop, wall.x, 0, wall.width, wall.top);
    ctx.drawImage(gateBottom, wall.x, wall.bottom, wall.width, canvas.height);

    // Collision
    if (
      sperm.x + sperm.radius > wall.x &&
      sperm.x - sperm.radius < wall.x + wall.width &&
      (sperm.y < wall.top || sperm.y > wall.bottom)
    ) {
      endGame();
    }

    // Score
    if (!wall.passed && wall.x + wall.width < sperm.x) {
      babies++;
      wall.passed = true;
      scoreDisplay.innerText = "Babies: " + babies;
    }
  });

  walls = walls.filter(w => w.x > -100);
}

// Swim
function swim() {
  if (!gameStarted) return;
  sperm.velocity = sperm.lift;
}

document.addEventListener("click", swim);
document.addEventListener("touchstart", swim);

// Game loop
function gameLoop() {
  if (!gameStarted || gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updateSperm();
  drawSperm();

  if (frame % 100 === 0) createWall();
  drawWalls();

  frame++;
  requestAnimationFrame(gameLoop);
}

// Start button
startBtn.addEventListener("click", () => {
  gameStarted = true;
  startScreen.style.display = "none";
  scoreDisplay.style.display = "block";

  bgMusic.play();
  gameLoop();
});

// End game
function endGame() {
  gameOver = true;
  victorySound.play();

  setTimeout(() => {
    alert("Journey ended! Babies: " + babies);
    location.reload();
  }, 200);
}
