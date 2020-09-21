"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Snake = function () {
  // attributes
  function Snake(_pX, _pY, _color, _vel, _velX, _velY, _tail, _trail, _size, _keyCodeLeft, _keyCodeUp, _keyCodeRight, _keyCodeDown) {
    _classCallCheck(this, Snake);

    // Position
    this.pX = _pX;
    this.pY = _pY;

    // Snake  color
    this.color = _color;

    // Velocity
    this.vel = _vel;
    this.velX = _velX;
    this.velY = _velY;

    // Others
    this.tail = _tail;
    this.trail = _trail;
    this.size = _size;

    // Controls
    this.keyPressed;
    this.keyCodeLeft = _keyCodeLeft;
    this.keyCodeUp = _keyCodeUp;
    this.keyCodeRight = _keyCodeRight;
    this.keyCodeDown = _keyCodeDown;

    // Game rules
    this.hit = false;
  }

  // methods


  _createClass(Snake, [{
    key: "move",
    value: function move(game) {
      for (var i = 0; i < this.trail.length; i++) {
        game.context.fillRect(this.trail[i].x * this.size, this.trail[i].y * this.size, this.size, this.size);
        // collied
        if (this.trail[i].x == this.pX && this.trail[i].y == this.pY) {
          this.velX = this.velY = 0;
          this.tail = 5;
          this.hit = true;
        }
      }

      this.trail.push({
        x: this.pX,
        y: this.pY
      });

      while (this.trail.length > this.tail) {
        this.trail.shift();
      }
    }
  }, {
    key: "collisionFruit",
    value: function collisionFruit(fruits, distance) {
      var _this = this;

      fruits.forEach(function (fruit) {
        if (_this.pX == fruit.pX && _this.pY == fruit.pY) {
          _this.tail++;
          fruit.pX = Math.floor(Math.random() * distance);
          fruit.pY = Math.floor(Math.random() * distance);
        }
      });
    }
  }, {
    key: "collisionScreen",
    value: function collisionScreen(totalPiece) {
      if (this.pX < 0) {
        this.pX = totalPiece - 1;
      }

      if (this.pX > totalPiece - 1) {
        this.pX = 0;
      }

      if (this.pY < 0) {
        this.pY = totalPiece - 1;
      }

      if (this.pY > totalPiece - 1) {
        this.pY = -1;
      }
    }
  }, {
    key: "modifyVel",
    value: function modifyVel(key) {
      switch (key) {
        case this.keyCodeLeft:
          // Left
          this.velX = -this.vel;
          this.velY = 0;
          break;
        case this.keyCodeUp:
          // Up
          this.velX = 0;
          this.velY = -this.vel;
          break;
        case this.keyCodeRight:
          // Right
          this.velX = this.vel;
          this.velY = 0;
          break;
        case this.keyCodeDown:
          // Down
          this.velX = 0;
          this.velY = this.vel;
          break;
        default:
          break;
      }
    }
  }, {
    key: "modifyPosition",
    value: function modifyPosition() {
      this.pX += this.velX;
      this.pY += this.velY;
    }
  }]);

  return Snake;
}();

var Fruit = function Fruit(_color, _pX, _pY, _size) {
  _classCallCheck(this, Fruit);

  this.color = _color;
  this.pX = _pX;
  this.pY = _pY;
  this.size = _size;
};

var Background = function Background(_color, _pX, _pY, _size) {
  _classCallCheck(this, Background);

  this.color = _color;
  this.pX = _pX;
  this.pY = _pY;
  this.size = _size;
};

// Creating stage game


var Stage = function () {
  // attributes

  function Stage(_canvas, _context, _amoutP) {
    _classCallCheck(this, Stage);

    this.area = _canvas;
    this.context = this.area.getContext(_context);
    this.amountP = _amoutP;
    this.keyPressed;
  }

  // Methods


  _createClass(Stage, [{
    key: "render",
    value: function render(objects) {
      var _this2 = this;

      objects.forEach(function (object) {
        _this2.context.fillStyle = object.color;
        _this2.context.fillRect(object.pX * object.size, object.pY * object.size, object.size, object.size);
      });
    }
  }, {
    key: "restart",
    value: function restart(snakes) {
      var _this3 = this;

      snakes.forEach(function (snake) {
        snake.hit = false;
        snake.velX = 1;
        snake.velY = 0;
        snake.pX = Math.floor(Math.random() * _this3.amountP);
        snake.pY = Math.floor(Math.random() * _this3.amountP);
        snake.tail = 0;
        snake.trail = [];
      });
    }
  }, {
    key: "message",
    value: function message(color, font, text, pX, pY) {
      this.context.fillStyle = color;
      this.context.font = font;
      this.context.fillText(text, pX, pY);
    }
  }, {
    key: "key",
    set: function set(key) {
      this.keyPressed = key;
    },
    get: function get() {
      return this.keyPressed;
    }
  }]);

  return Stage;
}();

// Creating objects


var canvas = document.querySelector("#stage");

var game = new Stage(canvas, "2d", 40);

var background = new Background("#BFC9CA", 0, 0, 400);

var s1 = new Snake(15, 20, "#3498DB", 1, 0, 0, 0, [], 10, 37, 38, 39, 40);

var s2 = new Snake(25, 20, "#E74C3C", 1, 0, 0, 0, [], 10, 65, 87, 68, 83);

var f1 = new Fruit("#FDFEFE", 5, 5, 10);

// Events of keyboard
document.addEventListener("keydown", function (event) {
  game.key = event.keyCode;
});

// Function for to run game.
function run() {
  game.render([background, s1, s2, f1]);

  if (!s1.hit && !s2.hit) {
    s1.move(game);
    s2.move(game);

    s1.modifyVel(game.key);
    s2.modifyVel(game.key);

    s1.modifyPosition();
    s2.modifyPosition();

    s1.collisionScreen(game.amountP);
    s2.collisionScreen(game.amountP);

    s1.collisionFruit([f1], game.amountP);
    s2.collisionFruit([f1], game.amountP);

    game.message("#3498DB", "700 14px Arial", "First player: " + s1.trail.length, 40, 380);
    game.message("#E74C3C", "700 14px Arial", "Second player: " + s2.trail.length, 240, 380);
  } else if (s1.hit) {
    console.log("s1.hit = " + s1.hit);
    console.log("Estou no segundo if");
    game.render([background]);
    game.message("#E74C3C", "700 20px Arial", "Second player wins!", 105, 210);
    clearInterval(loop);
  } else {
    game.render([background]);
    game.message("#3498DB", "700 20px Arial", "First player wins!", 120, 210);
    clearInterval(loop);
  }
}

// Game loop
var loop = setInterval(run, 50);

// Restart game 
var restartButton = document.querySelector("#restart");
restartButton.addEventListener("click", function () {
  clearInterval(loop);
  game.restart([s1, s2]);
  loop = setInterval(run, 50);
});
