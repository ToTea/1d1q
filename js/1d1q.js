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
	$("#blockPanel").show()
	$("#clear").hide()
	$("td").css("background-color", blockColor.no);
	$("td").css("border-color", "rgb(128, 128, 128)");
});
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
		$(block[i]).css("background-color", currentBoard[i])
	}
}

function isGameover(){
	for (var i = 0; i < targetPosition.length; i++) {
		if(!isColor(currentBoard[targetPosition[i]], blockColor.box)){
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
		if(isGameover()){
			$("#clear").show()
		}
	}
	refreshScreen()

})

function setColor(idx, color){
	currentBoard[idx] = color;
}
function isColor(color1, color2){
	return color1 == color2;
}

function boxMove(board, direction){
	if(direction == "left"){
		for (var y = 0; y < 8; y++) {
			for (var x = 1; x < 8; x++){
				if(isColor(board[8*y + x], blockColor.box)){
					if(isColor(board[8*y + x-1], blockColor.no) || isColor(board[8*y + x-1], blockColor.target)){
						setColor(8*y + x, blockColor.no);
						setColor((x-1)+8*y, blockColor.box);
					}
				}
			}
		}
	} else if(direction == "up"){
		for (var x = 0; x < 8; x++) {
			for (var y = 1; y < 8; y++){
				if(isColor(board[8*y + x], blockColor.box)){
					if(isColor(board[8*(y-1) + x], blockColor.no) || isColor(board[8*(y-1) + x], blockColor.target)){
						setColor(8*y + x, blockColor.no);
						setColor(x+8*(y-1), blockColor.box);
					}
				}
			}
		}
	}
	else if(direction == "right"){
		for (var y = 0; y < 8; y++) {
			for (var x = 6; x >= 0; x--){
				if(isColor(board[8*y + x], blockColor.box)){
					if(isColor(board[8*y + x+1], blockColor.no) || isColor(board[8*y + x+1], blockColor.target)){
						setColor(8*y + x, blockColor.no);
						setColor((x+1)+8*y, blockColor.box);
					}
				}
			}
		}	
	}
	else if(direction == "down"){
		for (var x = 0; x < 8; x++) {
			for (var y = 6; y >= 0; y--){
				if(isColor(board[8*y + x], blockColor.box)){
					if(isColor(board[8*(y+1) + x], blockColor.no) || isColor(board[8*(y+1) + x], blockColor.target)){
						setColor(8*y + x, blockColor.no);
						setColor(x+8*(y+1), blockColor.box);			
					}
				}
			}
		}	
	}
}

// var actions = ["left", "up", "right", "down"]
// function iterDFS(deep, board){
// 	var oldBoard = board.slice();
// 	for(var i = 0; i < actions.length; i++){
// 		boxMove()
// 	}

// }