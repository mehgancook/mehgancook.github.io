//authors: Seth Ladd, Matt Mongeau https://robots.thoughtbot.com/pong-clone-in-javascript, Mehgan Cook

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
    this.game.ctx.fillStyle = "rgb(234,196,35)";
    this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
    Entity.prototype.draw.call(this);
}

 Paddle.prototype.update = function () {

    Entity.prototype.update.call(this);

 }





function Ball(game, x, y, player, computer) { //, paddle1, paddle2) {
    this.x = x;
    this.y = y;
    this.game = game;
    this.player = player;
    this.computer = computer;
    this.endGame = false;
    // this.paddle1 = player.paddle;
    // this.paddle2 = computer.paddle;
    // this.paddle2 = paddle2;
    this.x_speed = 0;
    this.y_speed = 4;
    Entity.call(this, game, this.x, this.y);

}

Ball.prototype = new Entity();
Ball.prototype.constructor = Ball;

Ball.prototype.update = function () {
    this.x += this.x_speed;
    this.y += this.y_speed;
    var top_x = this.x - 10;
    var top_y = this.y - 10;
    var bottom_x = this.x + 10;
    var bottom_y = this.y + 10;
    if (this.x - 10 < 0) {    //hitting the left wall
        this.x = 10;
        this.x_speed = -this.x_speed;
    } else if (this.x + 10 > 800) {  // hitting the right wall
        this.x = 790;
        this.x_speed = -this.x_speed;
    }

    if (this.y < 0 || this.y > 800) {
        if (this.y < 0) {
            this.player.score++;
            this.game.score2.innerHTML = this.player.score;
        }
        if (this.y > 800) {
            this.computer.score++;
            this.game.score1.innerHTML = this.computer.score;
        } 
       //  if (this.computer.score >= 3 || this.player.score >= 3) {
       //      if (this.computer.score >= 3) {
       //          this.game.winner.innerHTML = "You lose!";
       //      } else {
       //          this.game.winner.innerHTML = "You win!";
       //      }
       //      this.game.running = false;
       //      this.removeFromWorld = true;
            

       //      Entity.prototype.draw.call(this);
       // // console.log(this.game.player.score);
       //   }// else if (this.computer.score < 3 || this.player.score < 3){
        //   console.log("do i make it here");
        //   this.game.winner.innerHTML = "";
        //   this.game.running = true;
        //   this.dead = false;
        //   this.removeFromWorld = false;
        //   this.game.score2.innerHTML = this.player.score;
        //   this.game.score1.innerHTML = this.computer.score;
        // }
        this.x_speed = 0;
        this.y_speed = 4;
        this.x = 400;
        this.y = 400;
    }//point scored



    
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent instanceof Paddle) {
            if (top_y > 650) {
      //          console.log("in bounds!");
               if (top_y < (ent.y + ent.height) && bottom_y > ent.y && top_x < (ent.x + ent.width) && bottom_x > ent.x) {
                  this.y_speed = -4;
                  this.x_speed += (ent.x_speed / 2);
                  this.y += this.y_speed; 
               }
           } else {
              if(top_y < (ent.y + ent.height) && bottom_y > ent.y && top_x < (ent.x + ent.width) && bottom_x > ent.x) {
                 // hit the computer's paddle
                this.y_speed = 4;
                this.x_speed += (ent.x_speed / 2);
                this.y += this.y_speed;
              }
           }
        }
    }
   // console.log(this.y_speed);
    Entity.prototype.update.call(this);
}

Ball.prototype.draw = function () {

    this.game.ctx.beginPath();
    this.game.ctx.arc(this.x, this.y, 10, 2 * Math.PI, false);
    this.game.ctx.fillStyle = "rgb(132,181,100)";
    this.game.ctx.fill();  
    Entity.prototype.draw.call(this);

}

function Player(game) {

    this.score = 0;
    this.dead = false; 
 //   this.game.score2.innerHTML = this.score;
    this.game = game;
    this.game.score2.innerHTML = this.score;

 //   this.ball = ball;
    this.paddle = new Paddle(game, 370, 750, 65, 10, this.ball);
    this.game.addEntity(this.paddle);
    
}

Player.prototype = new Entity();
Player.prototype.constructor = Player;

Player.prototype.update = function() {
  this.game.score2.innerHTML = this.score;
    if (this.game.running) {
        if (this.dead) {
            this.game.reset();
            return;
        }
    if (this.game.left === true) {
         this.paddle.x -= 5;
         this.paddle.x_speed = -5;
         if(this.paddle.x < 0) { // all the way to the left
            this.paddle.x = 0;
            this.paddle.x_speed = 0;
         }
    }
    if (this.game.right === true) {
        this.paddle.x += 5;
        this.paddle.x_speed = 5;
        if (this.paddle.x + this.paddle.width > 800) { // all the way to the right
            this.paddle.x = 800 - this.paddle.width;
            this.paddle.x_speed = 0;
         }
     }
 }
     Entity.prototype.update.call(this);
}


