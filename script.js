const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 350;
canvas.height = 600;

// Images

const spermImg = new Image();
spermImg.src = "sperm.png";

const gateTop = new Image();
gateTop.src = "gate-top.png";

const gateBottom = new Image();
gateBottom.src = "gate-bottom.png";

// Sperm
let sperm = {
  x: 80,
  y: 200,
  radius: 18,
  gravity: 0.5,
  lift: -9,
  velocity: 0
};

let walls = [];
let frame = 0;
let babies = 0;
let gameOver = false;

// Audio
const bgMusic = document.getElementById("bgMusic");
const victorySound = document.getElementById("victorySound");

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

// Update sperm
function updateSperm() {
  sperm.velocity += sperm.gravity;
  sperm.y += sperm.velocity;

  if (sperm.y > canvas.height || sperm.y < 0) {
    endGame();
  }
}

// Create gate
function createWall() {
  let gap = 140;
  let topHeight = Math.random() * 250 + 50;

  walls.push({
    x: canvas.width,
    top: topHeight,
    bottom: topHeight + gap,
    width: 70,
    passed: false
  });
}

// Draw gates
function drawWalls() {
  walls.forEach(wall => {
    wall.x -= 2;

    ctx.drawImage(gateTop, wall.x, 0, wall.width, wall.top);
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
      document.getElementById("score").innerText =
        "Babies: " + babies;

      if (babies % 10 === 0) {
        victorySound.play();
      }
    }
  });

  walls = walls.filter(w => w.x > -80);
}

// Tap
function swim() {
  sperm.velocity = sperm.lift;
  bgMusic.play();
}

// End
function endGame() {
  gameOver = true;
  bgMusic.pause();
  victorySound.play();

  setTimeout(() => {
    alert("Journey ended! Babies: " + babies);
    location.reload();
  }, 200);
}

// Loop
function gameLoop() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updateSperm();
  drawSperm();

  if (frame % 100 === 0) createWall();

  drawWalls();

  frame++;
  requestAnimationFrame(gameLoop);
}

// Events
document.addEventListener("click", swim);
document.addEventListener("touchstart", swim);

gameLoop();

