function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 3;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function Background(game) {
    Entity.call(this, game, 0, 400);
    this.radius = 200;
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
}

Background.prototype.draw = function (ctx) {
  //  ctx.fillStyle = "SaddleBrown";
   // ctx.fillRect(0,500,800,300);
    Entity.prototype.draw.call(this);
}


function Paddle(game, x, y, width, height, ball) {
    this.game = game;
    this.ctx = game.ctx;
    this.x = x;
    this.y = y;
    this.ball = ball;
    this.width = width;
    this.height = height;
    this.x_speed = 0;
    this.y_speed = 0;
    Entity.call(this, game, this.x, this.y);
}

Paddle.prototype = new Entity();
Paddle.prototype.constructor = Paddle;

Paddle.prototype.draw = function () {
    this.game.ctx.fillStyle = "white";
    this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
    Entity.prototype.draw.call(this);
}

 Paddle.prototype.update = function () {

    Entity.prototype.update.call(this);

 }





function Ball(game, x, y, player, computer) { //, paddle1, paddle2) {
    this.x = x;
    this.y = y;
    this.player = player;
    this.computer = computer;
    // this.paddle1 = player.paddle;
    // this.paddle2 = computer.paddle;
    // this.paddle2 = paddle2;
    this.x_speed = 0;
    this.y_speed = 3;
    Entity.call(this, game, 400, 400);

}

Ball.prototype = new Entity();
Ball.prototype.constructor = Ball;

Ball.prototype.update = function () {
    this.x += this.x_speed;
    this.y += this.y_speed;
    var top_x = this.x - 5;
    var top_y = this.y - 5;
    var bottom_x = this.x + 5;
    var bottom_y = this.y + 5;
        if (this.x - 5 < 0) {    //hitting the left wall
        this.x = 5;
        this.x_speed = -this.x_speed;
    } else if (this.x + 5 > 800) {  // hitting the right wall
        this.x = 795;
        this.x_speed = -this.x_speed;
    }

    if (this.y < 0 || this.y > 800) { //point scored
        this.x_speed = 0;
        this.y_speed = 3;
        this.x = 400;
        this.y = 400;
    }
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent instanceof Paddle) {
            if (top_y > 650) {
      //          console.log("in bounds!");
               if (top_y < (ent.y + ent.height) && bottom_y > ent.y && top_x < (ent.x + ent.width) && bottom_x > ent.x) {
                  this.y_speed = -3;
                  this.x_speed += (ent.x_speed / 2);
                  this.y += this.y_speed; 
               }
           } else {
              if(top_y < (ent.y + ent.height) && bottom_y > ent.y && top_x < (ent.x + ent.width) && bottom_x > ent.x) {
                 // hit the computer's paddle
                this.y_speed = 3;
                this.x_speed += (ent.x_speed / 2);
                this.y += this.y_speed;
              }
           }
        }

    }

    Entity.prototype.update.call(this);
}

Ball.prototype.draw = function () {
    this.game.ctx.beginPath();
    this.game.ctx.arc(this.x, this.y, 10, 2 * Math.PI, false);
    this.game.ctx.fillStyle = "grey";
    this.game.ctx.fill();
    Entity.prototype.draw.call(this);
}

function Player(game) {
    this.game = game;
 //   this.ball = ball;
    this.paddle = new Paddle(game, 370, 750, 65, 10, this.ball);
    this.game.addEntity(this.paddle);
    
}

Player.prototype = new Entity();
Player.prototype.constructor = Player;

Player.prototype.update = function() {
    if (this.game.left === true) {
         this.paddle.x -= 4;
        // this.y += y;
         this.paddle.x_speed = -4;
        // this.paddle.y_speed = y;
         if(this.paddle.x < 0) { // all the way to the left
            this.paddle.x = 0;
            this.paddle.x_speed = 0;
         }
    }
    if (this.game.right === true) {
        this.paddle.x += 4;
        this.paddle.x_speed = 4;
        if (this.paddle.x + this.paddle.width > 800) { // all the way to the right
            this.paddle.x = 800 - this.paddle.width;
            this.paddle.x_speed = 0;
         }
     }
}


Player.prototype.draw = function() {
    this.paddle.draw();
}


function Computer(game) {
//    this.ball = ball;
    this.game = game;
    this.paddle = new Paddle(game, 0, 50, 65, 10, this.ball);
    this.game.addEntity(this.paddle);
}

Computer.prototype = new Entity();
Computer.prototype.constructor = Computer;

