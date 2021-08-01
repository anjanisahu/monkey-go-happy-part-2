var ground, groundImage;
var backgnd, backgndImage;
var monkey, monkey_running;
var banana, bananaImage, bananaGroup;
var obstacle, obstacleImage, obstacleGroup;
var score = 0;
var survivalTime = 0;
var PLAY = 1;
var END = 2;
var gameState = PLAY;


function preload() {
  monkey_running = loadAnimation(
    "Monkey_01.png",
    "Monkey_02.png",
    "Monkey_03.png",
    "Monkey_04.png",
    "Monkey_05.png",
    "Monkey_06.png",
    "Monkey_07.png",
    "Monkey_08.png",
    "Monkey_09.png",
    "Monkey_10.png");
  backgndImage = loadImage("jungle.jpg");
  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("stone.png");
}

function setup() {

  backgnd = createSprite(0, 0, windowWidth, windowHeight);
  backgnd.addImage(backgndImage);
  backgnd.velocityX = -4;
  backgnd.scale = 1.5;
  backgnd.x = backgnd.width / 2;

  createCanvas(1003-300, windowHeight);

  ground = createSprite(400, 350, windowWidth, 20);
  ground.velocityX = -4;
  ground.x = ground.width / 2;
  //console.log(ground.x);
  ground.visible = false;
  
  monkey = createSprite(80, 315, 20, 20);
  monkey.addAnimation("moving", monkey_running);
  monkey.scale = 0.1;

  bananaGroup = createGroup();
  obstacleGroup = createGroup();
}

function draw() {
  background('white');
  if (gameState === PLAY) {
    handleJump();
    resetGround();
    createFood();
    createObstacle();

    // do score
    if (monkey.isTouching(bananaGroup)) {
      score = score + 2;
      bananaGroup.destroyEach();
      // todo: delete individual sprite element
      // touched by the monkey to control the score
    }

    // prevent survival
    if (monkey.isTouching(obstacleGroup)) {
      //gameState = END;
      //obstacleGroup.destroyEach();
      monkey.scale = 0.1;
      backgnd.velocityX = 0;
    }
    
    if ((backgnd.velocityX === 0) && (monkey.isTouching(obstacleGroup) === false)) {
      backgnd.velocityX = -4;    
    }

    // increase size based on score
    switch (score) {
      case 10:
        monkey.scale = 0.12;
        break;
      case 20:
        monkey.scale = 0.14;
        break;
      case 30:
        monkey.scale = 0.16;
        break;
      case 40:
        monkey.scale = 0.18;
        break;
    }
  }

  if (gameState == PLAY) {

    survivalTime = Math.ceil(frameCount / frameRate());

  } else if (gameState == END) {

    stroke("red");
    textSize(30);
    fill("red");
    text("GAME OVER", 300, 300);
    monkey.velocityX = 0;
    bananaGroup.setVelocityXEach(0);
    obstacleGroup.setVelocityXEach(0);
    ground.velocityX = 0;

    // restart game
    if (keyDown("space")) {
      score = 0;
      survivalTime = 0;
      frameCount = 0;
      gameState = PLAY;
    }
  }

  drawSprites();

  monkey.collide(ground);

  stroke("white");
  textSize(20);
  fill("white");
  text("score: " + score, windowWidth - 300, 50);

  stroke("white");
  textSize(20);
  fill("white");
  text("survival time: " + survivalTime, 100, 50);

  //console.log(survivalTime);
  //console.log(frameRate()); 
  //console.log(frameCount);
  //console.log(backgnd.width);
  //console.log(windowWidth);
}

function handleJump() {

  // jump on space key
  if (keyDown("space")) {
    monkey.velocityY = -10;
  }
  // add gravity
  monkey.velocityY = monkey.velocityY + 0.8;
}

function resetGround() {
  // scroll ground
  if (ground.x < 0) {
    ground.x = ground.width / 2;
  }
  if (backgnd.x < 0) {
    backgnd.x = backgnd.width/2;
  }
}

function createFood() {
  if ((World.frameCount % 80) === 0) {
    var randY = Math.round(random(120, 210));
    banana = createSprite(450, randY, 20, 20);
    banana.addImage(bananaImage);
    banana.lifetime = 140;
    banana.velocityX = -4;
    banana.scale = 0.05;
    bananaGroup.add(banana);
  }
}

function createObstacle() {
  if ((World.frameCount % 300) === 0) {
    //var randX = Math.round(random(150, 550));
    obstacle = createSprite(600, 327, 20, 20);
    obstacle.addImage(obstacleImage);
    obstacle.lifetime = 140;
    obstacle.velocityX = -4;
    obstacle.scale = 0.15;
    obstacleGroup.add(obstacle);
  }
}