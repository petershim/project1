var JS_SNAKE = {};
var player1Score = 0;
var player2Score = 0;
var appleX = 240;
var appleY = 240;
var hexCode = ['#8ffff6', '#ff5050','#99ff00', '#9900CC', '#CC00ff', '#FFFF00', '#99FF99', '#99FFCC', '#FFCC99'];
var i = 0;
var speed = 500;

JS_SNAKE.game = (function () {
  var ctx;
  JS_SNAKE.width = 500;
  JS_SNAKE.height = 500;
  JS_SNAKE.blockSize = 20;
  var frameLength = speed; //new frame every 0.1 seconds
  var snake;
  var snake2;
  var apple;
  var initApple;
//INITIALIZES THE GAME
  function init() {
    $('body').append('<canvas id="jsSnake" style="border:10px solid #8FFFF6;">');
    var $canvas = $('#jsSnake');
    $canvas.attr('width', JS_SNAKE.width);
    $canvas.attr('height', JS_SNAKE.height);
    var canvas = $canvas[0];
    ctx = canvas.getContext('2d');
    snake = JS_SNAKE.snake();
    snake2 = JS_SNAKE.snake2();
    apple = JS_SNAKE.apple();
    initApple = JS_SNAKE.initApple();
    bindSnakeEvents();
    bindSnake2Events();
    initApple.draw(ctx);
    gameLoop();
  }

  function gameLoop() {
    ctx.clearRect(0, 0, JS_SNAKE.width, JS_SNAKE.height);
    snake.advance();
    snake2.advance();
    snake.draw(ctx);
    snake2.draw(ctx);
    apple.draw(ctx);
    setTimeout(gameLoop, speed); //Refresh screen
  }
//SNAKE 1 (GREEN)
  function bindSnakeEvents() {
    var keysToDirections = {
      65: 'left',
      87: 'up',
      68: 'right',
      83: 'down',
    };

    $(document).keydown(function (event) {
      var key = event.which;
      var direction = keysToDirections[key];

      if (direction) {
        snake.setDirection(direction);
        event.preventDefault();
      }
      else if (key === 32) {
        restart();
      }
    });
  }
//SNAKE 2 (RED)
  function bindSnake2Events() {
    var keysToDirections = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
    };

    $(document).keydown(function (event) {
      var key = event.which;
      var direction = keysToDirections[key];

      if (direction) {
        snake2.setDirection(direction);
        event.preventDefault();
      }
      else if (key === 32) {
        restart();
      }
    });
  }

  return {
    init: init
  };
})();
//APPLE OBJECT
JS_SNAKE.apple = function () {

  function draw(ctx) {
    ctx.save();
    ctx.fillStyle = hexCode[i];
    ctx.fillRect(appleX, appleY, JS_SNAKE.blockSize, JS_SNAKE.blockSize);
    ctx.restore();
    // console.log(x, y);
  }

  return {
    draw: draw
  };
};

JS_SNAKE.initApple = function () {

  function draw(ctx) {
    ctx.save();
    ctx.fillStyle = hexCode[i];
    ctx.fillRect(appleX, appleY, JS_SNAKE.blockSize, JS_SNAKE.blockSize);
    ctx.restore();
    console.log(appleX, appleY);
  }

  return {
    draw: draw
  };
};

