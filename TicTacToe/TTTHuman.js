var human = {
    board: "change me",
    canMove: false,
    move: function(dataSet){
        //console.log("call the function rules.move(dataSet, x, y)");
        human.board = dataSet;
        human.canMove = true;
    },
    canvasMove: function(event){
        if(human.canMove === true){
            human.canMove = false;
            let x = Math.floor((event.offsetX) / (Board.squareSize));
            let y = Math.floor((event.offsetY) / (Board.squareSize));
            rules.move(human.board, x, y);
        }
    }
};
var newdata = new GameBoard(human, minMax);
human.board = newdata;
rules.playGame(newdata);