randomBot = {
    delay: function(dataSet){
        let possible = rules.possibleMoves(dataSet);
        let radNum = Math.floor(Math.random()*possible.length);
        rules.move(dataSet, possible[radNum][0],possible[radNum][1])
    },
    move: function(dataSet){
        setTimeout(function(){
			randomBot.delay(dataSet);
		},500);
    }
}