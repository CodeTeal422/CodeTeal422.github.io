//Board constructor
class GameBoard{
	constructor(player1 = human, player2 = human){// each player has to have .move and some way call rules.filterMove after
	this.board = [[0,0,0],[0,0,0],[0,0,0]];
	this.whichSide = 1;
	this.player1 = player1;
	this.player2 = player2;
	};
};

var rules = {
	diagonalWin: function(dataSet){
		let upRight = dataSet.board[0][2] + dataSet.board[1][1] + dataSet.board[2][0];
		let downRight = dataSet.board[0][0] + dataSet.board[1][1] + dataSet.board[2][2];
		if(Math.abs(upRight) === 3 || Math.abs(downRight) === 3){
			return dataSet.board[1][1];
		}else{
			return 0;
		}
	},
	horizontalWin: function(dataSet){
		for(let i = 0; i < 3; i++){
			let temp = dataSet.board[i][0] + dataSet.board[i][1] + dataSet.board[i][2];
			if(Math.abs(temp) === 3){
				return dataSet.board[i][0];
			}
		}
		return 0;
	}, 
	verticalWin: function(dataSet){
		for(let i = 0; i < 3; i++){
			let temp = dataSet.board[0][i] + dataSet.board[1][i] + dataSet.board[2][i];
			if(Math.abs(temp) === 3){
				return dataSet.board[0][i];
			}
		}
		return 0;
	},
	gameWon: function(dataSet){
		let dia = rules.diagonalWin(dataSet);
		let hor = rules.horizontalWin(dataSet);
		let ver = rules.verticalWin(dataSet);
		if(dia !== 0){
			return dia;
		}else if(hor !== 0){
			return hor;
		}else if(ver !== 0){
			return ver;
		}else{
			return 0;
		}
	},
	cats: function(dataSet){
		for(let i = 0; i < 3; i++){
			for(let j = 0; j < 3; j++){
				if(dataSet.board[i][j] === 0){
					return false;
				}
			}
		}
		if(rules.gameWon(dataSet) === 0){
			return true;
		}
	},
	possibleMoves: function(dataSet){
		let output = [];

		if(rules.gameWon(dataSet) === 0){
			for(let y = 0; y < 3; y++){
				for(let x = 0; x < 3; x++){
					if(dataSet.board[y][x] === 0){
						output.push([x,y]);
					}
				}
			}
		}

		return output;
	},
	move: function(dataSet,x,y){
		if(rules.gameWon(dataSet) === 0 && dataSet.board[y][x] === 0){
			dataSet.board[y][x] = dataSet.whichSide;
			dataSet.whichSide *= -1;	
		}else{
			console.log("try again");
		}
		rules.playGame(dataSet)
	},
	playGame: function(dataSet){
		Board.draw(dataSet);

		if(rules.gameWon(dataSet) !== 0 || rules.cats(dataSet) === true){
			console.log("game over");
		}else{

			if(dataSet.whichSide === 1){
				dataSet.player1.move(dataSet);
			}else if(dataSet.whichSide === -1){
				dataSet.player2.move(dataSet);
			}
		}
	}
}