var randomBot = {
	move: function(dataSet){
			setTimeout(function(){
				randomBot.delay(dataSet);
			},500);
		},
	delay: function(dataSet){
		let possible = rules.possibleMoves(dataSet);
		let radNum = Math.floor(Math.random()*possible.length);
		rules.filterMove(dataSet,possible[radNum][0],possible[radNum][1],possible[radNum][2][Math.floor(Math.random()*possible[radNum][2].length)]);
	}
};