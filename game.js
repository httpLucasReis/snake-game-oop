class Snake {
  // attributes
  constructor(_pX, _pY, _color, _vel, _velX, _velY, _tail, _trail, _size, _keyCodeLeft,_keyCodeUp, _keyCodeRight, _keyCodeDown) {
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
        this.velX = this.velY = 0;
        this.tail = 5;
        this.hit = true;
      }
    }

    this.trail.push({
      x: this.pX,
      y: this.pY,
    });

    while (this.trail.length > this.tail) {
      this.trail.shift();
    }
  }

  collisionFruit(fruits, distance) {
    fruits.forEach((fruit)=>{
      if (this.pX == fruit.pX && this.pY == fruit.pY) {
        this.tail++;
        fruit.pX = Math.floor(Math.random() * distance);
        fruit.pY = Math.floor(Math.random() * distance);
      }
    })
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
  render(objects) {
    objects.forEach((object)=>{
      this.context.fillStyle = object.color;
      this.context.fillRect(
        object.pX * object.size,
        object.pY * object.size,
        object.size,
        object.size
      );
    })
  }

  restart(snakes){
    snakes.forEach((snake)=>{
      snake.hit = false;
      snake.velX = 1;
      snake.velY = 0;
      snake.pX = Math.floor(Math.random() * this.amountP);
      snake.pY = Math.floor(Math.random() * this.amountP);
      snake.tail = 0;
      snake.trail = [];
    })
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

const background = new Background("#BFC9CA", 0, 0, 400);

const s1 = new Snake(15, 20, "#3498DB", 1, 0, 0, 0, [], 10, 37, 38, 39, 40);

const s2 = new Snake(25, 20, "#E74C3C", 1, 0, 0, 0, [], 10, 65, 87, 68, 83);

const f1 = new Fruit("#FDFEFE", 5, 5, 10);

// Events of keyboard
document.addEventListener("keydown", (event) => {
  game.key = event.keyCode;
});


// Function for to run game.
function run(){
  game.render([background, s1, s2, f1])

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

    game.message("#3498DB", "700 14px Arial", `First player: ${s1.trail.length}`, 40, 380);
    game.message("#E74C3C", "700 14px Arial", `Second player: ${s2.trail.length}`, 240, 380);

  } else if(s1.hit){
    console.log(`s1.hit = ${s1.hit}`)
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
let loop = setInterval(run, 50); 


// Restart game 
const restartButton = document.querySelector("#restart");
restartButton.addEventListener("click", ()=>{
  clearInterval(loop);
  game.restart([s1,s2]);
  loop = setInterval(run, 50);
})

