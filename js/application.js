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
                cells[i].classList.remove("text-danger");
                cells[i].classList.add("text-dark");
            }
        };

        this.setCellText = function (index, text) {
            cells[index].innerHTML = text;
        };

        this.cellsLength = function () {
            return cells.length;
        };

        this.cellFocus;

        this.indexCellFocus;
    }
})();

var gameController = {
    isGameOn: false,
    gameMode: 0,

    //bits map to link to players. Wich bit represents a board cell
    markedByPlayer1BitMap: 0,
    markedByPlayer2BitMap: 0,

    setBitMap: function (cellIndex) {
        if (this.isPlayer1Turn) {
            this.markedByPlayer1BitMap = this.markedByPlayer1BitMap |
                (Math.pow(2, cellIndex));
        } else {
            this.markedByPlayer2BitMap = this.markedByPlayer2BitMap |
                (Math.pow(2, cellIndex));
        }
    },

    clearBitMap: function () {
        this.markedByPlayer1BitMap = 0;
        this.markedByPlayer2BitMap = 0;
    },

    board: new HTMLBoard(),

    playersLength: 2,

    isPlayerInMovement: false,

    isPlayer1Turn: true,

    //possible numbers to win, considering a bit map of 9 bits
    winnerNumbers: [7, 56, 73, 84, 146, 273, 292, 448],

    indexWinnerNumbers: -1,

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
        this.indexWinnerNumbers = this.winnerNumbers.findIndex(
            function (winnerNumber) {

                return winnerNumber == (markedTurn & winnerNumber);
            }
        );

        if (this.indexWinnerNumbers != -1) {
            whoWin = 0 // active player won
        } else if (this.board.isFull()) {
            whoWin = 1; // game is tied
        } else {
            whoWin = 2; // game is still running
        }

        return callBackFunction(whoWin);
    },

    playerMove: function (player1MoveFunction, player2MoveFunction) {
        this.isPlayerInMovement === true;
        if (this.isPlayer1Turn) {
            player1MoveFunction();
            if (this.playersLength === 1 && this.isGameOn) {
                setTimeout(player2MoveFunction, 500);
            }
        } else if (this.playersLength === 2) {
            player2MoveFunction();
        }
        this.isPlayerInMovement === false;
    },

    paintWinnerCells: function () {
        var winnerNumber = this.winnerNumbers[this.indexWinnerNumbers];
        var cellIndex = 0;
        for (i = 0; i < this.board.cellsLength(); i++) {
            if (winnerNumber % 2 != 0) {
                this.board.getCell(i).classList.remove("text-dark");
                this.board.getCell(i).classList.add("text-danger");
            }
            winnerNumber = winnerNumber >>> 1;
            cellIndex++;
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
    gameController.board.cellFocus = elem;
    gameController.board.indexCellFocus = Number(elem.id);
    if (!gameController.isPlayerInMovement) {
        gameController.playerMove(playerComputerMoves[0], setPlayAgainst);
    }
}

function startGame() {
    gameController.isPlayer1Turn = true;
    gameController.clearBitMap();
    gameController.board.clearBoard();
    gameController.isGameOn = true;
    document.getElementById("startButton").disabled = true;
    document.getElementById("playerVersus").disabled = true;
    document.getElementById("gameModeSelect").disabled = true;
}

function endGame(whoWin) {
    switch (whoWin) {
        case 0: // active player won
            if (gameController.isPlayer1Turn) {
                //TODO;
            } else {
                //TODO;
            }
            gameController.paintWinnerCells();
            break;
        case 1: //game is tied 
            //TODO;
            break;
    }
    if (whoWin != 2) {
        gameController.isGameOn = false;
        document.getElementById("startButton").disabled = false;
        document.getElementById("playerVersus").disabled = false;
        if (gameController.playersLength === 1) {
            document.getElementById("gameModeSelect").disabled = false;
        }
    };
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
        var index = gameController.board.indexCellFocus;
        if (allowPlayer1Movement(index)) {
            makeAMove("X", index);
        }
    },

    function player2Move() {
        var index = gameController.board.indexCellFocus;
        if (allowPlayer2Movement(index)) {
            makeAMove("O", index);
        }
    },

    function computerEasyMove() {
        var index = getAnyEmptyIndex();
        makeAMove("O", index);
    },

    function computerMediumMove() {
        var index = getIndexToDefend();
        if (index == -1) {
            index = getAnyEmptyIndex();
        }
        makeAMove("O", index);
    },

    function computerHardMove() {
        //TODO
    }
]

