"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Snake = function () {
  // attributes
  function Snake(_pX, _pY, _color, _vel, _velX, _velY, _tail, _trail, _size) {
    _classCallCheck(this, Snake);

    // Position
    this.pX = _pX;
    this.pY = _pY;

    // Size of snake and color
    //this.width = _width;
    //this.height = _height;
    this.color = _color;

    // Velocity
    this.vel = _vel;
    this.velX = _velX;
    this.velY = _velY;

    // Others
    this.tail = _tail;
    this.trail = _trail;
    this.size = _size;
  }

  // methods


  _createClass(Snake, [{
    key: "move",
    value: function move(game) {
      for (var i = 0; i < this.trail.length; i++) {
        game.context.fillRect(this.trail[i].x * this.size, this.trail[i].y * this.size, this.size, this.size);
        // collied
        if (this.trail[i].x == this.pX && this.trail[i].y == this.pY) {
          console.log("$ Rabo X: " + this.trail[i].x + " Rabo y: " + this.trail[i].y);
          this.velX = this.velY = 0;
          this.tail = 5;
          return true;
        }
      }

      this.trail.push({
        x: this.pX,
        y: this.pY
      });

      while (this.trail.length > this.tail) {
        this.trail.shift();
      }

      // don't collied
      return false;
    }
  }, {
    key: "collisionFruit",
    value: function collisionFruit(fruit, distance) {
      if (this.pX == fruit.pX && this.pY == fruit.pY) {
        this.tail++;

        fruit.pX = Math.floor(Math.random() * distance);
        fruit.pY = Math.floor(Math.random() * distance);
      }
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
        case "left":
          this.velX = -this.vel;
          this.velY = 0;
          break;
        case "up":
          this.velX = 0;
          this.velY = -this.vel;
          break;
        case "right":
          this.velX = this.vel;
          this.velY = 0;
          break;
        case "down":
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
    value: function render(object) {
      this.context.fillStyle = object.color;
      this.context.fillRect(object.pX * object.size, object.pY * object.size, object.size, object.size);
    }
  }, {
    key: "pressKey",
    value: function pressKey(key) {
      switch (key) {
        case 37:
          this.key = "left";
          break;
        case 38:
          this.key = "up";
          break;
        case 39:
          this.key = "right";
          break;
        case 40:
          this.key = "down";
        default:
          break;
      }
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

var background = new Background("black", 0, 0, 400);

var s1 = new Snake(0, 0, "#1D8348", 1, 0, 0, 0, [], 10);

var f1 = new Fruit("yellow", 5, 5, 10);

// Events of keyboard
document.addEventListener("keydown", function (event) {
  game.pressKey(event.keyCode);
});

var loop = setInterval(function () {
  game.render(background);
  game.render(s1);
  game.render(f1);

  var hit = s1.move(game);

  if (!hit) {
    s1.modifyVel(game.keyPressed);
    s1.modifyPosition();
    s1.collisionScreen(game.amountP);
    s1.collisionFruit(f1, game.amountP);
  } else {
    game.render(background);
    game.message("yellow", "700 20px Arial", "GAME OVER", 140, 210);
  }
}, 60);

/* const loop = ()=>{
    console.log(`pX: ${s1.pX} pY: ${s1.pY}`);
    game.render(background);
    game.render(s1);
    game.render(f1);

    const hit = s1.move(game);

    if (!hit) {
        s1.collisionFruit(f1, 20);
        s1.collisionScreen(20);
        s1.modifyVel(game.keyPressed);
        s1.modifyPosition();
        game.message("pink", "700 20px Arial", "TEXTO TEXTO TEXTO", 140, 210);
    } else {
        game.render(background);
        game.message("yellow", "700 20px Arial", "GAME OVER", 140, 210);
    }
}

requestAnimationFrame(loop); */
