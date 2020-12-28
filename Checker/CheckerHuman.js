/*
Each player has to have 
player.move(dataSet)

*/

var human = {// next problem or question is what happens if it does not work
	move: function(dataSet){
    //console.log(dataSet.board);
    if(this.rotateBoardBool == true){
    human.rotateBoard(human.dataSet);
    }
    human.clickedBoard = false;
    Board.draw(dataSet);
  },
  rotateBoardBool: true,//false
  dataSet: "change me",
  x: 0,
  y: 0,
  dir: 1,
  clickedBoard: false,
  canvasMove: function(event){
    let startX = (canvas.width - Board.squareSize) / 2;
    let startY = (canvas.height - Board.squareSize) / 2;

    let x = Math.floor((event.offsetX - startX) / (Board.squareSize / 8)) - 3.5;
    let y = Math.floor((event.offsetY - startY) / (Board.squareSize / 8)) - 3.5;
    for(let i = 0; i < Board.angle / (Math.PI/2); i++){
      let temp = x * -1;
      x = y;
      y = temp;
    }
    x += 3.5;
    y += 3.5;

    if(x >= 0 && x <= 7 && y >= 0 && y <= 7 && human.clickedBoard == false){
      human.x = x;
      human.y = y;
      human.clickedBoard = true;
      Board.draw(human.dataSet);
    }else if (human.clickedBoard == true && human.x != x && human.y != y){
      human.clickedBoard = false;
      Board.draw(human.dataSet);
      if(human.x < x){
        if(human.y < y){
          human.dir = 3;
        }else if(human.y > y){
          human.dir = 4;
        }else{console.log("something went wrong");}
      }else if(human.x > x){
        if(human.y < y){
          human.dir = 2;
        }else if(human.y > y){
          human.dir = 1;
        }else{console.log("something went wrong");}
      }else{console.log("something went wrong");}
      human.submitMove();
    }else if(human.x == x && human.y == y){
      console.log("action cleared");
      human.clickedBoard = false;
      Board.draw(this.dataSet);
    }
  },
	submitMove: function(){
    rules.filterMove(human.dataSet,human.x,human.y,human.dir);
    human.clickedBoard = false;
    Board.draw(this.dataSet);
  },
  rotateBoard: function(dataSet){
    if(Board.angle == Math.PI + Math.PI / 2 * dataSet.whoTurn){
      Board.halfRotate(dataSet);
    }
  },
};
var newdata = new GameBoard(human, minAlpha);
human.dataSet = newdata;
rules.playGame(newdata);