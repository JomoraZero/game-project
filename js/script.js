// VARIABLES
var canvas = document.querySelector(".myCanvas");
var ctx = canvas.getContext("2d");

// main ball starting position
var x = canvas.width/2;
var y = canvas.height-30;

//extra ball starting position
var extraX = Math.floor(Math.random() * canvas.width);
var extraY = canvas.height/2;

// extra ball 1 speed
var extraBall1SpeedX = 3;
var extraBall1SpeedY = -3;
var extraRadius1 =  10;

// extra ball 2 speed
var extraBall2SpeedX = 3;
var extraBall2SpeedY = -3;
var extraRadius2 = 10;

// main ball speed
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
  ctx.fillStyle = "#9F111B";
  ctx.fill();
  ctx.closePath();
}

function drawExtraBall1() {
    ctx.beginPath();
    ctx.arc(extraX, extraY, extraRadius1, 0, Math.PI*2);
    ctx.fillStyle = "#AACCB1";
    ctx.fill();
    ctx.closePath();
}

function drawExtraBall2() {
    ctx.beginPath();
    ctx.arc(extraX, extraY, extraRadius2, 0, Math.PI*2);
    ctx.fillStyle = "#AACCB1";
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
    drawExtraBall1();
    drawExtraBall2();

    // Extra Ball 1 wall collision
    if(extraX + extraBall1SpeedX > canvas.width-extraRadius1 || extraX + extraBall1SpeedX < extraRadius1) {
      extraBall1SpeedX = -extraBall1SpeedX;
    }
    if (extraY + extraBall1SpeedY < extraRadius1) {
      extraBall1SpeedY =- extraBall1SpeedY;
    }

    // Extra Ball 2 wall collision
    if(extraX + extraBall2SpeedX > canvas.width-extraRadius2 || extraX + extraBall2SpeedX < extraRadius2) {
      extraBall2SpeedX = -extraBall2SpeedX;
    }
    if (extraY + extraBall2SpeedY < extraRadius2) {
      extraBall1SpeedY =- extraBall1SpeedY;
    } else if(extraY + extraBall2SpeedY > canvas.height-extraRadius2) {
          if(extraX > paddleX && extraX < paddleX + paddleWidth) {
              extraBall2SpeedY = -extraBall2SpeedY;
          }
        }

        //main ball wall collision
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


    // Alteration Activation
    if (powerX > paddleX && powerX < paddleX + paddleWidth && powerY == paddleY) {
        // paddleWidth = paddleWidth + 100;
        // paddleWidth = paddleWidth - 75;
        // speedX = 7; speedY = -7;
        // drawExtraBall1(); drawExtraBall2();

      }

    // extra balls movement
    extraX += 4;
    extraY += 4;

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
