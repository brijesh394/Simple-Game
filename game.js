const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const paddleWidth = 10;
const paddleHeight = 100;
const ballRadius = 10;
const playerX = 20;
const aiX = canvas.width - paddleWidth - 20;

// Paddle objects
let playerY = canvas.height / 2 - paddleHeight / 2;
let aiY = canvas.height / 2 - paddleHeight / 2;

// Ball object
let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: 5 * (Math.random() > 0.5 ? 1 : -1),
    vy: 3 * (Math.random() > 0.5 ? 1 : -1)
};

// Draw paddles and ball
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Player paddle
    ctx.fillStyle = "#fff";
    ctx.fillRect(playerX, playerY, paddleWidth, paddleHeight);

    // AI paddle
    ctx.fillStyle = "#fff";
    ctx.fillRect(aiX, aiY, paddleWidth, paddleHeight);

    // Ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();
}

// Move AI paddle (simple AI)
function moveAI() {
    const aiCenter = aiY + paddleHeight / 2;
    if (ball.y < aiCenter - 10) {
        aiY -= 4;
    } else if (ball.y > aiCenter + 10) {
        aiY += 4;
    }
    // Prevent AI paddle from leaving the canvas
    aiY = Math.max(0, Math.min(canvas.height - paddleHeight, aiY));
}

// Move ball and handle collision
function moveBall() {
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Top and bottom wall collision
    if (ball.y - ballRadius < 0 || ball.y + ballRadius > canvas.height) {
        ball.vy *= -1;
    }

    // Player paddle collision
    if (
        ball.x - ballRadius < playerX + paddleWidth &&
        ball.y > playerY &&
        ball.y < playerY + paddleHeight
    ) {
        ball.x = playerX + paddleWidth + ballRadius; // Avoid sticking
        ball.vx *= -1.1; // Increase speed a bit
        // Add a bit of "spin" based on where it hits the paddle
        let collidePoint = ball.y - (playerY + paddleHeight / 2);
        ball.vy += collidePoint * 0.05;
    }

    // AI paddle collision
    if (
        ball.x + ballRadius > aiX &&
        ball.y > aiY &&
        ball.y < aiY + paddleHeight
    ) {
        ball.x = aiX - ballRadius; // Avoid sticking
        ball.vx *= -1.1; // Increase speed a bit
        let collidePoint = ball.y - (aiY + paddleHeight / 2);
        ball.vy += collidePoint * 0.05;
    }

    // Left or right wall (reset ball)
    if (ball.x - ballRadius < 0 || ball.x + ballRadius > canvas.width) {
        resetBall();
    }
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.vx = 5 * (Math.random() > 0.5 ? 1 : -1);
    ball.vy = 3 * (Math.random() > 0.5 ? 1 : -1);
}

// Mouse control for left paddle
canvas.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    playerY = mouseY - paddleHeight / 2;
    playerY = Math.max(0, Math.min(canvas.height - paddleHeight, playerY));
});

// Main game loop
function gameLoop() {
    moveAI();
    moveBall();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();