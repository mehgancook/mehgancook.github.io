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




function Whale(game) {

    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/whale.png"), 0, 240, 99, 70, 0.15, 3, true, true);
    this.biteAnimation = new Animation(ASSET_MANAGER.getAsset("./img/whale.png"), 0, 31, 100, 70, 0.15, 3, false, true);
    this.backAnimation = new Animation(ASSET_MANAGER.getAsset("./img/whale.png"), 0, 137, 100, 70, 0.15, 3, true, true);
    this.biting = false;
    this.radius = 100;
    this.ground = 350;
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
    var shark = new Shark(gameEngine);

    gameEngine.addEntity(bg);
    gameEngine.addEntity(whale);
    gameEngine.addEntity(shark);
 
    gameEngine.init(ctx);
    gameEngine.start();
});
