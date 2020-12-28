var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var human;
canvas.width = 500;
canvas.height = 500;

var Board = {
	
	squareSize: 400,	
	
	angle: (Math.PI / 2)*3,
	runDisplay: true,
	action: false,
	
	
	restart: function(){
		newBoard = new GameBoard();
		Board.angle = 0;
	},
	startUp: function(){
		Board.restart();
		if(Board.runDisplay === true){
			Board.draw()
		}
	},
	center: function(){
		ctx.translate(canvas.width/2,canvas.height/2);
	},
	centerBack: function(){
		ctx.translate(canvas.width/-2,canvas.height/-2);
	},
	rotate: function(angle){
		ctx.rotate(angle);
	},
	timerRotate: function(dataSet,until,rate){
		if(Board.angle >= until){
			Board.angle = until;
			Board.angle %= (Math.PI * 2);
			Board.angle = Math.floor(Board.angle / (Math.PI / 2)) * (Math.PI / 2);
			Board.draw(dataSet);
		}else{
			Board.angle += Math.PI / rate;
			Board.draw(dataSet);
			setTimeout(function(){Board.timerRotate(dataSet,until,rate);}, 1000/rate);
		}
	},
	halfRotate: function(dataSet){
		let currentAngle = Board.angle + Math.PI;
		let numStops = 90;
		
		Board.timerRotate(dataSet,currentAngle,numStops);
	},
	fillSquare: function(){
		let x = Board.squareSize;
		ctx.fillStyle = "#aaaaaa";
		ctx.fillRect(x/-2 - x/128,x/-2 - x/128,x + x/64,x + x/64);
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(x/-2,x/-2,x,x);
		
		ctx.fillStyle = "#000000";
		for(let i = 0; i < 4; i++){
			for(let j = 0; j < 4; j++){
				ctx.fillRect(x/-2 + j*x/4, x/-2 + i*x/4, x / 8, x / 8);
				ctx.fillRect(x/-2 + j*x/4 + x / 8, x/-2 + i*x/4 + x / 8, x / 8, x / 8);
			}
		}
		
	},
	drawBoard: function(){
		Board.fillSquare();
		//Board.centerBack();
		//ctx.restore();
	},
	drawBack: function(){
		ctx.fillStyle = "#ffffff";
		//console.log("hello");
		ctx.fillRect(0,0,canvas.width,canvas.height);
	},
	drawPerson: function(name,x,y){
		switch(name){
		case 1:
			ctx.beginPath();
			ctx.arc(x, y, Board.squareSize/16, 0, 2 * Math.PI);
			ctx.fillStyle = "#ff0000";
			ctx.fill();
		break;
		case -1:
			ctx.beginPath();
			ctx.arc(x, y, Board.squareSize/16, 0, 2 * Math.PI);
			ctx.fillStyle = "#808080";
			ctx.fill();
		break;
		case 2:
			ctx.beginPath();
			ctx.arc(x, y, Board.squareSize/16, 0, 2 * Math.PI);
			ctx.fillStyle = "#ffffff";
			ctx.fill();
			ctx.beginPath();
			ctx.arc(x, y, Board.squareSize/16 * 7/8, 0, 2 * Math.PI);
			ctx.fillStyle = "#ff0000";
			ctx.fill();
		break;
		case -2:
			ctx.beginPath();
			ctx.arc(x, y, Board.squareSize/16, 0, 2 * Math.PI);
			ctx.fillStyle = "#ffffff";
			ctx.fill();
			ctx.beginPath();
			ctx.arc(x, y, Board.squareSize/16 * 7/8, 0, 2 * Math.PI);
			ctx.fillStyle = "#808080";
			ctx.fill();
		break;
		default:
		break;
		}
	},
	
	
	drawPeople: function(dataSet){
		
		let x = Board.squareSize;
		
		for(let i = 0; i < dataSet.board.length; i++){
			for(let j = 0; j < dataSet.board[i].length; j++){
				Board.drawPerson(dataSet.board[i][j], x/8*j-x/2 + x/16, x/8*i-x/2 + x/16)
			}
		}
		//Board.centerBack();
		//ctx.restore();
	},
	drawBefore: function(dataSet){
		if(dataSet.turn > 1){
			let x = Board.squareSize;
			ctx.fillStyle = "#aaaaaa";
			ctx.fillRect(x/-2 + x/8 * dataSet.fromX, x/-2 + x/8 * dataSet.fromY, x/8, x/8);
		}
	},
	drawRandomSquare: function(x,y){
		if(human.clickedBoard == true){
		let size = Board.squareSize;
		ctx.fillStyle = "#ffd633";
		ctx.fillRect(size/-2 + size/8 * x, size/-2 + size/8 * y, size/8, size/8);
		}
	},
	drawWinner: function(dataSet){

	},
	draw: function(dataSet){
		//ctx.save();
		Board.drawBack();
		ctx.save();
		Board.center();
		Board.rotate(Board.angle);
		Board.drawBoard();
		Board.drawBefore(dataSet);
		Board.drawRandomSquare(human.x,human.y);
		Board.drawPeople(dataSet);
		ctx.restore()
	}
};
