const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 350;
canvas.height = 600;

/* ---------------- GAME STATE ---------------- */
let gameStarted = false;
let gameOver = false;
let babies = 0;
let frame = 0;

/* ---------------- ELEMENTS ---------------- */
const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const scoreDisplay = document.getElementById("score");
const finalScoreText = document.getElementById("finalScore");

const bgMusic = document.getElementById("bgMusic");
const victorySound = document.getElementById("victorySound");

/* ---------------- IMAGES ---------------- */
const spermImg = new Image();
spermImg.src = "sperm.png";

const gateTop = new Image();
gateTop.src = "gate-top.png";

const gateBottom = new Image();
gateBottom.src = "gate-bottom.png";

/* ---------------- PLAYER ---------------- */
let sperm = {
  x: 80,
  y: 200,
  radius: 20,
  gravity: 0.5,
  lift: -9,
  velocity: 0
};

/* ---------------- WALLS ---------------- */
let walls = [];

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

/* ---------------- PLAYER UPDATE ---------------- */
function updateSperm() {
  sperm.velocity += sperm.gravity;
  sperm.y += sperm.velocity;

  if (sperm.y < 0 || sperm.y > canvas.height) {
    endGame();
  }

  ctx.drawImage(
    spermImg,
    sperm.x - sperm.radius,
    sperm.y - sperm.radius,
    sperm.radius * 2,
    sperm.radius * 2
  );
}

/* ---------------- CONTROLS ---------------- */
function swim() {
  if (!gameStarted) return;
  sperm.velocity = sperm.lift;
}

document.addEventListener("click", swim);
document.addEventListener("touchstart", swim);

/* ---------------- GAME LOOP ---------------- */
function gameLoop() {
  if (!gameStarted || gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updateSperm();

  if (frame % 100 === 0) createWall();
  drawWalls();

  frame++;
  requestAnimationFrame(gameLoop);
}

/* ---------------- START BUTTON ---------------- */
startBtn.addEventListener("click", () => {

  gameStarted = true;
  startScreen.style.display = "none";
  scoreDisplay.style.display = "block";

  // Start background music
  bgMusic.currentTime = 0;
  bgMusic.play();

  gameLoop();
});

/* ---------------- END GAME ---------------- */
function endGame() {

  if (gameOver) return;
  gameOver = true;

  // Stop background music
  bgMusic.pause();

  // Show result screen
  finalScoreText.innerText = "Babies: " + babies;
  gameOverScreen.style.display = "flex";

  // Play victory sound
  victorySound.currentTime = 0;
  victorySound.play();
}

/* ---------------- RESTART ---------------- */
restartBtn.addEventListener("click", () => {
  location.reload();
});
