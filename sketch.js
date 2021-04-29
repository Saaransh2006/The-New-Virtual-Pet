//Declaring the variables.
var drinkSound,moneySound,errorSound,money,user,pet,foodS,dogLeft;
var dogImg,dogHappy,milkBottleImg,cloudImg,database,gameState,stage3;
var dog,milkBottle,cloud,foodStock,moneyLeft,dogSprite1,stage2;
var feed,addFood,userName,petName,milk,fedTime,dogRight,stage;
var readState,bedroomImg,gardenImg,washroomImg,readStage,readStage2;
var lastFed = 0;

//Function for preloading.
function preload(){
  //Loading images and sounds to different variables.
  dogImg = loadImage("images/Dog.png");
  dogHappy = loadImage("images/happy_dog.png");
  milkBottleImg = loadImage("images/Milk.png");
  cloudImg = loadImage("images/cloud.png");
  bedroomImg = loadImage("images/Bedroom.png");
  gardenImg = loadImage("images/Garden.jpg");
  washroomImg = loadImage("images/Washroom.png");
  roomImg = loadImage("images/Room.png");
  dogRight = loadImage("images/running_right.png");
  dogLeft = loadImage("images/running_left.png");
  helpBg = loadImage("images/Help.png");
  drinkSound = loadSound("sounds/drinkSound.wav");
  moneySound = loadSound("sounds/Money.wav");
  errorSound = loadSound("sounds/error.mp3");
}

//Function for setting up.
function setup() {
  //Setting database's value as the realtime firebase database's value.
  database = firebase.database();
  //Creating the canvas area.
  createCanvas(900,500);

  drinkSound.setVolume(0.1);
  moneySound.setVolume(0.3);
  errorSound.setVolume(0.5);
  money = 0;
  stage3 = 1;

  dog = createSprite(750,400,150,150);
  dog.addImage(dogImg);
  dog.scale = 0.25;

  dogSprite1 = createSprite(50,400,10,10);
  dogSprite1.scale = 0.25;
  dogSprite1.visible = false;

  milkBottle = createSprite(440,390,10,10);
  milkBottle.addImage(milkBottleImg);
  milkBottle.visible = false;
  milkBottle.scale = 0.13;

  cloud = createSprite(600,205,10,10);
  cloud.addImage(cloudImg);
  cloud.scale = 0.64;
  cloud.visible = false;

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  moneyLeft = database.ref('Money');
  moneyLeft.on("value",readAccount);

  feed = createButton("Feed");
  feed.position(10,100);
  feed.mousePressed(feedDog);

  walk = createButton("Go for a Walk");
  walk.position(130,70);
  walk.mousePressed(playtime);

  washroom = createButton("Go to the Washroom");
  washroom.position(70,100);
  washroom.mousePressed(bathing);

  addFood = createButton("Buy milk bottles");
  addFood.position(10,70);
  addFood.mousePressed(addFoods);

  help = createButton("Help");
  help.position(840,70);
  help.mousePressed(changeStage3);

  back = createButton("Back");
  back.position(820,30);
  back.mousePressed(goBack);

  userName = createInput("Fill Your Name here");
  userName.position(10,10);

  petName = createInput("Fill Your Pet's Name here");
  petName.position(10,40);

  milk = new Food();
}

