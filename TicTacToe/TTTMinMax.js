searchDepth = [0,0,0,0,0,0,0,0,0,0,0,0];

var minMax = {
    whichSide: -1,
    solve: function(dataSet, whichMove, currentIteration = 0){
        currentIteration++;
        searchDepth[currentIteration]++;

        /*
        get and update a new board.
        */
        let newDataSet = {
            board: [],
            whichSide: dataSet.whichSide * -1,
        };
        for(let i = 0; i < 3; i++){
            newDataSet.board.push([...dataSet.board[i]]);
        }
        newDataSet.board[whichMove[1]][whichMove[0]] = dataSet.whichSide;

        /*
        if a move can be made then search 
        */
        let tempPossibleMove = rules.possibleMoves(newDataSet);
        if(tempPossibleMove.length > 0){
            let outputs = [];
            for(let i = 0; i < tempPossibleMove.length; i++){
                outputs.push(minMax.solve(newDataSet, tempPossibleMove[i], currentIteration));
            }

            let reNum;
            if(newDataSet.whichSide * minMax.whichSide === 1){
                //max
                reNum = -Infinity;
                for(let i = 0; i < outputs.length; i++){
                    reNum = reNum > outputs[i]? reNum: outputs[i];
                }
            }else{
                //min
                reNum = Infinity;
                for(let i = 0; i < outputs.length; i++){
                    reNum = reNum < outputs[i]? reNum: outputs[i];
                }
            }
            return reNum;
        }else{
            let temp = minMax.whichSide * rules.gameWon(newDataSet) + Math.random()*0.2 - 0.1;;//
            // console.log(temp)
            // console.log(newDataSet);
            //if(currentIteration == 1){temp *= 100; console.log(newDataSet.board);}//else{temp += Math.random()*0.2 - 0.1;}
            return temp;
        }
    },
    masterPlan: function(dataSet){
        let options = [];
        let tempPossible = rules.possibleMoves(dataSet);
        for(let i = 0; i < tempPossible.length; i++){
            options.push(minMax.solve(dataSet,tempPossible[i]));
        }
        let max = -10;
        let maxPos = 0;
        for(let i = 0; i < options.length; i++){
            if(options[i] > max){
                max = options[i];
                maxPos = i;
            }
        }
        rules.move(dataSet,tempPossible[maxPos][0],tempPossible[maxPos][1]);        
    },
    move: function(dataSet){
        minMax.whichSide = dataSet.whichSide;
        setTimeout(function(){minMax.masterPlan(dataSet);},200);
    },
}