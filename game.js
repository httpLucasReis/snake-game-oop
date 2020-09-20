class Snake {
  // attributes
  constructor(_pX, _pY, _color, _vel, _velX, _velY, _tail, _trail, _size, _keyCodeLeft,_keyCodeUp, _keyCodeRight, _keyCodeDown) {
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

    // Controls
    this.keyPressed;
    this.keyCodeLeft = _keyCodeLeft;
    this.keyCodeUp = _keyCodeUp;
    this.keyCodeRight = _keyCodeRight;
    this.keyCodeDown = _keyCodeDown;

  }

  // methods

  move(game) {
    for (let i = 0; i < this.trail.length; i++) {
      game.context.fillRect(
        this.trail[i].x * this.size,
        this.trail[i].y * this.size,
        this.size,
        this.size
      );
      // collied
      if (this.trail[i].x == this.pX && this.trail[i].y == this.pY) {
        console.log(`$ Rabo X: ${this.trail[i].x} Rabo y: ${this.trail[i].y}`);
        this.velX = this.velY = 0;
        this.tail = 5;
        return true;
      }
    }

    this.trail.push({
      x: this.pX,
      y: this.pY,
    });

    while (this.trail.length > this.tail) {
      this.trail.shift();
    }

    // don't collied
    return false;
  }

  collisionFruit(fruit, distance) {
    if (this.pX == fruit.pX && this.pY == fruit.pY) {
      this.tail++;

      fruit.pX = Math.floor(Math.random() * distance);
      fruit.pY = Math.floor(Math.random() * distance);
    }
  }

  collisionScreen(totalPiece) {
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

  modifyVel(key) {
    switch (key) {
      case this.keyCodeLeft:   // Left
        this.velX = -this.vel;
        this.velY = 0;
        break;
      case this.keyCodeUp:     // Up
        this.velX = 0;
        this.velY = -this.vel;
        break; 
      case this.keyCodeRight:  // Right
        this.velX = this.vel;
        this.velY = 0;
        break;
      case this.keyCodeDown:   // Down
        this.velX = 0;
        this.velY = this.vel;
        break;
      default:
        break;
    }
  }

  modifyPosition() {
    this.pX += this.velX;
    this.pY += this.velY;
  }
}

class Fruit {
  constructor(_color, _pX, _pY, _size) {
    this.color = _color;
    this.pX = _pX;
    this.pY = _pY;
    this.size = _size;
  }
}

class Background {
  constructor(_color, _pX, _pY, _size) {
    this.color = _color;
    this.pX = _pX;
    this.pY = _pY;
    this.size = _size;
  }
}

// Creating stage game
class Stage {
  // attributes

  constructor(_canvas, _context, _amoutP) {
    this.area = _canvas;
    this.context = this.area.getContext(_context);
    this.amountP = _amoutP;
    this.keyPressed;
  }

  // Methods
  render(object) {
    this.context.fillStyle = object.color;
    this.context.fillRect(
      object.pX * object.size,
      object.pY * object.size,
      object.size,
      object.size
    );
  }

  set key(key) {
    this.keyPressed = key;
  }

  get key() {
    return this.keyPressed;
  }

  message(color, font, text, pX, pY) {
    this.context.fillStyle = color;
    this.context.font = font;
    this.context.fillText(text, pX, pY);
  }
}

// Creating objects
const canvas = document.querySelector("#stage");

const game = new Stage(canvas, "2d", 40);

const background = new Background("black", 0, 0, 400);

const s1 = new Snake(0, 0, "#1D8348", 1, 0, 0, 0, [], 10, 37, 38, 39, 40);

const s2 = new Snake(20,20, "#1D8334", 1, 0, 0, 0, [], 10, 65, 87, 68, 83);

const f1 = new Fruit("yellow", 5, 5, 10);

console.log(`
    left: ${s1.keyCodeLeft},
    up: ${s1.keyCodeUp},
    right: ${s1.keyCodeRight},
    down: ${s1.keyCodeDown}\n
`)

console.log(`
    left: ${s2.keyCodeLeft},
    up: ${s2.keyCodeUp},
    right: ${s2.keyCodeRight},
    down: ${s2.keyCodeDown}\n
`)

// Events of keyboard
document.addEventListener("keydown", (event) => {
  game.key = event.keyCode;
});

const loop = setInterval(() => {
  game.render(background);
  game.render(s1);
  game.render(s2);
  game.render(f1);

  const hit = s1.move(game);
  const hit2 = s2.move(game);

  if (!hit && !hit2) {
    s1.modifyVel(game.key);
    s2.modifyVel(game.key);

    s1.modifyPosition();
    s2.modifyPosition();

    s1.collisionScreen(game.amountP);
    s2.collisionScreen(game.amountP);

    s1.collisionFruit(f1, game.amountP);
    s2.collisionFruit(f1, game.amountP);

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
