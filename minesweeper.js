// All of the functions related to "minesweeper" go in here...
export class Cell {
  constructor(column, row) {
    this.column = column;
    this.row = row;
    this.id = `cell${this.row}${this.column}`;
    this.isBomb = false;
    this.hasFlag = false;
    this.adjacentBombCount = 0;
    this.isRevealed = false;
  }
}

export const createGameArray = () => {
    let tempArr = [];
    for (let row = 0; row < 10; row++) {
      tempArr[row] = [];
      for (let col = 0; col < 10; col++) {
        tempArr[row][col] = new Cell(col, row);
      }
    }
    return [].concat.apply([], tempArr);
  };

