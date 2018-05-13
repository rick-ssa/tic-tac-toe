function addCellsEventListener(){
    var cellsHTML = document.getElementsByClassName("cell");
    for (var i = 0; i < cellsHTML.length; i++) {
        cellsHTML[i].addEventListener("click",function(){
            mark(Number(this.id));            
        });
        cellsHTML[i].addEventListener("click",function(){
            playTurn(true);
        });
        cellsHTML[i].addEventListener("click",refreshHtmlBoard);
    }
}

var cellsBoard = (function () {
    var localCellsBoard;
    localCellsBoard = new Cells();
    for (var i = 0; i < 9; i++) {
        localCellsBoard.addNewCell("");
    }
    return localCellsBoard;
})();

var playTurn = (function(){
    var playturn = "X";

    return function(change){
        if (change) {
            if (playturn == "X" ){
                playturn = "O";
            } else {
                playturn = "X";
            }
            
            
        }
        return playturn;
    };
})();

function mark(cellIndex) {
    var XorO = playTurn();    
    cellsBoard.getCell(cellIndex).content = XorO;
}

function refreshHtmlBoard() {
    var htmlCells = document.getElementsByClassName("cell");
    for (var i = 0; i < cellsBoard.count(); i++) {
        
        if( htmlCells[i].innerHTML != cellsBoard.getCell(i).content ) {
            htmlCells[i].innerHTML = cellsBoard.getCell(i).content;
        }
    }
}