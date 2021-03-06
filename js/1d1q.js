$("#clear").hide()
var blockColor = {
	no: "rgb(200, 200, 200)",
	wall: "rgb(0, 0, 0)",
	box: "rgb(255, 255, 255)",
	target: "rgb(200, 200, 0)"
}
var block = $("td")
var originBoard = []
var currentBoard = []
var targetPosition = []
var colorPanel = blockColor.no;

$("#no").click(function(){
	colorPanel = blockColor.no;
})
$("#box").click(function(){
	colorPanel = blockColor.box;
})
$("#wall").click(function(){
	colorPanel = blockColor.wall;
})
$("#target").click(function(){
	colorPanel = blockColor.target;
})

$("td").click(function() {
    var color = colorPanel;
    // gray, white, black, yellow
    if (color == blockColor.no){
    	$(this).css("background-color", blockColor.no);
    } else if (color == blockColor.box){
    	$(this).css("background-color", blockColor.box);
    } else if (color == blockColor.wall){
    	$(this).css("background-color", blockColor.wall);
    } else if (color == blockColor.target){
    	if($(this).css("border-color") == blockColor.target){
    		$(this).css("border-color", "rgb(128, 128, 128)");
    	} else{
    		$(this).css("border-color", blockColor.target);
    	}
    }
});

$("#new").click(function(){
	$("#step").text(0);
	$("#bestMove").text("");
	$("#blockPanel").show()
	$("#clear").hide()
	$("td").css("background-color", blockColor.no);
	$("td").css("border-color", "rgb(128, 128, 128)");
});
$("#random").click(function(){
	var p = JSON.parse(problems.randomElement());
	originBoard = p[0].slice();
	currentBoard = p[0].slice();
	targetPosition = p[1].slice();

	refreshScreen()
})
$("#start").click(function(){
	originBoard = []
	targetPosition = []
	currentBoard = []
	$("#step").text(0);
	$("#blockPanel").hide();
	$("#clear").hide()
	for (var i = 0; i < block.length; i++) {
		var color = $(block[i]).css("background-color")
		originBoard.push(color)
		currentBoard.push(color)
		if($(block[i]).css("border-color") == blockColor.target){
			targetPosition.push(i)
		}
	}
});
$("#save").click(function(){
	var code = JSON.stringify([originBoard, targetPosition]);
	$("#boardCode").val(code);
});
$("#reset").click(function(){
	currentBoard = []
	$("#step").text(0);
	$("#clear").hide()
	for (var i = 0; i < originBoard.length; i++) {
		currentBoard.push(originBoard[i])
	}
	refreshScreen()
});

function refreshScreen(){
	for (var i = 0; i < currentBoard.length; i++) {
		$(block[i]).css("background-color", currentBoard[i]);
		$(block[i]).css("border-color", "rgb(128, 128, 128)");
	}
	for (var i = 0; i < targetPosition.length; i++) {
		$(block[targetPosition[i]]).css("border-color", blockColor.target)
	}
}

function isGameover(board){
	for (var i = 0; i < targetPosition.length; i++) {
		if(!isColor(board[targetPosition[i]], blockColor.box)){
			return false;
		}
	}
	return true
}

$("body").keydown(function(e){
	// 37-40 left up right down
	var key = e.keyCode;
	
	if(key == 37){
		boxMove(currentBoard, "left");		
	} else if (key == 38){
		boxMove(currentBoard, "up");
	} else if (key == 39){
		boxMove(currentBoard, "right");
	} else if (key == 40){
		boxMove(currentBoard, "down");
	}
	if(key == 37 || key == 38 || key == 39 || key == 40){
		$("#step").text($("#step").text()/1+1);
		if(isGameover(currentBoard)){
			$("#clear").show()
		}
	}
	refreshScreen()

})

function setColor(board, idx, color){
	board[idx] = color;
}
function isColor(color1, color2){
	return color1 == color2;
}

function boxMove(board, direction, oldHash){
	newHash = oldHash
	if(direction == "left"){
		for (var y = 0; y < 8; y++) {
			for (var x = 1; x < 8; x++){
				if(isColor(board[8*y + x], blockColor.box)){
					if(isColor(board[8*y + x-1], blockColor.no)){
						setColor(board, 8*y + x, blockColor.no);
						setColor(board, (x-1)+8*y, blockColor.box);
						// newHash = newHash ^ blockHash[8*y + x] ^ blockHash[(x-1)+8*y]
					}
				}
			}
		}
	} else if(direction == "up"){
		for (var x = 0; x < 8; x++) {
			for (var y = 1; y < 8; y++){
				if(isColor(board[8*y + x], blockColor.box)){
					if(isColor(board[8*(y-1) + x], blockColor.no)){
						setColor(board, 8*y + x, blockColor.no);
						setColor(board, x+8*(y-1), blockColor.box);
						// newHash = newHash ^ blockHash[8*y + x] ^ blockHash[x+8*(y-1)]
					}
				}
			}
		}
	}
	else if(direction == "right"){
		for (var y = 0; y < 8; y++) {
			for (var x = 6; x >= 0; x--){
				if(isColor(board[8*y + x], blockColor.box)){
					if(isColor(board[8*y + x+1], blockColor.no)){
						setColor(board, 8*y + x, blockColor.no);
						setColor(board, (x+1)+8*y, blockColor.box);
						// newHash = newHash ^ blockHash[8*y + x] ^ blockHash[(x+1)+8*y]
					}
				}
			}
		}	
	}
	else if(direction == "down"){
		for (var x = 0; x < 8; x++) {
			for (var y = 6; y >= 0; y--){
				if(isColor(board[8*y + x], blockColor.box)){
					if(isColor(board[8*(y+1) + x], blockColor.no)){
						setColor(board, 8*y + x, blockColor.no);
						setColor(board, x+8*(y+1), blockColor.box);
						// newHash = newHash ^ blockHash[8*y + x] ^ blockHash[x+8*(y+1)]
					}
				}
			}
		}	
	}
	return newHash
}