//Draw loop function.
function draw() {
  //Changing the background color.
  background(46,139,87);

  readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState = data.val();
  })

  readStage = database.ref('Stage');
  readStage.on("value",function(data){
    stage = data.val();
  })

  readStage2 = database.ref('Stage2');
  readStage2.on("value",function(data){
    stage2 = data.val();
  })

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data) {
    lastFed = data.val();
  });

  user = userName.value();
  pet = petName.value();

  if(gameState != "Hungry") {
    dog.visible = false;
  }
  else {
    dog.visible = true;
  }
  
  if(gameState === "Playing") {
    if(dogSprite1.x >= 850) {
      dogSprite1.x = 850;
      dogSprite1.velocityX = -3;
      dogSprite1.addImage(dogLeft);
    }
    if(dogSprite1.x <= 50) {
      dogSprite1.velocityX = 3;
      dogSprite1.x = 50;
      dogSprite1.addImage(dogRight);
    }
  }

  if(gameState != "Playing") {
    if(stage === 2) {
      stage = 1;
      updateStage();
    }
  }
  if(gameState != "Bathing") {
    if(stage2 === 2) {
      stage2 = 1;
      updateStage2();
    }
  }

  currentTime = hour();
  if(currentTime === (lastFed + 2)) {
    update("Playing");
    if(stage === 1) {
      milk.room();
    }
    else {
      milk.garden();
      dogSprite1.visible = true;
      walk.hide();
      feed.hide();
      washroom.hide();
      addFood.hide();
      userName.hide();
      petName.hide();
    }
  }
  else if(currentTime === (lastFed + 3)) {
    update("Sleeping");
    milk.bedroom();
  }

  else if(currentTime === lastFed + 4 || currentTime === lastFed + 5) {
    update("Bathing");
    if(stage2 === 1) {
      milk.room();
    }
    else {
      milk.washroom();
      walk.hide();
      feed.hide();
      washroom.hide();
      addFood.hide();
      userName.hide();
      petName.hide();
    }
  }
  else {
    update("Hungry");
    milk.display();
  }

  if(milkBottle.x > 640) {
    milkBottle.x = 440;
    milkBottle.velocityX = 0;
    milkBottle.visible = false;
    dog.addImage(dogImg);
    drinkSound.play();
  }

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data) {
    lastFed = data.val();
  });

  fill("white");
  textAlign(NORMAL);
  textFont("cursive");
  textSize(15);
  if(lastFed > 12) {
    text("Last Fed : "+ lastFed % 12 + " PM",770,55);
  }
  else if(lastFed === 0) {
    text("Last Fed : 12 AM",770,55);
  }
  else if(lastFed === 12) {
    text("Last Fed : 12 PM",770,55);
  }
  else {
    text("Last Fed : "+ lastFed + " AM",770,55);
  }
  text("Money Left : " + money,620,55);
  text("Max. bottles of milk : 20",670,30);

  if(gameState === "Hungry") {
    if(user != "Fill Your Name here" && pet != "Fill Your Pet's Name here") {
      cloud.visible = true;

      if(milk.getFoodStock() === 0) {
        if(money === 0) {
          fill("yellow");
          textAlign(CENTER);
          textSize(20);
          text("Messages : Your money account is",180,170);
          text("empty. You can no longer buy milk",180,195);
          text("bottles. 😢😢",180,220);
          text("(Press 'Help' to know how to get",180,245);
          text("more money in your account)",180,270);
        }
        else if(money > 0) {
          fill("yellow");
          textAlign(CENTER);
          textSize(20);
          text("Messages : Food Stock is empty.",180,170);
          text("You can no longer feed your pet. 😢😢",180,195);
          text("(Press 'Help' to know how to buy",180,220);
          text("milk bottles)",180,245);
        }
      }
      else {
        if(money === 0) {
          fill("yellow");
          textAlign(CENTER);
          textSize(20);
          text("Your money account is empty. 😢😢",180,245);
          text("(Press 'Help' to know how to get",180,270);
          text("more money in your account)",180,295);
        }
        fill("yellow");
        textAlign(CENTER);
        textSize(20);
        text("Messages : Your virtual pet is hungry.",180,170);
        text("Press 'Feed' to feed your virtual pet ",180,195);
        text(pet + ". 🦴 🦴",180,220);
      }
    }

    else {
      fill("yellow");
      textAlign(CENTER);
      textSize(20);
      text("Messages : Please fill your and your",180,170);
      text("virtual pet's name in the boxes",180,195);
      text("provided above. (Press the 'Help'",180,220);
      text("button if you are for the first",180,245);
      text("time here.)",180,270);
    }  
  }

  if(gameState === "Playing") {
    if(stage === 1) {
      if(user != "Fill Your Name here" && pet != "Fill Your Pet's Name here") {
        fill("yellow");
        textAlign(CENTER);
        textSize(20);
        text("Messages : Its your virtual",140,170);
        text("pet's play time! Press 'Go",140,195);
        text("for a Walk' to take your",140,220);
        text("virtual pet " + pet + " to",140,245);
        text("the park!! 🦴 🦴",140,270);
      }

      else {
        fill("yellow");
        textAlign(CENTER);
        textSize(20);
        text("Messages : Please fill your",140,170);
        text("and your virtual pet's name",140,195);
        text("in the boxes provided above.",140,220);
        text("(Press the 'Help' button",140,245);
        text("if you are for the first",140,270);
        text("time here.)",140,295);
      }
    }

    else if(stage === 2) {
      fill("black");
      textAlign(CENTER);
      textSize(20);
      text("Messages : Your virtual",140,125);
      text("pet is playing. Come",140,150);
      text("again after 2-3 hours to",140,175);
      text("complete another task and",140,200);
      text("make your virtual pet happier.",142,225);
      text("Also, Rs.60 are added in",140,250);
      text("your money account. See you later!! 👋👋",150,275);
    }
  }

  if(gameState === "Sleeping") {
    if(user != "Fill Your Name here" && pet != "Fill Your Pet's Name here") {
      fill("yellow");
      textAlign(CENTER);
      textSize(20);
      text("Messages : SSh..!! Your",140,170);
      text("virtual pet " + pet,140,195);
      text("is sleeping! Come back",140,220);
      text("again after some time.",140,245);
      text("Press the 'Help' button to",140,270);
      text("get more information. 🤫",140,295);
    }

    else {
      fill("yellow");
      textAlign(CENTER);
      textSize(20);
      text("Messages : Please fill your",140,170);
      text("and your virtual pet's name",140,195);
      text("in the boxes provided above.",140,220);
      text("(Press the 'Help' button",140,245);
      text("if you are for the first",140,270);
      text("time here.)",140,295);
    }
  }

  if(gameState === "Bathing") {
    if(stage2 === 1) {
      if(user != "Fill Your Name here" && pet != "Fill Your Pet's Name here") {
        fill("yellow");
        textAlign(CENTER);
        textSize(20);
        text("Messages : Its your virtual",140,170);
        text("pet's bath time! Press 'Go",140,195);
        text("to the washroom' to take your",140,220);
        text("virtual pet " + pet + " to",140,245);
        text("the washroom!! 🦴 🦴",140,270);
      }

      else {
        fill("yellow");
        textAlign(CENTER);
        textSize(20);
        text("Messages : Please fill your",140,170);
        text("and your virtual pet's name",140,195);
        text("in the boxes provided above.",140,220);
        text("(Press the 'Help' button",140,245);
        text("if you are for the first",140,270);
        text("time here.)",140,295);
      }
    }

    else if(stage2 === 2) {
      fill("yellow");
      textAlign(CENTER);
      textSize(20);
      text("Messages : Your virtual",140,170);
      text("pet is bathing. Come",140,195);
      text("again after 1-2 hours to",140,220);
      text("feed your virtual pet.",140,245);
      text("Also, Rs.60 are added in",140,270);
      text("your money account. See",140,295);
      text("you later!! 👋👋",140,320);
    }
  }

  //Displaying the sprites.
  drawSprites();

  if(stage3 === 1) {
    back.hide();
  }
  else if(stage3 === 2) {
    if(gameState === "Hungry") {
      image(helpBg,450,250);
    }
    else {
      image(helpBg,0,0);
    }
    walk.hide();
    feed.hide();
    washroom.hide();
    addFood.hide();
    userName.hide();
    petName.hide();
    help.hide();
  }

  if(user != "Fill Your Name here" && pet != "Fill Your Pet's Name here" && gameState === "Hungry" && stage3 === 1) {
    fill("black");
    textFont("segoe script");
    textSize(15);
    text("Hello " + '"' + user + '"' + ", I am your",610,165);
    text("virtual pet " + '"' + pet + '"' + ". I am a",610,190);
    text("bit hungry. Can you please feed",610,215);
    text("me some food ? 🐶🐶",610,240);
  }
}

