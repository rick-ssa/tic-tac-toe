function Cell(content) {
    this.content = content;
}

function Cells() {
    let Cells = [];

    this.add = function (Cell) {
        Cells.push(Cell);
    };

    this.addNewCell = function (content) {
        let obj = new Cell(content);
        Cells.push(obj);
        return obj;
    };

    this.getCell = function (index) {
        return Cells[index];
    };

    this.count = function () {
        return Cells.length;
    };

    this.remove = function (index) {
        Cells.splice(index, 1);
    };

    this.clear = function () {
        Cells = [];
    };
}