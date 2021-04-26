class Food {
    constructor() {
        this.foodStock = 0;
        this.lastFed;
        this.image = loadImage("images/Milk.png");
    }

   updateFoodStock(foodStock) {
        this.foodStock = foodStock;
   }

   getFedTime(lastFed) {
        this.lastFed = lastFed;
   }

   deductFood() {
        if(this.foodStock > 0) {
             this.foodStock = this.foodStock-1;
        }
    }

    getFoodStock() {
        return this.foodStock;
    }

    bedroom() {
        background(bedroomImg,450,250);
    }

    garden() {
        background(gardenImg,450,250);
    }

    washroom() {
        background(washroomImg,450,250);
    }

    room() {
        background(roomImg,450,250);
    }

    display() {   
        var x = 50, y = 300;
        
        imageMode(CENTER);        
        if(this.foodStock != 0) {
            for(var i = 0; i < this.foodStock; i++){
                if(i % 10 === 0) {
                    x = 50;
                    y = y + 50;
                }
                image(this.image,x,y,100,100);
                x = x + 40;
            }
        }
    }
}