var actions = ["left", "up", "right", "down"]
function iterDFS(deep, board, actionLog, boardHash){
	if(hashInTable(boardHash, deep)){
		return false;
	}
	if(isGameover(board)) return true;
	if(deep <= 0) return false;

	updateHashTable(boardHash, deep);
	for(var i = 0; i < actions.length; i++){
		var newBoard = board.slice();
		var newActionLog = actionLog.slice();
		boxMove(newBoard, actions[i]);
		newBoardHash = calculateHash(newBoard)
		newActionLog.push(actions[i]);
		if(iterDFS(deep-1, newBoard, newActionLog, newBoardHash)){
			for(var j = 0; j < newActionLog.length; j++){
				actionLog[j] = newActionLog[j];
			}
			return true;
		}
	}
	return false;
}
function dfsThreshold(threshold, board, step, actionLog, boardHash, minCut){
	if(hashInTable(boardHash, threshold-step)){
		return false;
	}
	if(isGameover(board)) return true;
	var cost = step + chooseEval(board);
	if(cost > threshold){
		if(cost < minCut[0]) minCut[0] = cost;
		return false;
	}

	updateHashTable(boardHash, threshold-step);
	for(var i = 0; i < actions.length; i++){
		var newBoard = board.slice();
		var newActionLog = actionLog.slice();
		newBoardHash = boxMove(newBoard, actions[i]);
		newBoardHash = calculateHash(newBoard)
		newActionLog.push(actions[i]);
		if(dfsThreshold(threshold, newBoard, step+1, newActionLog, newBoardHash, minCut)){
			for(var j = 0; j < newActionLog.length; j++){
				actionLog[j] = newActionLog[j];
			}
			return true;
		}
	}
	return false;
}
function evaluation(board){
	var maxMinD = 0
	for (var i = 0; i < board.length; i++) {
		if(isColor(board[i], blockColor.box)){
			boxX = i % 8;
			boxY = Math.floor(i / 8);
			var minD = 999
			for (var j = 0; j < targetPosition.length; j++) {
				targetX = targetPosition[j] % 8;
				targetY = Math.floor(targetPosition[j] / 8);
				distance = Math.abs(targetX - boxX) + Math.abs(targetY - boxY);
				if(distance < minD){
					minD = distance
				}
			}
			if(minD > maxMinD){
				maxMinD = minD
			}
		}
	}
	return maxMinD;
}
function evaluation2(board){
	var maxMinLeft = 0;
	var maxMinUp = 0;
	var maxMinRight = 0;
	var maxMinDown = 0;
	for (var i = 0; i < board.length; i++) {
		if(isColor(board[i], blockColor.box)){
			boxX = i % 8;
			boxY = Math.floor(i / 8);
			var minLeft = 999;
			var minUp = 999;
			var minRight = 999;
			var minDown = 999;
			for (var j = 0; j < targetPosition.length; j++) {
				targetX = targetPosition[j] % 8;
				targetY = Math.floor(targetPosition[j] / 8);
				distanceX = targetX - boxX;
				distanceY = targetY - boxY;
				disLeft = Math.max(0, -distanceX)
				disUp = Math.max(0, -distanceY)
				disRight = Math.max(0, distanceX)
				disDown = Math.max(0, distanceY)
				if(minLeft > disLeft){
					minLeft = disLeft;
				}
				if(minUp > disUp){
					minUp = disUp;
				}
				if(minRight > disRight){
					minRight = disRight;
				}
				if(minDown > disDown){
					minDown = disDown;
				}
			}
			if(maxMinLeft < minLeft){
				maxMinLeft = minLeft;
			}
			if(maxMinUp < minUp){
				maxMinUp = minUp;
			}
			if(maxMinRight < minRight){
				maxMinRight = minRight;
			}
			if(maxMinDown < minDown){
				maxMinDown = minDown;
			}
		}
	}

	var maxMinD = 0;
	for (var i = 0; i < board.length; i++) {
		if(isColor(board[i], blockColor.box)){
			boxX = i % 8;
			boxY = Math.floor(i / 8);
			var minD = 999
			for (var j = 0; j < targetPosition.length; j++) {
				targetX = targetPosition[j] % 8;
				targetY = Math.floor(targetPosition[j] / 8);
				distanceX = targetX - boxX;
				distanceY = targetY - boxY;
				disLeft = Math.max(0, -distanceX - maxMinLeft);
				disUp = Math.max(0, -distanceY - maxMinUp);
				disRight = Math.max(0, distanceX - maxMinRight);
				disDown = Math.max(0, distanceY - maxMinDown);
				distance = disLeft + disUp + disRight + disDown;
				if(distance < minD){
					minD = distance
				}
			}
			if(minD > maxMinD){
				maxMinD = minD
			}
		}
	}
	return maxMinD + maxMinLeft + maxMinUp + maxMinRight + maxMinDown;
}

