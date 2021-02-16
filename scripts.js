class Cell {
  constructor(column, row) {
    this.column = column;
    this.row = row;
    this.id = this.row + "" + this.column;
    this.isBomb = false;
    this.hasFlag = false;
    this.adjacentBombCount = 0;
  }
}

const renderBoard = () => {
  const gameGrid = document.getElementById("game-grid");
  for (let i = 1; i < 101; i++)
  gameGrid.innerHTML += `<div id='${i}' class='cell'></div>`;
}

renderBoard();

// Create an array of 100 objects representing each cell with their corresponding row and column data

const createGameArray = () => {
  let tempArr = [];
  for (let row = 0; row < 10; row++) {
    tempArr[row] = [];
    for (let col = 0; col < 10; col++) {
      tempArr[row][col] = new Cell(col, row);
    }
  }
  return [].concat.apply([], tempArr);
};

const gameArr = createGameArray();

// Randomly place 10 bombs on cells
const placeBombs = () => {
  for (let i = 0; i < 10; i++)
    gameArr[Math.floor(Math.random() * 100)].isBomb = true;
};
placeBombs();

console.log(gameArr);

// Populate the game grid with divs because I'm too lazy to make 100 divs


// Increment values on each cell depending on how many adjacent bombs it has
const calculateAdjacentCell = () => {
  gameArr.forEach((cell, index, arr) => {
    const colLeft = arr.find(
      (object) => object.id == `${cell.row}${cell.column - 1}`
    );
    const colRight = arr.find(
      (object) => object.id == `${cell.row}${cell.column + 1}`
    );
    const rowUp = arr.find(
      (object) => object.id == `${cell.row - 1}${cell.column}`
    );
    const rowDown = arr.find(
      (object) => object.id == `${cell.row + 1}${cell.column}`
    );
    const diagUpLeft = arr.find(
      (object) => object.id == `${cell.row - 1}${cell.column - 1}`
    );
    const diagUpRight = arr.find(
      (object) => object.id == `${cell.row - 1}${cell.column + 1}`
    );
    const diagDownLeft = arr.find(
      (object) => object.id == `${cell.row + 1}${cell.column - 1}`
    );
    const diagDownRight = arr.find(
      (object) => object.id == `${cell.row + 1}${cell.column + 1}`
    );

    let adjacentBombs = 0;

    if (colLeft != undefined) {
      if (colLeft.isBomb) adjacentBombs++;
    }
    if (colRight != undefined) {
      if (colRight.isBomb) adjacentBombs++;
    }

    console.log(cell.id);
    if (rowUp != undefined) {
      console.log("rowup = " + rowUp.id);
      if (rowUp.isBomb) adjacentBombs++;
    }

    if (rowDown != undefined) {
      console.log("rowdown = " + rowDown.id);
      if (rowDown.isBomb) adjacentBombs++;
    }

    if (diagUpLeft != undefined) {
      console.log("diagupleft = " + diagUpLeft.id);
      if (diagUpLeft.isBomb) adjacentBombs++;
    }

    if (diagUpRight != undefined) {
      console.log("diagupright = " + diagUpRight.id);
      if (diagUpRight.isBomb) adjacentBombs++;
    }

    if (diagDownLeft != undefined) {
      console.log("diagdownleft = " + diagDownLeft.id);
      if (diagDownLeft.isBomb) adjacentBombs++;
    }
    if (diagDownRight != undefined) {
      console.log("diagdownright = " + diagDownRight.id);
      if (diagDownRight.isBomb) adjacentBombs++;
    }

    cell.adjacentBombCount = adjacentBombs;
  });
};

calculateAdjacentCell();

// rendering stuff just for debug purposes
const renderCells = () => {
  const cellArr = document.querySelectorAll(".cell");
  console.log(cellArr);

  cellArr.forEach((cell, index) => {
    if (gameArr[index].isBomb) cell.innerHTML = "💣";
    else if (gameArr[index].adjacentBombCount == 0) cell.innerHTML = "";
    else cell.innerHTML = gameArr[index].adjacentBombCount;
  });
};

renderCells();

// Click events on each cell
//  If the user clicks a bomb, game over
//  If the user clicks a cell with a number, reveal the cell
//  If the user clicks a cell with no value, check adjacent cells to see if they have values (that aren't bombs) and reveal them if they do
//    Call this recursively for each cell checked until values are revealed