function update(state) {
  database.ref('/').update({
    gameState:state
  });
}

function updateStage() {
  database.ref('/').update({
    Stage:stage
  });
}

function updateStage2() {
  database.ref('/').update({
    Stage2:stage2
  });
}

function changeStage3() {
  stage3 = 2;
  back.show();
}

function goBack() {
  stage3 = 1;
  walk.show();
  feed.show();
  washroom.show();
  addFood.show();
  userName.show();
  petName.show();
  help.show();
}

function readStock(data) {
  foodS = data.val();
  milk.updateFoodStock(foodS);
}

function readAccount(data) {
  money = data.val();
}

function playtime() {
  if(gameState === "Playing" && user != "Fill Your Name here" && pet != "Fill Your Pet's Name here") {
    money = money + 60;
    database.ref('/').update({
      Money:money
    })
    moneySound.play();
    stage =  2;
    updateStage();
  }
  else {
    errorSound.play();
  }
}

function bathing() {
  if(gameState === "Bathing" && user != "Fill Your Name here" && pet != "Fill Your Pet's Name here") {
    money = money + 60;
    database.ref('/').update({
      Money:money
    })
    moneySound.play();
    stage2 = 2;
    updateStage2();
  }
  else {
    errorSound.play();
  }
}

function feedDog() {
  if(milkBottle.velocityX === 0 &&  milk.getFoodStock() > 0 && user != "Fill Your Name here" && pet != "Fill Your Pet's Name here" && gameState === "Hungry") {
    dog.addImage(dogHappy);
    
    milkBottle.visible = true;
    milkBottle.velocityX = 4;
    
    if(milk.getFoodStock() <= 0) {
      milk.updateFoodStock(milk.getFoodStock()*0);
    }
    else {
      milk.updateFoodStock(milk.getFoodStock()-1);
    }
    
    database.ref('/').update({
      Food:milk.getFoodStock(),
      FeedTime:hour()
    })
  }
  else if(milkBottle.velocityX > 0) {
    dog.addImage(dogHappy);
  }
  else {
    dog.addImage(dogImg);
    errorSound.play();
  }
}

function addFoods() {
  if(foodS < 20 && money > 0 && user != "Fill Your Name here" && pet != "Fill Your Pet's Name here" && gameState === "Hungry") {
    foodS++;
    database.ref('/').update({
      Food:foodS
    })
    money = money - 120;
    database.ref('/').update({
      Money:money
    })
    moneySound.play();
  }
  else {
    errorSound.play();
  }
}
