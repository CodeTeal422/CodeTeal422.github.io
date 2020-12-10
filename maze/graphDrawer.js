let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

// maze size
let mazeHeight = 32;
let mazeWidth = 32;
let pixelSize = 8;

canvas.width = (mazeWidth * 2 + 1) * pixelSize;
canvas.height = (mazeHeight * 2 + 1) * pixelSize;

// building random values for the maze
let numRange = 100;
let array = [];
for(let i = 0; i < mazeHeight; i++){
    let temp = [];
    for(let j = 0; j < mazeWidth; j++){
        let randomNumber = Math.floor(Math.random() * numRange);
        temp.push(randomNumber);
    }
    array.push([...temp]);
}


function background(){
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function dots(){
    ctx.fillStyle = "#dedede";
    for(let i = 0; i < mazeWidth; i++){
        for(let j = 0; j < mazeHeight; j++){
            ctx.fillRect(pixelSize * (2 * i + 1), pixelSize * (2 * j + 1), pixelSize, pixelSize);
        }
    }
}
background();
dots();

function linesBetween(rayNums){
    ctx.fillStyle = "#dedede";
    let x = (rayNums[0] % mazeWidth + rayNums[1] % mazeWidth) / 2;
    let y = (Math.floor(rayNums[0] / mazeWidth) + Math.floor(rayNums[1] / mazeWidth)) / 2;
    ctx.fillRect((x * 2 + 1) * pixelSize, (y * 2 + 1) * pixelSize, pixelSize, pixelSize);
}

function weightFinder(ray){
    let output = array[Math.floor(ray[0] / mazeWidth)][ray[0] % mazeWidth] + array[Math.floor(ray[1] / mazeWidth)][ray[1] % mazeWidth];
    return output;
}



let alreadyVisited = [0];//this is the point that it has been to. it is also assuming that we start at the top left
let lines = [];//this is the lines that it has gone on
let canGoTo = [[0,1],[0,mazeWidth]];//this is from to, so from postion 0 to 1.
let totalPossibleLines = mazeWidth * mazeHeight - 1;
let totalTime = 5000;
let timeStep = totalTime / totalPossibleLines;

function checkTaken(number){
    for(let i = 0; i < alreadyVisited.length; i++){
        if(alreadyVisited[i] === number){
            return true;
        }
    }   
    return false;
}

let totalSolveDraw = 3;
function drawSolved(ray, i = 0){
    ctx.fillRect((ray[i][1] + 1) * pixelSize, (ray[i][0] + 1)  * pixelSize, pixelSize, pixelSize);
    i++;
    if(ray.length > i){
        setTimeout(function(){drawSolved(ray,i);},totalSolveDraw / ray.length);
    }
}

function possibleMove(map, pos, dir){
    if(dir === 0 && pos[0] >= 2 && map[pos[0] - 1][pos[1]] === 1){return true;}
    if(dir === 2 && pos[0] < map.length - 2 && map[pos[0] + 1][pos[1]] === 1){return true;}
    if(dir === 1 && pos[1] < map[0].length - 2 && map[pos[0]][pos[1] + 1] === 1){return true;}
    if(dir === 3 && pos[1] >= 2 && map[pos[0]][pos[1] - 1] === 1){return true;}
    return false;
}

function solve(){
    
    let map = [];
    for(let i = 0; i < mazeHeight * 2 - 1; i++){
        let temp = [];
        for(let j = 0; j < mazeWidth * 2 - 1; j++){
            if((i & 1) === 0 && (j & 1) === 0){
                temp.push(1);
            }else{
                temp.push(0);
            }
        }
        map.push(temp);
    }
    // console.log(map);
    for(let i = 0; i < lines.length; i++){
        let y = (Math.floor(lines[i][0] / mazeWidth) + Math.floor(lines[i][1] / mazeWidth));
        let x = lines[i][0] % mazeWidth + lines[i][1] % mazeWidth;
        map[y][x] = 1;
    }
    // console.log(map);
    // console.log(possibleMove(map,[0,0],0));
    // console.log(possibleMove(map,[0,0],1));
    // console.log(possibleMove(map,[0,0],2));
    // console.log(possibleMove(map,[0,0],3));
    let direction = 2;//0 up, 1 right, 2 down, 3 left
    let pastMoves = [[0,0]];//this will look like [y,x]
    let position = [0,0];
    while(position[0] !== map.length - 1 || position[1] !== map[0].length - 1){

        direction++;
        direction %= 4;
        while(possibleMove(map,position,direction) === false){
            direction += 3;
            direction %= 4;
        }
        //right then left, left, left
        let oldPos = [...position];
        if(direction === 0){position[0] -= 2;}
        else if(direction === 1){position[1] += 2;}
        else if(direction === 2){position[0] += 2;}
        else if(direction === 3){position[1] -= 2;}
        // console.log(position);

        if(pastMoves.length > 3 && position[0] === pastMoves[pastMoves.length - 3][0] && position[1] === pastMoves[pastMoves.length - 3][1]){
            pastMoves.pop();
            pastMoves.pop();
        }else{
            pastMoves.push([(position[0] + oldPos[0]) / 2, (position[1] + oldPos[1]) / 2]);
            pastMoves.push([...position])
        }
        // console.log(position[0] !== map.length - 1 , position[1] !== map[0].length - 1);
    }
    // console.log(pastMoves);
    ctx.fillStyle = "#660066";
    drawSolved(pastMoves);
}

function prim(){
    //find shortest length
    let min = weightFinder(canGoTo[0]);
    let minRayPos = 0;
    for(let i = 1; i < canGoTo.length; i++){
        let temp = weightFinder(canGoTo[i]);
        if(temp < min){
            min = temp;
            minRayPos = i;
        }
    }
    
    //build it
    linesBetween(canGoTo[minRayPos]);

    //remove and add to list
    alreadyVisited.push(canGoTo[minRayPos][1]);
    lines.push(canGoTo[minRayPos]);
    canGoTo.splice(minRayPos,1);
    for(let i = 0; i < canGoTo.length; i++){
        if(canGoTo[i][1] === alreadyVisited[alreadyVisited.length - 1]){
            canGoTo.splice(i,1);
            i--;
        }
    }
    //check what is possible now, this is the add from above
    let justPlaced = alreadyVisited[alreadyVisited.length - 1];
    let up = justPlaced - mazeWidth;
    if(up >= 0 && checkTaken(up) === false){canGoTo.push([justPlaced,up]);}
    let down = justPlaced + mazeWidth;
    if(down < mazeHeight * mazeWidth && checkTaken(down) === false){canGoTo.push([justPlaced,down]);}
    if(justPlaced % mazeWidth !== 0 && checkTaken(justPlaced - 1) === false){canGoTo.push([justPlaced,justPlaced - 1]);}//left
    if((justPlaced + 1) % mazeWidth !== 0 && checkTaken(justPlaced + 1) === false){canGoTo.push([justPlaced,justPlaced + 1]);}//right



    //recall the function till the board is filled
    if(lines.length < totalPossibleLines){
        setTimeout(function(){prim();}, timeStep);
    }else{
        console.log("done");
        solve();
    }
}

let limitMain = false;
function main(){
    if(limitMain === false){
        prim();
        limitMain = true;
    }
}