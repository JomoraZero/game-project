// VARIABLES
var canvas = document.querySelector(".myCanvas");
var ctx = canvas.getContext("2d");

// ball starting position
var x = canvas.width/2;
var y = canvas.height-30;

// ball speed
var speedX = 3;
var speedY = -3;

// ball size
var ballRadius = 10;

// paddle size
var paddleHeight = 15;
var paddleWidth = 100;
var paddleX = (canvas.width-paddleWidth)/2;
var paddleY = (canvas.height);

// key movements
var rightPressed = false;
var leftPressed = false;

// brick parameters
var brickRowCount = 5;
var brickColumnCount = 10;
var brickWidth = 80;
var brickHeight = 30;
var brickPadding = 10;
var brickOffsetTop = 35;
var brickOffsetLeft = 35;

// PowerUp parameters
var powerRadius = 20;
var powerX = Math.floor(Math.random() * canvas.width);
var powerY = -500;


// brick builder
var bricks = [];
for(c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// score
var score = 0;

// lives
var lives = 3;


// FUNCTIONS
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#BEF202";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-17, paddleWidth, paddleHeight);
    ctx.fillStyle = "#BEF202";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#88C425";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawPowerUps () {
  ctx.beginPath();
  ctx.arc(powerX, powerY, powerRadius, 0, Math.PI*2);
  ctx.fillStyle = "#FA2A00";
  ctx.fill();
  ctx.closePath();
}



// DRAW
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawScore();
    drawPowerUps();
    drawBricks();
    collisionDetection();
    drawLives();


    if(x + speedX > canvas.width-ballRadius || x + speedX < ballRadius) {
    speedX = -speedX;
    }
    if(y + speedY < ballRadius) {
    speedY = -speedY;
  } else if(y + speedY > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            speedY = -speedY;
        }
        else {
          lives--;
          if(!lives) {

            document.location.reload();
          }
          else {
            x = canvas.width/2;
            y = canvas.height-30;
            speedX = 3;
            speedY = -3;
            paddleX = (canvas.width-paddleWidth)/2;
          }

        }
    }

    console.log('powerX' + powerX);
    console.log('powerY' + powerY);
    console.log('paddleX' + paddleX);
    console.log('paddleWidth' + paddleWidth);
    console.log('paddleHeight' + paddleHeight);
    // paddleGrowthActive
    if (powerX > paddleX && powerX < paddleX + paddleWidth && powerY == paddleY) {
        paddleWidth = paddleWidth + 75;
        console.log(paddleWidth);
    }

    // ball movement
    x += speedX;
    y += speedY;

    // powerup movement
    powerY += 2;

    // powerupResetPosition
    if (powerY > 1000) {
      powerY = -3000;
      powerX = Math.floor(Math.random() * canvas.width);
    }



    // paddle user movement
    if(rightPressed && paddleX < canvas.width-paddleWidth) {
    paddleX += 5;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 5;
    }
  requestAnimationFrame(draw);
}

// KEY MOVEMENTS
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function keyDownHandler(e) {
    if(e.keyCode == 39 || e.keyCode == 68) {
        rightPressed = true;
    }
    else if(e.keyCode == 37 || e.keyCode == 65) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39 || e.keyCode == 68) {
        rightPressed = false;
    }
    else if(e.keyCode == 37 || e.keyCode == 65) {
        leftPressed = false;
    }
}

// brick collision
function collisionDetection() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    speedY = -speedY;
                    b.status = 0;
                    score++;
                    if(score == brickRowCount*brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#BEF202";
    ctx.fillText("Score: "+score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#BEF202";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}


draw();
