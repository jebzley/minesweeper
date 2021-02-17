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

// Populate the game grid with divs because I'm too lazy to make 100 divs

const renderBoard = div => {
  for (let i = 0; i < 100; i++)
  div.innerHTML += `<div id='${i}' class='cell'></div>`;
}

renderBoard(document.getElementById("game-grid"));

// Create an array of 100 objects representing each cell with their corresponding row and column data

const createGameArray = (cellClass) => {
  let tempArr = [];
  for (let row = 0; row < 10; row++) {
    tempArr[row] = [];
    for (let col = 0; col < 10; col++) {
      tempArr[row][col] = new cellClass(col, row);
    }
  }
  return [].concat.apply([], tempArr);
};

// An unfortunately necessarry global variable
const gameArr = createGameArray(Cell);

// Randomly place 10 bombs on cells
const placeBombs = (gameArr) => {
  for (let i = 0; i < 15; i++)
    gameArr[Math.floor(Math.random() * 100)].isBomb = true;
};
placeBombs(gameArr);

console.log(gameArr);

// Increment values on each cell depending on how many adjacent bombs it has
const calculateAdjacentCell = (gameArr) => {
  gameArr.forEach((cell, i, arr) => {
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

    if (rowUp != undefined) {
      if (rowUp.isBomb) adjacentBombs++;
    }

    if (rowDown != undefined) {
      if (rowDown.isBomb) adjacentBombs++;
    }

    if (diagUpLeft != undefined) {
      if (diagUpLeft.isBomb) adjacentBombs++;
    }

    if (diagUpRight != undefined) {
      if (diagUpRight.isBomb) adjacentBombs++;
    }

    if (diagDownLeft != undefined) {
      if (diagDownLeft.isBomb) adjacentBombs++;
    }
    if (diagDownRight != undefined) {
      if (diagDownRight.isBomb) adjacentBombs++;
    }

    cell.adjacentBombCount = adjacentBombs;
  });
};

calculateAdjacentCell(gameArr);

// rendering stuff just for debug purposes
const renderCells = (cellArr) => {

  cellArr.forEach((cell, index) => {
    if (gameArr[index].isBomb) cell.innerHTML = "💣";
    else if (gameArr[index].adjacentBombCount == 0) cell.innerHTML = "";
    else cell.innerHTML = gameArr[index].adjacentBombCount;
  });
};

renderCells(document.querySelectorAll(".cell"));

// Click events on each cell
const handleCellClick = (cellArr, gameArr) => {

  cellArr.forEach(cell => {
    cell.addEventListener('click', (event) => {
      const currentCell = gameArr.find(object => object.id == event.target.id);
      console.log("cell clicked: " + event.target.id);
      console.log(currentCell);

      //  If the user clicks a bomb, game over
      if(currentCell.isBomb) console.log('BANG!')

      //  If the user clicks a cell with no value, check adjacent cells to see if they have values (that aren't bombs) and reveal them if they do
      else if(currentCell.adjacentBombCount == 0) console.log("empty")
      //    Call this recursively for each cell checked until values are revealed
      
      //  If the user clicks a cell with a number, reveal the cell
      else console.log("Cell revealed. Amount of bombs nearby: " + currentCell.adjacentBombCount);
      

    });

  });
}

handleCellClick(document.querySelectorAll(".cell"), gameArr) 



