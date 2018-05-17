var HTMLBoard = (function () {
    var cells = document.getElementsByClassName("cell");

    return function () {
        this.isCellEmpty = function (index) {
            if (cells[index].innerHTML === ""
                || cells[index].innerHTML === undefined) {
                return true;
            } else {
                return false;
            }
        };

        this.isFull = function () {
            for (var i = 0; i < cells.length; i++) {
                if (this.isCellEmpty(i)) {
                    return false;
                }
            }
            return true;
        };

        this.getCell = function (index) {
            return cells[index];
        };

        this.clearBoard = function () {
            for (var i = 0; i < cells.length; i++) {
                cells[i].innerHTML = "";
                cells[i].style.color = "black";
            }
        };

        this.setCellText = function (index, text) {
            cells[index].innerHTML = text;
        };

        this.cellsLength = function(){
            return cells.length;
        };

        this.clickedCell;

        this.lastClickedCellIndex;
    }
})();

var gameController = {
    isGameOn: false,
    gameMode: 0,

    //bits map to link to players. Wich bit represents a board cell
    markedByPlayer1BitMap: 0,
    markedByPlayer2BitMap: 0,

    setBitMap: function () {
        var markedPlayerTurn;
        if (this.isPlayer1Turn) {
            this.markedByPlayer1BitMap = this.markedByPlayer1BitMap |
                (Math.pow(2,this.board.lastClickedCellIndex));
        } else {
            this.markedByPlayer2BitMap = this.markedByPlayer2BitMap |
                (Math.pow(2,this.board.lastClickedCellIndex));
        }
    },

    clearBitMap: function(){
        this.markedByPlayer1BitMap = 0;
        this.markedByPlayer2BitMap = 0;
    },

    board: new HTMLBoard(),

    playVersus: 0,

    isPlayer1Turn: true,

    //possible numbers to win, considering a bit map of 9 bits
    winnerNumbers: [7, 56, 73, 84, 146, 273, 292, 448],

    changePlayerTurn: function () {
        this.isPlayer1Turn = !this.isPlayer1Turn;
    },
    
    checkWinner: function (callBackFunction) {
        var markedTurn;
        var whoWin;
        
        // store the bit map referent to current player
        if (this.isPlayer1Turn) {
            markedTurn = this.markedByPlayer1BitMap;
        } else {
            markedTurn = this.markedByPlayer2BitMap;
        }

        // check if any possible winner number is in the bit map player
        var index = this.winnerNumbers.findIndex(
            function (winnerNumber) {
                
                return winnerNumber == (markedTurn & winnerNumber);
            }
        );

        if (index != -1) {
            whoWin = 0 // active player won
        } else if (this.board.isFull()) {            
            whoWin = 1; // game is tied
        } else {
            whoWin = 2; // game is still running
        }

        return callBackFunction(whoWin);
    },
    playerMove: function (player1MoveFunction, player2MoveFunction) {
        if (this.isPlayer1Turn) {
            player1MoveFunction();
        } else {
            player2MoveFunction();
        }
    }
}

function initialSettings() {
    gameController.board.clearBoard();
    for (var i = 0; i < gameController.board.cellsLength(); i++) {
        gameController.board.getCell(i).addEventListener("click", function () {
            cellClick(this);
        });
    }
    return true;
}

function cellClick(elem) {
    gameController.board.clickedCell = elem;
    gameController.board.lastClickedCellIndex = Number(elem.id);
    gameController.playerMove(player1Move, player2OrComputerMove);
}

function startGame() {
    gameController.clearBitMap();
    gameController.board.clearBoard();
    gameController.isGameOn = true;
    
}

function endGame(whoWin) {
    switch(whoWin) {
        case 0: // active player won
            if(gameController.isPlayer1Turn) {
                alert("Player 1 won!!!");
            } else {
                alert("Player 2 won!!!");
            }
            break;
        case 1: //game is tied 
            alert("The game is tied!");
            break;
    }
    if(whoWin != 2){gameController.isGameOn = false;};
}

function changeMode(mode) {
    gameController.gameMode = getGameModeNumber(mode);
}

function getGameModeNumber(gameMode) {
    switch (gameMode) {
        case "Easy":
            return 0;
        case "Medium":
            return 1;
        case "Hard":
            return 2;
    }
}

playerComputerMoves = [
    function player1Move() {
        if (gameController.isGameOn && gameController.isPlayer1Turn
            && gameController.board.isCellEmpty(gameController.board.lastClickedCellIndex)) {
            gameController.setBitMap();
            gameController.board.clickedCell.innerHTML = "X";
            gameController.checkWinner(endGame);
            gameController.changePlayerTurn();
        }
    },

    function player2Move() {
        if (gameController.isGameOn && !gameController.isPlayer1Turn
            && gameController.board.isCellEmpty(gameController.board.lastClickedCellIndex)) {
            gameController.setBitMap();
            gameController.board.clickedCell.innerHTML = "O";
            gameController.checkWinner(endGame);
            gameController.changePlayerTurn();
        }
    },

    function computerEasyMove() {
        //TODO
    },

    function computerMediumMove() {
        //TODO
    },

    function computerHardMove(){
        //TODO
    }
]

var player2OrComputerMove = player2Move;
