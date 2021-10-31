//Create variables here
var gameState = "hungry";
var bedroomImg,gardenImg,washroomImg;
var dog,dogImg,happyDog,milkImg,foodS,foodStock;
var database;
var feed,addFoods,fedTime,lastFed,foodObj;
var currentTime;

function preload()
{
	dogImg = loadImage("images/dogimg.png");
  happyDog = loadImage("images/dogimg1.png");
  bedroomImg = loadImage("images/Bed Room.png");
  gardenImg = loadImage("images/Garden.png");
  washroomImg = loadImage("images/Wash Room.png");

}

function setup() {
  database = firebase.database();
	createCanvas(800, 500);

  foodObj = new Food();

  readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  })

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  dog = createSprite(600,250,10,10);
  dog.addImage(dogImg);
  dog.scale=0.2

  feed = createButton("Feed the dog")
  feed.position(850,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food")
  addFood.position(950,95);
  addFood.mousePressed(addFoods);
  
}


function draw() {  
background(46,139,87);

currentTime = hour();
if(currentTime == (lastFed+1)){
  update("playing");
  foodObj.garden();
}else if(currentTime == (lastFed+2)){
  update("sleeping");
  foodObj.bedroom();
}else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
  update("bathing");
  foodObj.washroom();
}else {
  update("hungry");
  foodObj.display();
}

if (gameState !="hungry"){
  feed.hide();
  addFood.hide();
  dog.remove();
}else{
  feed.show();
  addFood.show();
}

fedTime = database.ref('FeedTime');
fedTime.on("value",function(data){
  lastFed=data.val();
})
fill(255);
textSize(15);
if(lastFed>12){
  text("Last Feed : " + lastFed%12 + "PM",150,60);
}
else if(lastFed==0){
  text("Last Feed : 12AM ",150,60);
}
else {
  text("Last Feed : " + lastFed + "AM",150,60);
}

  drawSprites();
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x){
  if(x<=0){
    x=0;
  }else{
    x=x-1;
  }
  database.ref('/').update({
    Food:x
  })
}

function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    Feedtime:hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}


