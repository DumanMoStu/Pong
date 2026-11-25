//find players
const playerAreas = document.querySelectorAll("#player1, #player2");

//menu
const playerMenus = document.querySelectorAll(".player-menu");
const readyButtons = document.querySelectorAll(".ready-button");
const colorButtons = document.querySelectorAll(".color-button");

//gameplay elements
const score1Display = document.querySelector("#score1");
const score2Display = document.querySelector("#score2");

let scores = [0, 0];

const paddle1 = document.querySelector("#paddle1");
const paddle2 = document.querySelector("#paddle2");
const ball = document.querySelector("#ball");

//ready counters
let playerReady = [false, false];

const countdownDisplay = document.querySelector("#countdown");

let countdownInterval = null;

//color options
const colorMenus = document.querySelectorAll(".color-menu");
//player 1
const blueButtons = document.querySelectorAll(".blue-button");
const greenButtons = document.querySelectorAll(".green-button");
const purpleButtons = document.querySelectorAll(".purple-button");
//player 2
const redButtons = document.querySelectorAll(".red-button");
const yellowButtons = document.querySelectorAll(".yellow-button");
const orangeButtons = document.querySelectorAll(".orange-button");
//back
const backButtons = document.querySelectorAll(".back-button");

//function to start countdown
function startCountdown() {
    let count = 3;

    countdownDisplay.textContent = count;

    countdownInterval = setInterval(() => {
        count--;

        if (count > 0) {
            countdownDisplay.textContent = count;
        } else {
            countdownDisplay.textContent = "GO!";
            gameStarted = true;
            resetBall();
            playerMenus.forEach(menu => {
            menu.style.display = "none";
            });

            colorMenus.forEach(menu => {
                menu.style.display = "none";
            });

            setTimeout(() => {
                countdownDisplay.textContent = "";
            }, 700);

            clearInterval(countdownInterval);
            countdownInterval = null;
        }
    }, 1000);
}

// #region ALL BUTTONS
//menu buttons 
readyButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
        if (button.textContent === "NOT READY") {
            button.textContent = "READY!";
        } else {
            button.textContent = "NOT READY";
        }
        
        playerReady[index] = !playerReady[index];
        if (playerReady[0] && playerReady[1]) {
            startCountdown();
        } else {
            clearInterval(countdownInterval);
            countdownInterval = null;
            countdownDisplay.textContent = "";
        }
    });
});
colorButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
        playerMenus[index].style.display = "none";
        colorMenus[index].style.display = "flex";
    });
});

//Color buttons
//(player 1)
blueButtons.forEach(button => {
    button.addEventListener("click", () => {
        playerAreas[0].style.backgroundColor = "blue";
    });
});
greenButtons.forEach(button => {
    button.addEventListener("click", () => {
        playerAreas[0].style.backgroundColor = "green";
    });
});
purpleButtons.forEach(button => {
    button.addEventListener("click", () => {
        playerAreas[0].style.backgroundColor = "purple";
    });
});
//(player 2)
redButtons.forEach(button => {
    button.addEventListener("click", () => {
        playerAreas[1].style.backgroundColor = "red";
    });
});
yellowButtons.forEach(button => {
    button.addEventListener("click", () => {
        playerAreas[1].style.backgroundColor = "yellow";
    });
});
orangeButtons.forEach(button => {
    button.addEventListener("click", () => {
        playerAreas[1].style.backgroundColor = "orange";
    });
});
//back
backButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
        colorMenus[index].style.display = "none";
        playerMenus[index].style.display = "flex";
    });
});

//gameplay

//paddle movement
const activeTouches = {};

document.addEventListener("pointerdown", (event) => {
    const player = event.clientY < window.innerHeight / 2 ? 1 : 2;

    activeTouches[event.pointerId] = {
        lastX: event.clientX,
        paddle: player === 1 ? paddle1 : paddle2
    };
});

document.addEventListener("pointermove", (event) => {
    const touch = activeTouches[event.pointerId];

    if (!touch) return;

    const movement = touch.lastX - event.clientX;

    const paddle = touch.paddle;
    const currentX = parseFloat(getComputedStyle(paddle).left);
    const maxX = window.innerWidth - paddle.offsetWidth;

    const newX = Math.max(0, Math.min(maxX, currentX + movement));

    paddle.style.left = newX + "px";

    touch.lastX = event.clientX;
});

document.addEventListener("pointerup", (event) => {
    delete activeTouches[event.pointerId];
});

document.addEventListener("pointercancel", (event) => {
    delete activeTouches[event.pointerId];
});
// #endregion