function oneBoxAstar(boxX, boxY){
	var queue = new FastPriorityQueue(function (a, b) {
        return a.c+a.h < b.c+b.h;
    });
	var newB = {
		x: boxX,
		y: boxY,
		c: 0,
		h: oneBoxEvaulation(boxX, boxY)
	}
	queue.add(newB);
	while(!queue.isEmpty()){
		var curB = queue.poll()

		if(curB.h == 0)	return curB.c;

		x = curB.x;
		y = curB.y;

		if(x<7 && !(isColor(originBoard[8*y + x+1], blockColor.wall))){
			newB = {
				x: x+1,
				y: y,
				c: curB.c+1,
				h: oneBoxEvaulation(x+1, y)
			}
			queue.add(newB);
		}
		if(x>0 && !(isColor(originBoard[8*y + x-1], blockColor.wall))){
			newB = {
				x: x-1,
				y: y,
				c: curB.c+1,
				h: oneBoxEvaulation(x-1, y)
			}
			queue.add(newB);
		}
		if(y<7 && !(isColor(originBoard[8*(y+1) + x], blockColor.wall))){
			newB = {
				x: x,
				y: y+1,
				c: curB.c+1,
				h: oneBoxEvaulation(x, y+1)
			}
			queue.add(newB);
		}
		if(y>0 && !(isColor(originBoard[8*(y-1) + x], blockColor.wall))){
			newB = {
				x: x,
				y: y-1,
				c: curB.c+1,
				h: oneBoxEvaulation(x, y-1)
			}
			queue.add(newB);
		}
	}
	return 999; //something wrong

}
function oneBoxEvaulation(boxX, boxY){
	var minD = 999;
	for (var j = 0; j < targetPosition.length; j++) {
		targetX = targetPosition[j] % 8;
		targetY = Math.floor(targetPosition[j] / 8);
		distance = Math.abs(targetX - boxX) + Math.abs(targetY - boxY);
		if(distance < minD){
			minD = distance
		}
	}
	return minD;
}
function evaluation3(board){
	var maxh = 0
	for (var i = 0; i < board.length; i++) {
		if(isColor(board[i], blockColor.box)){
			boxX = i % 8;
			boxY = Math.floor(i / 8);
			h = oneBoxAstar(boxX, boxY);
			if(h > maxh){
				maxh = h;
			}
		}
	}
	return maxh;
}
chooseEval = evaluation2;

$("#solute").click(function(){
	var t0 = performance.now();
	// dfidSolution()
	idaSolution()
	var t1 = performance.now();
	console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")
})

function dfidSolution(){
	var boardHash = calculateHash(currentBoard);
	for(var i = 1; i < 20; i++){
		var actionLog = [];
		console.log("Deep: " + i)
		var result = iterDFS(i, currentBoard, actionLog, boardHash);
		if(result){
			console.log("Solution found.");
			console.log(actionLog);
			break;
		}
	}
}

function idaSolution(){
	var boardHash = calculateHash(currentBoard);
	var threshold = 1;
	while(true){
		var actionLog = [];
		var minCut = [99999];
		console.log("Threshold: " + threshold);
		var result = dfsThreshold(threshold, currentBoard, 0, actionLog, boardHash, minCut);
		threshold = minCut[0];
		if(result){
			console.log("Solution found.");
			console.log(actionLog);
			break;
		}
	}
	$("#bestMove").text("Best move: " + actionLog);
}

function calculateHash(board){
	var hash = 0;
	for (var i = 0; i < board.length; i++) {
		if(isColor(board[i], blockColor.box)){
			hash = hash ^ blockHash[i];
		}
	}
	return hash
}

function hashInTable(hash, deep){
	var index = hashToIndex(hash)
	if(visitedHash[index] == undefined) return false;
	if(visitedHash[index].deep >= deep && visitedHash[index].key == (hash&keyMask))return true;
	return false;	
}

function updateHashTable(hash, deep){
	var index = hashToIndex(hash)
	var record = {
		key: hash & keyMask,
		deep: deep
	}
	visitedHash[index] = record;
}

function hashToIndex(hash){
	return hash >> (48-25)
}
keyMask = 33554432-1;
var visitedHash = []; //2^25
var blockHash = [];
for(var i = 0; i < 64; i++){
	blockHash.push(Math.floor(Math.random()*Math.pow(2, 48)));
}