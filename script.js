var origBoard;
const playerOne = 'X';
const playerTwo = '0';
var playerOneTurn = true;
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
startGame();

function startGame () {
	document.querySelector(".endgame").style.display = "none";
	document.querySelector(".whosTurn .playerText").innerText = "";
	origBoard = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') {
		if (!checkTie() && playerOneTurn) {
			turn(square.target.id, playerOne);
			showWhichPlayerMoves(playerTwo);
			playerOneTurn = false;
		} else {
			turn(square.target.id, playerTwo);
			showWhichPlayerMoves(playerOne);
			playerOneTurn = true;
		}		
	}
}

function turn(squareId, player) {
	origBoard[squareId] = player;
	console.log(player);
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player);
	if(gameWon) gameOver(gameWon)
}

function showWhichPlayerMoves(player) {
	document.querySelector(".whosTurn .playerText").innerText = player + " make a move!";
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) => 
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == playerOne ? "blue" : "red";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == playerOne ? "Player One Wins!" : "Player Two Wins!");
}

function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}

function checkTie() {
	if (emptySquares().length === 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!");
		return true;
	}
	return false;
}
