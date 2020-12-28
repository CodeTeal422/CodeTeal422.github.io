var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");


var Board = {
    squareSize:  Math.floor(c.width / 3),
    drawBackGround: function(){
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, Board.squareSize, Board.squareSize);
        ctx.fillRect(Board.squareSize * 2, 0, Board.squareSize, Board.squareSize);
        ctx.fillRect(0, Board.squareSize * 2, Board.squareSize, Board.squareSize);
        ctx.fillRect(Board.squareSize * 2, Board.squareSize * 2, Board.squareSize, Board.squareSize);
        ctx.fillRect(Board.squareSize, Board.squareSize, Board.squareSize, Board.squareSize);
    },
    drawPeople: function(dataSet){
        for(let y = 0; y < 3; y++){
            for(let x = 0; x < 3; x++){
                if(dataSet.board[y][x] === 1){
                    ctx.beginPath();
                    ctx.arc(x * Board.squareSize + Board.squareSize / 2, y * Board.squareSize + Board.squareSize / 2, Board.squareSize*3/8, 0, 2 * Math.PI);
                    ctx.fillStyle = "#ff0000";
                    ctx.fill();
                }else if(dataSet.board[y][x] === -1){
                    ctx.beginPath();
                    ctx.arc(x * Board.squareSize + Board.squareSize / 2, y * Board.squareSize + Board.squareSize / 2, Board.squareSize*3/8, 0, 2 * Math.PI);
                    ctx.fillStyle = "#0000ff";
                    ctx.fill();
                }
            }
        }
    },
    draw: function(dataSet){
        // for(let i = 0; i < 3; i++){
        //     console.log(dataSet.board[i]);
        // }
        Board.drawBackGround();
        Board.drawPeople(dataSet);
    }
};