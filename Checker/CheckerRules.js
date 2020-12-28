//This constructs the data for each board
class GameBoard{
	constructor(player1 = human, player2 = human){// each player has to have .move and some way call rules.filterMove after
	this.board = [];
	for(let i = 0; i < 4;i++){
			this.board.push([-1,0,-1,0,0,0,1,0]);
			this.board.push([0,-1,0,0,0,1,0,1]);
	}
	this.whoTurn = -1;//who'sTurn says says if is it 1 which is red, or -1 which is black
	this.turn = 0;
	this.player1 = player1;
	this.player2 = player2;
	this.limit = false;
	this.limitX = 0;
	this.limitY = 0;
	this.limitDir = [];
	this.fromX = 0;
	this.fromY = 0;
	this.doneMoving = false;
	};
};



rules = {
	/*
	This finds if the game is won or if it still have two people playing.
	This requires a object that has a board
	It will return 1 if red won,
	 -1 if black won
	  and 0 if on one won
	*/
	gameWon: function(board){
		let gameDone = 0;
		let redFound = false;
		let blackFound = false;
		for(let y = 0; y < board.length; y++){
			for(let x = 0; x < board[y].length; x++){
				if(board[y][x] > 0){
					redFound = true;
				}else if(board[y][x] < 0){
					blackFound = true;
				}
			}
		}
		if(redFound == true && blackFound == true){
			gameDone = 0;
		} else if(redFound == true && blackFound == false){
			gameDone = 1;
		}else if(redFound == false && blackFound == true){
			gameDone = -1;
		}
		return gameDone;
	},
	/*
	if a checker has moved to the other side of the board then it will be kinged
	this requires a object that has a board
	*/
	kingMe: function(dataSet){
		for(let i = 0; i < dataSet.board.length / 2; i++){
			if(dataSet.board[i*2][0] == 1){
				dataSet.board[i*2][0] = 2;
			}
			if(dataSet.board[i*2+1][dataSet.board.length - 1] == -1){
				dataSet.board[i*2+1][dataSet.board.length - 1] = -2;
			}
		}
	},
	/*
	this is called when someone jumpes and it finds if
	the person can jump again
	this requires a object that has a 
	board
	doneMobing
	limit
	limitX
	limtY
	limitDir
	whoTurn

	and an x and y
	*/
	limitJump: function(dataSet,x,y){
		rules.kingMe(dataSet);
		let posdir = rules.PossibleDirections(dataSet,x,y);
		let canJump = false;
		for(let i = 0; i < posdir.length; i++){
			if(posdir[i] > 10){
				canJump = true;
			}
		}

		if(canJump == true){
			dataSet.doneMoving = false;
			dataSet.limit = true;
			dataSet.limitX = x;
			dataSet.limitY = y;
			dataSet.limitDir = [];
			dataSet.whoTurn *= -1;
			for(let i = 0; i < posdir.length; i++){
				if(posdir[i] > 10){
					dataSet.limitDir.push(posdir[i] % 10);
				}
			}
		}
	},
	/*
	this finds what directions a person can go
	this requires a object with a board, and an x and y
	*/
	PossibleDirections: function(dataSet,x,y){
		/*
		1 top left
		2 bottom left
		3 bottom right
		4 top right
		*/
		let board = dataSet.board;
		let moveDir = [];
		let moveToX = [x-1,x-1,x+1,x+1];
		let moveToY = [y-1,y+1,y+1,y-1];
		let move2X = [x-2,x-2,x+2,x+2];
		let move2Y = [y-2,y+2,y+2,y-2];

		switch(board[y][x]){
			case 1:
				if(moveToX[0] >= 0 && moveToY[0] >= 0 && board[moveToY[0]][moveToX[0]] === 0){
					moveDir.push(1);
				}else if(move2X[0] >= 0 && move2Y[0] >= 0 && board[move2Y[0]][move2X[0]] === 0 && board[moveToY[0]][moveToX[0]] * board[y][x] < 0){
					moveDir.push(11);
				}

				if(moveToX[1] >= 0 && moveToY[1] <= 7 && board[moveToY[1]][moveToX[1]] === 0){
					moveDir.push(2);
				}else if(move2X[1] >= 0 && move2Y[1] <= 7 && board[move2Y[1]][move2X[1]] === 0 && board[moveToY[1]][moveToX[1]] * board[y][x] < 0){
					moveDir.push(12);
				}
			break;


			case -1:
			if(moveToX[2] <= 7 && moveToY[2] <= 7 && board[moveToY[2]][moveToX[2]] === 0){
				moveDir.push(3);
			}else if(move2X[2] <= 7 && move2Y[2] <= 7 && board[move2Y[2]][move2X[2]] === 0 && board[moveToY[2]][moveToX[2]] * board[y][x] < 0){
				moveDir.push(13);
			}

			if(moveToX[3] <= 7 && moveToY[3] >= 0 && board[moveToY[3]][moveToX[3]] === 0){
				moveDir.push(4);
			}else if(move2X[3] <= 7 && move2Y[3] >= 0 && board[move2Y[3]][move2X[3]] === 0 && board[moveToY[3]][moveToX[3]] * board[y][x] < 0){
				moveDir.push(14);
			}
			break;

			case 2:
			case -2:
			if(moveToX[0] >= 0 && moveToY[0] >= 0 && board[moveToY[0]][moveToX[0]] === 0){
				moveDir.push(1);
			}else if(move2X[0] >= 0 && move2Y[0] >= 0 && board[move2Y[0]][move2X[0]] === 0 && board[moveToY[0]][moveToX[0]] * board[y][x] < 0){
				moveDir.push(11);
			}

			if(moveToX[1] >= 0 && moveToY[1] <= 7 && board[moveToY[1]][moveToX[1]] === 0){
				moveDir.push(2);
			}else if(move2X[1] >= 0 && move2Y[1] <= 7 && board[move2Y[1]][move2X[1]] === 0 && board[moveToY[1]][moveToX[1]] * board[y][x] < 0){
				moveDir.push(12);
			}

			if(moveToX[2] <= 7 && moveToY[2] <= 7 && board[moveToY[2]][moveToX[2]] === 0){
				moveDir.push(3);
			}else if(move2X[2] <= 7 && move2Y[2] <= 7 && board[move2Y[2]][move2X[2]] === 0 && board[moveToY[2]][moveToX[2]] * board[y][x] < 0){
				moveDir.push(13);
			}

			if(moveToX[3] <= 7 && moveToY[3] >= 0 && board[moveToY[3]][moveToX[3]] === 0){
				moveDir.push(4);
			}else if(move2X[3] <= 7 && move2Y[3] >= 0 && board[move2Y[3]][move2X[3]] === 0 && board[moveToY[3]][moveToX[3]] * board[y][x] < 0){
				moveDir.push(14);
			}
			break;
			default:
			console.log("something is not working");
			break;
		}
		
		return moveDir;
	},
	/*
	this filters the possible moves from possibleMoves
	this requires a object with
	limit
	limitX
	limitY
	limitDir
	
	*/
	filterPossible: function(moveData, dataSet){		
		let xray = [];
		let yray = [];
		let moves = [];
		for(let i = 0; i < moveData.length; i++){
			xray.push(moveData[i][0]);
			yray.push(moveData[i][1]);
			moves.push(moveData[i][2]);	
		}


		let jumped = false// this part filters and makes sure that if there is a jump then it has to jump
		for(let i = 0; i < moves.length; i++){
			for(let j = 0; j < moves[i].length; j++){
				if(moves[i][j] > 10){
					jumped = true;
				}
			}
		}
		if(jumped == true){
			for(let i = 0; i < moves.length; i++){
				for(let j = 0; j < moves[i].length; j++){
					if(moves[i][j] > 10){
						moves[i][j] -= 10;
					}else{
						moves[i][j] = 0;
					}
				}
			}
			for(let i = moves.length - 1; i >= 0;i--){
				let xFound = false;
				for(let j = moves[i].length - 1; j >= 0;j--){
					if(moves[i][j] == 0){
						moves[i].splice(j,1);
					}else {
						xFound = true;
					}
				}
				if(xFound == false){
					xray.splice(i,1);
					yray.splice(i,1);
					moves.splice(i,1);
				}
			}
		}
		//final filter to remove any point that can not move in a direction
		for(let i = xray.length - 1; i >= 0; i--){
			if(moves[i].length <= 0){
				xray.splice(i,1);
				yray.splice(i,1);
				moves.splice(i,1);
			}
		}
		
		if(dataSet.limit == true){
			xray = [];
			yray = [];
			moves = [];
			xray[0] = dataSet.limitX;
			yray[0] = dataSet.limitY;
			moves[0] = dataSet.limitDir;
		}

		let output = [];
		for(let i = 0; i < xray.length; i++){
			let holdingSpot = [];
			holdingSpot.push(xray[i]);
			holdingSpot.push(yray[i]);
			holdingSpot.push(moves[i]);
			output.push(holdingSpot);
		}
		return output;
	},
	/*
	this finds what moves can be done on a board, but it needs to be filtered first
	this requires a object that has
	whoTurn
	board

	and 

	limit
	limitX
	limitY
	limitDir
	*/
	possibleMoves: function(dataSet){
		let turn = dataSet.whoTurn;
		let xray = [];
		let yray = [];
		let dirray = [];
		for(let y = 0; y < 8; y++){
			for(let x = 0; x < 8; x++){
					if(dataSet.board[y][x] === turn || dataSet.board[y][x] === turn * 2){
					xray.push(x);
					yray.push(y);
					dirray.push(rules.PossibleDirections(dataSet,x,y));
				}
			}
		}
		
		let output = [];
		for(let i = 0; i < dirray.length; i++){
			let holdingSpot = [];
			holdingSpot.push(xray[i]);
			holdingSpot.push(yray[i]);
			holdingSpot.push(dirray[i]);
			output.push(holdingSpot);
		}
		return rules.filterPossible(output, dataSet);
	},
	/*
	this moves people on the board
	this requires a object with
	fromX
	fromY
	doneMoving
	board

	and x,y, and a direction
	*/
	move: function(dataSet,x,y,direct){
		/*
		1 top left
		2 bottom left
		3 bottom right
		4 top right
		*/

		dataSet.fromX = x;
		dataSet.fromY = y;
		dataSet.limit = false;
		dataSet.whoTurn *= -1;
		dataSet.doneMoving = true;
	

		let current = dataSet.board[y][x];
		dataSet.board[y][x] = 0;
		switch(direct){
			case 1:
				if(0 === dataSet.board[y-1][x-1]){
					dataSet.board[y-1][x-1] = current;
				}else{
					dataSet.board[y-1][x-1] = 0;
					dataSet.board[y-2][x-2] = current;
					rules.limitJump(dataSet,x-2,y-2);
				}
			break;
			case 2:
				if(0 === dataSet.board[y+1][x-1]){
					dataSet.board[y+1][x-1] = current;
				}else{
					dataSet.board[y+1][x-1] = 0;
					dataSet.board[y+2][x-2] = current;
					rules.limitJump(dataSet,x-2,y+2);
				}
			break;
			case 3:
				if(0 === dataSet.board[y+1][x+1]){
					dataSet.board[y+1][x+1] = current;
				}else{
					dataSet.board[y+1][x+1] = 0;
					dataSet.board[y+2][x+2] = current;
					rules.limitJump(dataSet,x+2,y+2);
				}
			break;
			case 4:
				if(0 === dataSet.board[y-1][x+1]){
					dataSet.board[y-1][x+1] = current;
				}else{
					dataSet.board[y-1][x+1] = 0;
					dataSet.board[y-2][x+2] = current;
					rules.limitJump(dataSet,x+2,y-2);
				}
			break;
			default:
			console.log("something is not working");
			break;
		}
	},
	/*
	this takes inputs from the players and makes sure they work or the player is informed that it does not
	this requires a object with

	whoTurn
	board

	and 

	limit
	limitX
	limitY
	limitDir

	doneMoving
	whoTurn and more

	*/
	filterMove: function(dataSet,x,y,direct){
		/*need to filter if there is something that can take the other*/
		//filter added
		let input = rules.possibleMoves(dataSet);//finds the possible moves on the board
		let xray = [];
		let yray = [];
		let moves = [];
		for(let i = 0; i < input.length; i++){
			xray.push(input[i][0]);
			yray.push(input[i][1]);
			moves.push(input[i][2]);	
		}


		let jumped = false// this part filters and makes sure that if there is a jump then it has to jump
		for(let i = 0; i < moves.length; i++){
			for(let j = 0; j < moves[i].length; j++){
				if(moves[i][j] > 10){
					jumped = true;
				}
			}
		}
		if(jumped == true){
			for(let i = 0; i < moves.length; i++){
				for(let j = 0; j < moves[i].length; j++){
					if(moves[i][j] > 10){
						moves[i][j] -= 10;
					}else{
						moves[i][j] = 0;
					}
				}
			}
		}

		let moved = false;

		//if(dataSet.limit == false){
			for(let i = 0; i < xray.length; i++){// this finds if the move is possible then if it is it will move it.
				for(let j = 0; j < moves[i].length; j++){
					if(x == xray[i] && y == yray[i] && moves[i][j] == direct){
							moved = true;
							rules.move(dataSet,x,y,direct);
							rules.kingMe(dataSet);
					}
				}
			}
		if(moved == false){
			console.log("wrong spot it did not work");
			dataSet.doneMoving = false;
			//dataSet.whoTurn *= -1;
		}
		rules.playGame(dataSet);
	},
	gameDraw: function(dataSet){
		if(rules.possibleMoves(dataSet).length <= 0){
			return true;
		}
		return false;
	},

	playGame: function(dataSet){// this needs to be called by filterMove which will be called by one of the players
		dataSet.turn++;
		//dataSet.whoTurn *= -1;

		Board.draw(dataSet);

		if(rules.gameWon(dataSet.board) != 0 || rules.gameDraw(dataSet) == true){
			console.log("Game won, use rules.move, or just change the dataSet to change it");
			return "Game won, use rules.move, or just change the dataSet to change it";
		}
		

		if(dataSet.whoTurn == -1){
			// console.log("player1's turn");
			dataSet.player1.move(dataSet);
		}else if(dataSet.whoTurn == 1){
			// console.log("player2's turn");
			dataSet.player2.move(dataSet);
		}
	}
	
};