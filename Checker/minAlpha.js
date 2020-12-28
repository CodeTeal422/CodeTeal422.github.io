var minAlpha = {
    set2dRay: function(array){
        let output = [];
        for(let i = 0; i < array.length; i++){
            output.push([...array[i]]);
        }
        return output;
    },
    movesAhead: 10,
    whichSide: -1,
    skips: [0,0,0,0,0,0,0,0,0,0,0,0],
    findNumbers: function(board){
        let kingRed = 0;
        let kingBlack = 0;
        let red = 0;
        let black = 0;
        for(let i = 0; i < board.length; i++){
            for(let j = 0; j < board[i].length; j++){
                switch(board[i][j]){
                    case 2:
                        kingRed++;
                        break;
                    case -2:
                        kingBlack++;
                        break;
                    case 1:
                        red++;
                        break;
                    case -1:
                        black++;
                        break;
                    default:
                        break;
                }
            }
        }
        return [red,black,kingRed,kingBlack];
    },
    score: function(dataSet){
        //basic scoring here
        let board = dataSet.board;
        let input = minAlpha.findNumbers(board);
        let kingWorth = 1.5;
        let currentScore;
        
        if(this.whichSide == 1){
            currentScore = (input[2] * kingWorth + input[0]) - (input[3] * kingWorth + input[1]);
        }else {
            currentScore = (input[3] * kingWorth + input[1]) -  (input[2] * kingWorth + input[0]);
        }
        if(rules.gameWon(board) * minAlpha.whichSide == 1){
            currentScore = 100;
        }else if(rules.gameWon(board) * minAlpha.whichSide == -1){
            currentScore = -100;
        }else if(rules.gameDraw(dataSet) == true){
            currentScore = -100;
        }
        return currentScore;
    },
    solve: function(dataSet, dataChangeNum = 0, numDir = 0, currentIteration = 0, alpha = -101, beta = 101){
        currentIteration++;

        if(currentIteration === 1){
            minAlpha.whichSide = dataSet.whoTurn;//make sure that it is going for the right side
            let temp = rules.possibleMoves(dataSet);
            if(temp.length === 1 && temp[0][2].length === 1){
                return [temp[0][0], temp[0][1], temp[0][2][0]];
            }
        }

        let newDataSet = {
            board: minAlpha.set2dRay(dataSet.board),
            limit: dataSet.limit,
            limitX: dataSet.limitX,
            limitY: dataSet.limitY,
            limitDir: [...dataSet.limitDir],
            whoTurn: dataSet.whoTurn,
            fromX: dataSet.fromX,
		    fromY: dataSet.fromY,
		    doneMoving: dataSet.doneMoving,
        };

        if(currentIteration > 1){
        let input = rules.possibleMoves(newDataSet);
        let x  = input[dataChangeNum][0];
        let y = input[dataChangeNum][1];
        let dir = input[dataChangeNum][2][numDir];
        rules.move(newDataSet,x,y,dir);
        }
        

        let output = [];
        let posMoves = rules.possibleMoves(newDataSet);
        let stop = false;
        if(currentIteration <= minAlpha.movesAhead && posMoves.length > 0){
            for(let i = 0; i < posMoves.length; i++){
                for(let j = 0; j < posMoves[i][2].length; j++){
                    let temp = minAlpha.solve(newDataSet, i, j, currentIteration, alpha, beta);
                    output.push(temp);
                    if(newDataSet.whoTurn * minAlpha.whichSide !== 1){//change
                        //min
                        beta = beta < temp? beta: temp;
                        if(beta <= alpha){stop = true; break;}
                    }else{
                        //max
                        alpha = alpha > temp? alpha: temp;
                        if(beta <= alpha){stop = true; break;}
                    }
                }
                if(stop == true){
                    minAlpha.skips[currentIteration]++;
                    break;
                }
            }
        }else {
            return minAlpha.score(newDataSet);
        }

        if(currentIteration == 1){
            let maxNum = output[0];
            let maxPos = 0;
            let count = 0;
            let maxXY;
            let maxDir;



            for(let i = 0; i < output.length; i++){
                //this adds a bit of randomNess is it needed
                if(output[i] > maxNum){
                    maxNum = output[i];
                    maxPos = i;
                }
            }
            for(let i = 0; i < posMoves.length; i++){
                for(let j = 0; j < posMoves[i][2].length; j++){
                    if(count == maxPos){
                        maxXY = i;
                        maxDir = j;
                    }
                    count++;
                }
            }
            output = [posMoves[maxXY][0],posMoves[maxXY][1],posMoves[maxXY][2][maxDir]];
            return output;

            
        }else{
            let outoutput = output[0];
            if(newDataSet.whoTurn * minAlpha.whichSide !== 1){//change
                //min
                
                for(let i = 0; i < output.length; i++){
                    if(output[i] < outoutput){
                        outoutput = output[i];
                    }
                }
            }else{
                //max
                for(let i = 0; i < output.length; i++){
                    if(output[i] > outoutput){
                        outoutput = output[i];
                    }
                }
                
            }
            output = outoutput;
        }
        return output;

        //build board

        //see if you should do it again

        //score
    },
    masterPlan: function(dataSet){
        let plan = this.solve(dataSet);
        rules.filterMove(dataSet,plan[0],plan[1],plan[2]);
    },
    move: function(dataSet){
        setTimeout(function(){minAlpha.masterPlan(dataSet);},100);
    }
};