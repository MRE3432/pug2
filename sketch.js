var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var dieSound, checkpoint;
var score=0;
var jumpSound;
var gameOver, restart;



function preload(){
  trex_running =   loadAnimation("pug1.png","pug2.png");
  trex_collided = loadAnimation("pug3.png");
  
  groundImage = loadImage("ground2.png");
  jumpSound = loadSound("jump.mp3");
  cloudImage = loadImage("cloud.png");
  checkpoint = loadSound("checkpoint.mp3");
  dieSound = loadSound ("die.mp3");
  obstacle1 = loadImage("arbusto.jpeg");
  obstacle2 = loadImage("arbusto2.jpeg");
  obstacle3 = loadImage("arbusto3.png");
  obstacle4 = loadImage("arbusto4.png");
  obstacle5 = loadImage("arbusto5.png");
  obstacle6 = loadImage("arbusto6.jpeg      ");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  
  trex = createSprite(50,180,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.1;
  
  ground = createSprite(200,height - 10,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(width/2,height/2-50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,height -5,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(255);
  text("Score: "+ score, 500,50);
     if(score>0 && score%100 === 0){ 
      checkpoint.play() 
     }
       if (gameState===PLAY){
        score = score + Math.round(getFrameRate()/60);
    
        ground.velocityX = -(6 + 3*score/100);
  
       if((touches.length > 0 || keyDown("SPACE")) && trex.y >= height-120) {
       trex.velocityY = -10;
        jumpSound.play();
       touches  = [];
       } 
       trex.velocityY = trex.velocityY + 0.8
  
        if (ground.x < 0){
        ground.x = ground.width/2;
       }
  
       trex.collide(invisibleGround);
       spawnClouds();
       spawnObstacles();
  
       if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        dieSound.play();
       }
       }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //establecer velocidad para cada objeto del juego en 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //cambiar la animación del trex
    trex.changeAnimation("collided",trex_collided);
    
    //establecer tiempo de vida a los objetos del juego para que nunca se destruyan.
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
   
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //escribir código aquí para aparecer nubes.
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(80,300));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //asignar tiempo de vida a la variable
    cloud.lifetime = 1000;
    
    //ajustar la profundidad.
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //agregar cada nube a un grupo.
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,height -30,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generar obstáculos aleatorios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //asignar tamaño y tiempo de vida al obstáculo.            
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //agregar cada obstáculo al grupo
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
 
  
  score = 0;
  
}