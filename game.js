window.addEventListener("load",function() {

  var GAME_WIDTH = 320 * 2,
      GAME_HEIGHT = 568 * 2,
      GAME_UNIT = GAME_WIDTH / 64,
      canvas = document.getElementById("gameCanvas"),
      ctx = canvas.getContext("2d"),
      click = new Audio('click.mp3');
      

    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;

  var pointer = {
    x: 0,
    y: 0
  };

  var game = {
    running: false,
    gameOver: false,
    timeRemaining: 1000,
    lives: 3,
    level: 1
  };

  var menu = {
    text: "Pong",
    message: "click to start",
    x: GAME_WIDTH / 2,
    y: GAME_HEIGHT / 4,
    messageY: this.y + 5 * GAME_UNIT
  };

  var ball = {
      x: GAME_WIDTH / 2,
      y: GAME_HEIGHT / 2,
      r: 4 * GAME_UNIT,
      speedX: 7 + game.level*2,
      speedY:  7 + game.level*2,
      speedXMax: 25
    };

  var paddle = {
    w: 15 * GAME_UNIT,
    h: 1 * GAME_UNIT,
    x: GAME_WIDTH / 2 - this.w / 2,
    y: GAME_HEIGHT - 4 * GAME_UNIT,
    speedX: 0
  };

  var downHandler = function() {
    if (game.running === false && game.gameOver === false) {
      game.running = true;
      step();
    } else if (game.gameOver === true) {
      window.location.reload()
    }
  };
  
  var upHandler = function() {

  };
  
  var mouseMoveHandler = function(e) {
    e.preventDefault();
    pointer.x = (e.clientX - canvas.getBoundingClientRect().left) * GAME_WIDTH / canvas.getBoundingClientRect().width;
    pointer.y = (e.clientY - canvas.getBoundingClientRect().top) * GAME_HEIGHT / canvas.getBoundingClientRect().height;
    
  };
  
  var touchMoveHandler = function(e) {
    e.preventDefault();
    pointer.x = (e.touches[0].clientX - canvas.getBoundingClientRect().left) * GAME_WIDTH / canvas.getBoundingClientRect().width;
    pointer.y = (e.touches[0].clientY - canvas.getBoundingClientRect().top) * GAME_HEIGHT / canvas.getBoundingClientRect().height;
  };

    
  canvas.addEventListener('touchstart', downHandler);
  canvas.addEventListener('touchend', upHandler);
  document.addEventListener("touchmove", touchMoveHandler);
  canvas.addEventListener("mousedown", downHandler);
  canvas.addEventListener("mouseup", upHandler);
  document.addEventListener("mousemove", mouseMoveHandler);




  var update = function() {
    var oldpaddle = paddle.x;
    paddle.x = pointer.x - paddle.w / 2;
    paddle.speedX =  paddle.x -  oldpaddle;

    var flipSpeedY = function() {
      ball.y -= ball.speedY;
      ball.speedY *= -1;
      ball.speedX += paddle.speedX / 4;
      if (ball.speedX > ball.speedXMax) {
        ball.speedX = ball.speedXMax / Math.abs(ball.speedXMax);
      }
    };
    var flipSpeedX = function() {
      ball.x -= ball.speedX;
      ball.speedX *= -1;
    };

    if (paddle.x < 0) {
      paddle.x = 0;
      paddle.speedX = 0;
    } else if (paddle.x + paddle.w > GAME_WIDTH) {
      paddle.x = GAME_WIDTH - paddle.w;
      paddle.speedX = 0;
    }
    
    //ball paddle collision and speed change/transfer
    if (ball.y + ball.r > paddle.y && ball.x >= paddle.x && ball.x <= paddle.x + paddle.w) {
      flipSpeedY();
      click.play();
    } else if ((ball.y + ball.r > paddle.y && ball.y < paddle.y) && 
    ((ball.x + ball.r > paddle.x && ball.x < paddle.x) || 
    (ball.x - ball.r < paddle.x + paddle.w && ball.x > paddle.x + paddle.w))) {
      flipSpeedY();
      flipSpeedX();
      click.play();
    } else if (ball.y > paddle.y && 
      ((ball.x + ball.r > paddle.x && ball.x < paddle.x) || 
      (ball.x - ball.r < paddle.x + paddle.w && ball.x > paddle.x + paddle.w))) {
      flipSpeedX();
      click.play();
    }

    //ball and wall collision and losing lives/game overs
    if (ball.x - ball.r < 0 || ball.x + ball.r > GAME_WIDTH) {
      ball.x -= ball.speedX;
      ball.speedX *= -1;
    }
    if (ball.y - ball.r < 0) {
      ball.y -= ball.speedY;
      ball.speedY *= -1;
    } else if (ball.y + ball.r > GAME_HEIGHT) {
      game.running = false;
      ball.x = GAME_WIDTH / 2;
      ball.y = GAME_HEIGHT / 2;
      ball.speedX = 7 + game.level*2;
      ball.speedY = 7 + game.level*2;
      game.lives--;
      menu.text = game.lives + " lives left";
      menu.message = "try again";
      if (game.lives <= 0) {
      game.gameOver = true;
      menu.text = "Game Over";
      menu.message = "Level reached: " + game.level;
      }
    }

    ball.x += ball.speedX;
    ball.y += ball.speedY;
   
    game.timeRemaining--;

    if (game.timeRemaining <= 0 && game.level <= 10) {
      game.running = false;
      game.level++;
      ball.x = GAME_WIDTH / 2;
      ball.y = GAME_HEIGHT / 2;
      ball.r /= 1.4;
      ball.speedX = 7 + game.level*2;
      ball.speedY = 7 + game.level*2;
      paddle.w /= 1.1;
      game.timeRemaining = 1000;
      menu.text = "Level " + game.level;
      menu.message = "click to continue";
    } else if (game.timeRemaining <= 0 && game.level >= 10) {
      game.running = false;
      menu.text = "Winner !!! Level " + game.level;
      menu.message = "You have finished the Game";
    }
    };



  
  var draw = function(paddle=0, ball=0, gameStatusText=0, menu=0) {
    ctx.clearRect(0,0,GAME_WIDTH,GAME_HEIGHT);
    var color1 = "#1E1E1E",
        color2 = "#000",
        font1 = "normal normal normal 40px Courier New",
        font2 = "normal normal bold 60px Courier New";

    if (menu !== 0) {
      ctx.font = font2;
      ctx.fillStyle = color2;
      ctx.textAlign="center";
      ctx.fillText(menu.text, menu.x, menu.y);
      ctx.font = font1;
      ctx.fillStyle = color1;
      ctx.fillText(menu.message, menu.x, menu.y + 5* GAME_UNIT);
    }

    if (paddle !== 0) {
      ctx.fillStyle = color2;
      ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
    }

    if (ball !== 0) {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, 2*Math.PI);
      ctx.fillStyle = color1;
      ctx.fill()
      ctx.stroke();
    }


    if (gameStatusText !=0) {
      ctx.font = font1;
      ctx.fillStyle = color1;
      ctx.textAlign="left"; 
      ctx.fillText("Level: " + game.level, 2 * GAME_UNIT, 4 * GAME_UNIT);
      ctx.fillText("Time: " + game.timeRemaining, 2 * GAME_UNIT, 8 * GAME_UNIT);
      for (var lvs = 1; lvs <= game.lives; lvs++) {
        ctx.beginPath();
        ctx.arc(GAME_WIDTH - (2.1  * lvs * ball.r), 6 * GAME_UNIT, ball.r, 0, 2*Math.PI);
        //ctx.fillStyle = color2;
        //ctx.fill()
        ctx.stroke();
      }
    }
  };

  

  var step = function() {
    if (game.running === true) {
      update();
      draw(paddle,ball,1,0);
      window.requestAnimationFrame(step);
    }
    if (game.gameOver === true) {
      draw(paddle,0,1,menu);
    }
    if (game.running === false) {
      draw(paddle,ball,1,menu);
    }
  };
  
  //start game
  step();

});  