//ball movement
let gameStarted = false;
let ballPaused = false;
let ballX = window.innerWidth / 2;
let ballY = window.innerHeight / 2;

let nextBallSpeed = Math.hypot(3, 3);
let ballSpeedX = Math.random() < 0.5 ? 3 : -3;
let ballSpeedY = Math.random() < 0.5 ? 3 : -3;

function resetBall() {
    ballX = window.innerWidth / 2;
    ballY = window.innerHeight / 2;

    const speed = Math.min(
        Math.max(nextBallSpeed * 0.75, Math.hypot(3, 3)),
        Math.hypot(3, 3) * Math.pow(1.10, 25)
    );

    const angle = (Math.random() - 0.5) * (Math.PI / 3);

    ballSpeedX = speed * Math.sin(angle);
    ballSpeedY = speed * Math.cos(angle);

    nextBallSpeed = speed;

    ball.style.left = ballX + "px";
    ball.style.top = ballY + "px";
    ballPaused = true;

    setTimeout(() => {
        ballPaused = false;
    }, 700);
}

function moveBall() {
    if (ballPaused) {
        requestAnimationFrame(moveBall);
        return;
    }

    const previousBallX = ballX;
    const previousBallY = ballY;
    
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    ball.style.left = ballX + "px";
    ball.style.top = ballY + "px";

    //side wall collisions
    if (ballX <= 8) {
        ballX = 8;
        ballSpeedX = Math.abs(ballSpeedX);
    }

    if (ballX >= window.innerWidth - 8) {
        ballX = window.innerWidth - 8;
        ballSpeedX = -Math.abs(ballSpeedX);
    }

    //top and bottom boundaries
    if (gameStarted && ballY <= 8) {
        scores[0]++;
        score1Display.textContent = scores[0];
        nextBallSpeed = Math.hypot(ballSpeedX, ballSpeedY);
        resetBall();
    } else if (gameStarted && ballY >= window.innerHeight - 8) {
        scores[1]++;
        score2Display.textContent = scores[1];
        nextBallSpeed = Math.hypot(ballSpeedX, ballSpeedY);
        resetBall();
    } else if (!gameStarted && (ballY <= 8 || ballY >= window.innerHeight - 8)) {
        ballSpeedY *= -1;
    }

    //paddle collisions
    if (gameStarted) {
        const ballRadius = 8;
    
        function checkPaddleCollision(paddle, isPlayer1) {
            const paddleX = parseFloat(getComputedStyle(paddle).left);
            const paddleWidth = paddle.offsetWidth;
            const paddleY = isPlayer1
                ? window.innerHeight - 20 - paddle.offsetHeight
                : 20;
        
            const ballMovingTowardPaddle = isPlayer1
                ? ballSpeedY > 0
                : ballSpeedY < 0;
        
            if (!ballMovingTowardPaddle) return;
        
            const crossedPaddle =
                isPlayer1
                    ? previousBallY + ballRadius <= paddleY &&
                      ballY + ballRadius >= paddleY
                    : previousBallY - ballRadius >= paddleY + paddle.offsetHeight &&
                      ballY - ballRadius <= paddleY + paddle.offsetHeight;

            const minBallX = Math.min(previousBallX, ballX) - ballRadius;
            const maxBallX = Math.max(previousBallX, ballX) + ballRadius;

            const ballTouchesPaddle =
                crossedPaddle &&
                maxBallX >= paddleX &&
                minBallX <= paddleX + paddleWidth;
        
            if (ballTouchesPaddle) {
                console.log("Ball hit paddle");
                const paddleCenter = paddleX + paddleWidth / 2;
                const hitPosition = (ballX - paddleCenter) / (paddleWidth / 2);
            
                const maxAngle = Math.PI / 3;
                const angle = hitPosition * maxAngle;
            
                const baseSpeed = Math.hypot(3, 3);
                const maxBallSpeed = baseSpeed * Math.pow(1.10, 25);

                const speed = Math.min(
                    Math.hypot(ballSpeedX, ballSpeedY) * 1.10,
                    maxBallSpeed
                );
            
                const direction = isPlayer1 ? -1 : 1;
            
                ballSpeedX = speed * Math.sin(angle);
                ballSpeedY = direction * speed * Math.cos(angle);
            
                //Move ball just outside paddle to prevent repeated collisions
                ballY = isPlayer1
                    ? paddleY - ballRadius
                    : paddleY + paddle.offsetHeight + ballRadius;
            }
        }
    
        checkPaddleCollision(paddle1, true);
        checkPaddleCollision(paddle2, false);
    }

    requestAnimationFrame(moveBall);
}

moveBall();