//SNAKE 1 ()
JS_SNAKE.snake = function () {
  var self = this;
  self.posArray = [];
  self.posArray.push([3, 1]);
  self.posArray.push([2, 1]);
  self.posArray.push([1, 1]);
  var direction = 'right';
  var nextDirection = direction;

  function setDirection(newDirection) {
    var allowedDirections;

    //If snake is going left or right, only valid new directions
    //are up and down. Vice versa for up or down.
    switch (direction) {
    case 'left':
    case 'right':
      allowedDirections = ['up', 'down'];
      break;
    case 'up':
    case 'down':
      allowedDirections = ['left', 'right'];
      break;
    default:
      throw('Invalid direction');
    }
    if (allowedDirections.indexOf(newDirection) > -1) {
      nextDirection = newDirection;
    }
  }

  function drawSection(ctx, position) {
    var x = JS_SNAKE.blockSize * position[0];
    var y = JS_SNAKE.blockSize * position[1];
    ctx.fillRect(x, y, JS_SNAKE.blockSize, JS_SNAKE.blockSize);
    // console.log(x, y);
  }

  function draw(ctx) {
    ctx.save();
    ctx.fillStyle = '#33FF99';
    collisionTest(ctx, self.posArray[0]);

    for(var i = 0; i < self.posArray.length; i++) {
      drawSection(ctx, self.posArray[i]);
    }
    ctx.restore();
  }
  //continuous movement
  function advance() {
    var nextPosition = self.posArray[0].slice();
    direction = nextDirection;
    switch (direction) {
    case 'left':
      nextPosition[0] -= 1;
      break;
    case 'up':
      nextPosition[1] -= 1;
      break;
    case 'right':
      nextPosition[0] += 1;
      break;
    case 'down':
      nextPosition[1] += 1;
      break;
    default:
      throw('Invalid direction');
    }

    self.posArray.unshift(nextPosition);
    self.posArray.pop();
  }

  function collisionTest(ctx, position) {
    var x = JS_SNAKE.blockSize * position[0];
    var y = JS_SNAKE.blockSize * position[1];
    if(x > 500 || x < 0) {
      console.log('Snake1 wall check!');
      direction = null;
      nextDirection = null;
      self.posArray.shift(advance.nextPosition);
      ctx.clearRect(0, 0, 500, 500);
      $('#winner2').append('PLAYER 2 WINS<br>');
    }else if (y > 500 || y < 0) {
      direction = null;
      nextDirection = null;
      console.log('Snake1 wall check!');
      self.posArray.shift(advance.nextPosition);
      ctx.clearRect(0, 0, 500, 500);
      $('#winner2').append('PLAYER 2 WINS<br>');
    }else if (x === appleX && y === appleY) {
      self.posArray.push([99, 1]);
      console.log(self.posArray);
      player1Score+=1;
      console.log(player1Score);
      appleX = Math.floor(Math.random()*24)*20;
      appleY = Math.floor(Math.random()*24)*20;
      i = Math.floor(Math.random()*hexCode.length)-1;
      speed -= 10;
      $('#p1score').text(player1Score);
      console.log(speed);
    }
  }

  return {
    draw: draw,
    advance: advance,
    setDirection: setDirection
  };
};

JS_SNAKE.snake2 = function () {
  self.posArray = [];
  self.posArray.push([21, 23]);
  self.posArray.push([22, 23]);
  self.posArray.push([23, 23]);
  var direction = 'left';
  var nextDirection = direction;

  function setDirection(newDirection) {
    var allowedDirections;

    //If snake is going left or right, only valid new directions
    //are up and down. Vice versa for up or down.
    switch (direction) {
    case 'left':
    case 'right':
      allowedDirections = ['up', 'down'];
      break;
    case 'up':
    case 'down':
      allowedDirections = ['left', 'right'];
      break;
    default:
      throw('Invalid direction');
    }
    if (allowedDirections.indexOf(newDirection) > -1) {
      nextDirection = newDirection;
    }
  }

  function drawSection(ctx, position) {
    var x = JS_SNAKE.blockSize * position[0];
    var y = JS_SNAKE.blockSize * position[1];
    // console.log("2nd snake " + x, y);
    ctx.fillRect(x, y, JS_SNAKE.blockSize, JS_SNAKE.blockSize);
  }

  function draw(ctx) {
    ctx.save();
    ctx.fillStyle = '#FF0066';
    collisionTest(ctx, self.posArray[0]);
    for(var i = 0; i < self.posArray.length; i++) {
      drawSection(ctx, self.posArray[i]);
    }
    ctx.restore();
  }
  //continuous movement
  function advance() {
    var nextPosition = self.posArray[0].slice();
    direction = nextDirection;
    switch (direction) {
    case 'left':
      nextPosition[0] -= 1;
      break;
    case 'up':
      nextPosition[1] -= 1;
      break;
    case 'right':
      nextPosition[0] += 1;
      break;
    case 'down':
      nextPosition[1] += 1;
      break;
    default:
      throw('Invalid direction');
    }

    self.posArray.unshift(nextPosition);
    self.posArray.pop();
  }

  function collisionTest(ctx, position) {
    var x = JS_SNAKE.blockSize * position[0];
    var y = JS_SNAKE.blockSize * position[1];
    if(x >= 500 || x <= 0) {
      direction = null;
      nextDirection = null;
      console.log('Snake2 wall check!');
      self.posArray.shift(advance.nextPosition);
      ctx.clearRect(0, 0, 500, 500);
      $('#winner1').append('PLAYER 1 WINS<br>');
    }else if (y >= 500 || y <= 0) {
      direction = null;
      nextDirection = null;
      console.log('Snake2 wall check!');
      self.posArray.shift(advance.nextPosition);
      ctx.clearRect(0, 0, 500, 500);
      $('#winner1').append('PLAYER 1 WINS<br>');
    }else if (x === appleX && y === appleY) {
      self.posArray.push([98, 1]);
      console.log(self.posArray);
      player2Score+=1;
      console.log(player2Score);
      appleX = Math.floor(Math.random()*24)*20;
      appleY = Math.floor(Math.random()*24)*20;
      i = Math.floor(Math.random()*hexCode.length)-1;
      speed -= 10;
      console.log(speed);
      $('#p2score').text(player2Score);
    }
  }


  return {
    draw: draw,
    advance: advance,
    setDirection: setDirection
  };
};

$(document).ready(function () {
  JS_SNAKE.game.init();
});