Player.prototype.draw = function() {
 // this.game.score2.innerHTML = this.score;
    if (this.dead || !this.game.running) return;
    this.paddle.draw();
}


function Computer(game) {
//    this.ball = ball;
    this.game = game;
    this.score = 0; 
 //   this.game.score2.innerHTML = this.score;
    this.game.score1.innerHTML = this.score;

    this.paddle = new Paddle(game, 0, 50, 65, 10, this.ball);
    this.game.addEntity(this.paddle);
}

Computer.prototype = new Entity();
Computer.prototype.constructor = Computer;

Computer.prototype.update = function() {
   this.game.score1.innerHTML = this.score;
    var diff1 = 0;
  //  console.log(diff1);
     for (var i = 0; i < this.game.entities.length; i++) {
         var ent = this.game.entities[i];
         if (ent instanceof Ball) {
 //          //  console.log("does ball exist?");
             var x_pos = ent.x;
           // console.log(x_pos);
             diff1 = -((this.paddle.x + (this.paddle.width / 2)) - x_pos);
            // console.log(diff1);
             if(diff1 < 0 && diff1 < -4) { // max speed left
                diff1 = -5;
             } else if(diff1 > 0 && diff1 > 4) { // max speed right
                 diff1 = 5;
             }
         }
     }
    this.paddle.x += diff1;
    this.paddle.x_speed = diff1;
  //  console.log(this.paddle.x_speed);
    if(this.paddle.x < 0) { // all the way to the left
         this.paddle.x = 0;
         this.paddle.x_speed = 0;
    } else if (this.paddle.x + this.paddle.width > 800) { // all the way to the right
        this.paddle.x = 800 - this.paddle.width;
        this.paddle.x_speed = 0;
    }
    Entity.prototype.update.call(this);
}


Computer.prototype.draw = function() {
   // console.log("im not drawing?");
    this.paddle.draw();
}





// the "main" code begins here

var ASSET_MANAGER = new AssetManager();


ASSET_MANAGER.queueDownload("./img/whale.png");
ASSET_MANAGER.queueDownload("./img/sharks.png");


ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var score1 = document.getElementById('score1');
    var score2 = document.getElementById('score2');
    var winner = document.getElementById('winner');

    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    gameEngine.score1 = score1;
    gameEngine.score2 = score2;
    gameEngine.winner = winner;
    gameEngine.running = true;
    var bg = new Background(gameEngine);

    var player = new Player(gameEngine, ball);
    var computer = new Computer(gameEngine, ball);
    var ball = new Ball(gameEngine, 400, 400, player, computer);
    var ball1 = new Ball(gameEngine, 200, 200, player, computer); //paddle1, paddle2);
    gameEngine.addEntity(bg);

    gameEngine.addEntity(ball);

    gameEngine.addEntity(player);
    gameEngine.addEntity(computer);

    gameEngine.init(ctx);
    gameEngine.start();

     var socket = io.connect("http://76.28.150.193:8888");
         socket.on("connect", function () {
        console.log("Socket connected.")
    });
    socket.on("disconnect", function () {
        console.log("Socket disconnected.")
    });
    socket.on("reconnect", function () {
        console.log("Socket reconnected.")
    });


    socket.on("load", function (data) {
    var studentName = data.studentname;
    var stateName = data.statename;
    // var player_score = data.player_score;
    // var computer_score = data.computer_score;
    player.score = data.player_score;
    computer.score = data.computer_score;
    player.paddle.x = data.player_paddle_position;
    computer.paddle.x = data.computer_paddle_position;
    ball.x = data.ball_position;
    ball.y = data.ball_y_position;
    ball.x_speed = data.ball_x_speed;
    ball.y_speed = data.ball_y_speed;
    ball.update();
    player.update();
    computer.update();

});
 var button1 = document.getElementById("save");
 button1.addEventListener("click", function() {
    socket.emit("save", { studentname: "Mehgan Cook", statename: "CurrentPingPongGame", player_score: player.score, computer_score: computer.score,
                          player_paddle_position: player.paddle.x , computer_paddle_position: computer.paddle.x, ball_position: ball.x, ball_x_speed: ball.x_speed,
                          ball_y_speed: ball.y_speed, ball_y_position: ball.y});
    console.log("saved!");
    }, false);
 // document.getElementById('canvas').focus();
var button2 = document.getElementById("load");
    button2.addEventListener("click", function() {
    socket.emit("load", { studentname: "Mehgan Cook", statename: "CurrentPingPongGame" });
    console.log("loads!");
    }, false);
 });