function getAnyEmptyIndex() {
    var index = Math.floor(Math.random() * 9);
    while (!allowPlayer2Movement(index)) {
        index = Math.floor(Math.random() * 9);
    }
    return index;
}

function makeAMove(value, index) {
    gameController.setBitMap(index);
    gameController.board.getCell(index).innerHTML = value;
    gameController.checkWinner(endGame);
    gameController.changePlayerTurn();
}

function getIndexToDefend() {
    var index;
    var numCheck = 0;
    var arrayPlayer1 = getRepresentativeArrayPlayer(1);

    var emptyIndex;
    var indexesToDefender = [];

    // line analyse
    for (var i = 0; i < 9; (i += 3)) {
        if (arrayPlayer1[i] + arrayPlayer1[i + 1] + arrayPlayer1[i + 2] == 2) {
            for (j = i; j < (i + 3); j++) {
                if (arrayPlayer1[j] == 0) {
                    if (gameController.board.isCellEmpty(j)) {
                        indexesToDefender.push(j);
                    }
                    break;
                }
            }
        }
    }

    // column analyse
    for (var i = 0; i < 3; i++) {
        if (arrayPlayer1[i] + arrayPlayer1[i + 3] + arrayPlayer1[i + 6] == 2) {
            for (j = i; j < 9; j += 3) {
                if (arrayPlayer1[j] == 0) {
                    if (gameController.board.isCellEmpty(j)) {
                        indexesToDefender.push(j);
                    }
                    break;
                }
            }
        }
    }

    // diagonal analyse

    if (arrayPlayer1[0] + arrayPlayer1[4] + arrayPlayer1[8] == 2) {
        for (var i = 0; i < 9; i += 4) {
            if (arrayPlayer1[i] == 0) {
                if (gameController.board.isCellEmpty(i)) {
                    indexesToDefender.push(i);
                }
                break;
            }
        }
    }

    if (arrayPlayer1[2] + arrayPlayer1[4] + arrayPlayer1[6] == 2) {
        for (var i = 2; i < 8; i += 2) {
            if (arrayPlayer1[i] == 0) {
                if (gameController.board.isCellEmpty(i)) {
                    indexesToDefender.push(i);
                }
                break;
            }
        }
    }

    // return 
    if (indexesToDefender.length > 0) {
        return indexesToDefender[Math.floor(Math.random() * indexesToDefender.length)];
    } else {
        return -1;
    }
}

function getIndexToAttack() {
    //TODO
}

function getRepresentativeArrayPlayer(player) {
    var bitMapMarked;
    var indexes = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    if (player === 1) {
        bitMapMarked = gameController.markedByPlayer1BitMap;
    } else {
        bitMapMarked = gameController.markedByPlayer2BitMap;
    }

    for (i = 0; i < 9; i++) {
        if (bitMapMarked % 2 != 0) {
            indexes[i] = 1;
        }
        bitMapMarked = bitMapMarked >>> 1;
    }

    return indexes;
}

function allowPlayer1Movement(cellIndex) {
    return gameController.isGameOn && gameController.isPlayer1Turn
        && gameController.board.isCellEmpty(cellIndex);
}

function allowPlayer2Movement(cellIndex) {
    return gameController.isGameOn && !gameController.isPlayer1Turn
        && gameController.board.isCellEmpty(cellIndex);
}

function setPlayersLength(el) {
    var gameModeSelect = document.getElementById("gameModeSelect");
    if (el.value === "player") {
        gameController.playersLength = 2;
        gameModeSelect.disabled = true;
    } else {
        gameController.playersLength = 1;
        gameModeSelect.disabled = false;
    }
}

function setGameMode(el) {
    gameController.gameMode = Number(el.value);

}

function setPlayAgainst() {

    if (gameController.playersLength === 2) {
        playerComputerMoves[1]();
    } else {
        playerComputerMoves[gameController.gameMode + 2]();
    }
}