Computer.prototype.update = function() {
    var diff1 = 0;
  //  console.log(diff1);
     for (var i = 0; i < this.game.entities.length; i++) {
         var ent = this.game.entities[i];
         if (ent instanceof Ball) {
 //          //  console.log("does ball exist?");
             var x_pos = ent.x;
           // console.log(x_pos);
             diff1 = -((this.paddle.x + (this.paddle.width / 2)) - x_pos);
             console.log(diff1);
             if(diff1 < 0 && diff1 < -4) { // max speed left
                diff1 = -5;
             } else if(diff1 > 0 && diff1 > 4) { // max speed right
                 diff = 5;
             }
         }
     }
         // var x_pos = this.ball.x;
    //  var diff = -((this.x + (this.width / 2)) - x_pos);
    //  if (diff < 0 && diff < -4) {
    //      diff = -5;
    //  } else if (diff > 0 && diff > 4) {
    //      diff = 5;
    //  }
    // this.x += diff;
    // this.y += 0; 
    // this.x_speed = diff;
    // this.y_speed = 0;
    // if (this.x < 0) {
    //     this.x = 0;
    //     this.x_speed = 0;
    // } else if (this.x + this.width > 800) {
    //     this.x = 800 - this.width;
    //     this.x_speed = 0;
    // }
    // if (this.x < 0) {
    //     this.x = 0;
    // } else if (this.x + this.width > 800) {
    //     this.x = 800 - this.width;
    // }
 // // this.paddle.move(diff, 0);
// console.log(diff);
 //console.log(this.paddle.x);
    this.paddle.x += diff1;
        //this.paddle.y += y;
    this.paddle.x_speed = diff1;
        //this.paddle.y_speed = y;
    if(this.paddle.x < 0) { // all the way to the left
         this.paddle.x = 0;
         this.paddle.x_speed = 0;
    } else if (this.paddle.x + this.paddle.width > 800) { // all the way to the right
        this.paddle.x = 800 - this.paddle.width;
        this.paddle.x_speed = 0;
    }
}


Computer.prototype.draw = function() {
   // console.log("im not drawing?");
    this.paddle.draw();
}






function Whale(game) {

    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/whale.png"), 0, 240, 99, 70, 0.15, 3, true, true);
    this.biteAnimation = new Animation(ASSET_MANAGER.getAsset("./img/whale.png"), 0, 31, 100, 70, 0.15, 3, false, true);
    this.backAnimation = new Animation(ASSET_MANAGER.getAsset("./img/whale.png"), 0, 137, 100, 70, 0.15, 3, true, true);
    this.biting = false;
     this.radius = 100;
    // this.ground = 350;
    Entity.call(this, game, -50, 200);
}

function Shark(game) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/sharks.png"), 0, 150, 86, 45, 0.15, 3, true, true);
    this.radius = 100;
    this.ground = 350;
    Entity.call(this, game, 0, 700);
}


Shark.prototype = new Entity();
Shark.prototype.constructor = Shark;


Whale.prototype = new Entity();
Whale.prototype.constructor = Whale;

Whale.prototype.update = function () {
    if (this.game.space) this.biting = true;
    if (this.biting) {
        if (this.biteAnimation.isDone()) {
            this.biteAnimation.elapsedTime = 0;
            this.biting = false;
        }

    }
    Entity.prototype.update.call(this);
}

Shark.prototype.draw = function (ctx) {
    this.x += 5;
    this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 2);

}

Whale.prototype.draw = function (ctx) {
    if (this.biting) {
            this.x += 2;
            this.biteAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    else {
        this.x += 2;
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    Entity.prototype.draw.call(this);
}

// the "main" code begins here

var ASSET_MANAGER = new AssetManager();


ASSET_MANAGER.queueDownload("./img/whale.png");
ASSET_MANAGER.queueDownload("./img/sharks.png");


ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    var bg = new Background(gameEngine);
    var whale = new Whale(gameEngine);
    var player = new Player(gameEngine, ball);
    var computer = new Computer(gameEngine, ball);
    var ball = new Ball(gameEngine, 300, 300, player, computer); //paddle1, paddle2);
    var shark = new Shark(gameEngine);
    // var player = new Player(gameEngine);
    // var computer = new Computer(gameEngine);
    // var paddle1 = new Paddle(gameEngine, 380, 580, 50, 10, ball);
    // var paddle2 = new Paddle(gameEngine, 380, 180, 50, 10, ball);

    gameEngine.addEntity(bg);
   // gameEngine.addEntity(whale);
  //  gameEngine.addEntity(shark);
    gameEngine.addEntity(ball);
    gameEngine.addEntity(player);
    gameEngine.addEntity(computer);
 //   gameEngine.addEntity(paddle1);
    // gameEngine.addEntity(paddle2);
 
    gameEngine.init(ctx);
    gameEngine.start();
});
