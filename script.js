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


// Images
const spermImg = new Image();
spermImg.src = "sperm.png";

const gateTop = new Image();
gateTop.src = "gate-top.png";

const gateBottom = new Image();
gateBottom.src = "gate-bottom.png";

// Game objects
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
let gameOver = false;

// Sounds
const bgMusic = document.getElementById("bgMusic");
const victorySound = document.getElementById("victorySound");
let musicStarted = false;

// Draw sperm
function drawSperm() {
  ctx.drawImage(
    spermImg,
    sperm.x - sperm.radius,
    sperm.y - sperm.radius,
    sperm.radius * 2,
    sperm.radius * 2
  );

  // Tail animation
  ctx.beginPath();
  ctx.moveTo(sperm.x - sperm.radius, sperm.y);
  for (let i = 0; i < 5; i++) {
    let x = sperm.x - sperm.radius - i * 10;
    let y = sperm.y + Math.sin(frame * 0.3 + i) * 6;
    ctx.lineTo(x, y);
  }
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.stroke();
}

// Update sperm
function updateSperm() {
  sperm.velocity += sperm.gravity;
  sperm.y += sperm.velocity;

  if (sperm.y + sperm.radius > canvas.height || sperm.y - sperm.radius < 0) {
    endGame();
  }
}

// Create walls
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

// Draw walls
function drawWalls() {
  walls.forEach(wall => {

    wall.x -= 2;

    // Top gate
    ctx.drawImage(
      gateTop,
      wall.x,
      0,
      wall.width,
      wall.top
    );

    // Bottom gate
    ctx.drawImage(
      gateBottom,
      wall.x,
      wall.bottom,
      wall.width,
      canvas.height - wall.bottom
    );

    // Collision
    if (
      sperm.x + sperm.radius > wall.x &&
      sperm.x - sperm.radius < wall.x + wall.width &&
      (sperm.y - sperm.radius < wall.top ||
       sperm.y + sperm.radius > wall.bottom)
    ) {
      endGame();
    }

    // Score
    if (!wall.passed && wall.x + wall.width < sperm.x) {
      babies++;
      wall.passed = true;
      document.getElementById("score").innerText = "Babies: " + babies;

      if (babies % 10 === 0) {
        victorySound.currentTime = 0;
        victorySound.play();
      }
    }
  });

  walls = walls.filter(wall => wall.x + wall.width > 0);
}

// Tap to swim
function swim() {
  sperm.velocity = sperm.lift;

  if (!musicStarted) {
    bgMusic.play();
    musicStarted = true;
  }
}

// End game
function endGame() {
  gameOver = true;
  bgMusic.pause();
  victorySound.play();

  setTimeout(() => {
    alert("Journey ended! Total babies: " + babies);
    location.reload();
  }, 200);
}

// Game loop
function gameLoop() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updateSperm();
  drawSperm();

  if (frame % 100 === 0) {
    createWall();
  }

  drawWalls();

  frame++;
  requestAnimationFrame(gameLoop);
}

// Controls
document.addEventListener("click", swim);
document.addEventListener("touchstart", swim);

gameLoop();
