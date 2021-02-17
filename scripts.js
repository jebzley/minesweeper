class Cell {
  constructor(column, row) {
    this.column = column;
    this.row = row;
    this.id = `cell${this.row}${this.column}`;
    this.isBomb = false;
    this.hasFlag = false;
    this.adjacentBombCount = 0;
  }
}

// Populate the game grid with divs because I'm too lazy to make 100 divs

const renderBoard = (div) => {
  for (let i = 0; i < 100; i++) {
    if (i < 10) div.innerHTML += `<div id='cell0${i}' class='cell'></div>`;
    else div.innerHTML += `<div id='cell${i}' class='cell'></div>`;
  }
};

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

const findAdjacentCells = (cell, arr) => {
  const adjacentCellArr = [];

  adjacentCellArr[0] = arr.find(
    (object) => object.id == `cell${cell.row}${cell.column - 1}`
  );
  adjacentCellArr[1] = arr.find(
    (object) => object.id == `cell${cell.row}${cell.column + 1}`
  );
  adjacentCellArr[2] = arr.find(
    (object) => object.id == `cell${cell.row - 1}${cell.column}`
  );
  adjacentCellArr[3] = arr.find(
    (object) => object.id == `cell${cell.row + 1}${cell.column}`
  );
  adjacentCellArr[4] = arr.find(
    (object) => object.id == `cell${cell.row - 1}${cell.column - 1}`
  );
  adjacentCellArr[5] = arr.find(
    (object) => object.id == `cell${cell.row - 1}${cell.column + 1}`
  );
  adjacentCellArr[6] = arr.find(
    (object) => object.id == `cell${cell.row + 1}${cell.column - 1}`
  );
  adjacentCellArr[7] = arr.find(
    (object) => object.id == `cell${cell.row + 1}${cell.column + 1}`
  );
  return adjacentCellArr;
};

// Increment values on each cell depending on how many adjacent bombs it has
const calculateAdjacentCell = (gameArr) => {
  gameArr.forEach((cell) => {
    const adjacentCells = findAdjacentCells(cell, gameArr);

    let adjacentBombs = 0;

    adjacentCells.forEach((adjacentCell) => {
      if (adjacentCell != undefined) {
        if (adjacentCell.isBomb) adjacentBombs++;
      }
    });

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

const findOccupiedCells = (currentCell, gameArr) => {
  const adjacentCells = findAdjacentCells(currentCell, gameArr);

  adjacentCells.forEach((adjacentCell) => {
    // do adjacent cells have a value?
    if (adjacentCell != undefined && adjacentCell.adjacentBombCount > 0) {
      // if so, reveal them
      document.getElementById(`${adjacentCell.id}`).classList.add("revealed");
    } 
    // if an adjacent cell doesn't have a value and hasn't already been checked, recursively run this script
    // once no more cells can be checked, break out of the loop somehow
  });
};

// Click events on each cell
const handleCellClick = (cellArr, gameArr) => {
  cellArr.forEach((cell) => {
    cell.addEventListener("click", (event) => {
      const currentCell = gameArr.find(
        (object) => object.id == event.target.id
      );
      console.log("cell clicked: " + event.target.id);
      console.log(currentCell);

      //  If the user clicks a bomb, game over
      if (currentCell.isBomb) console.log("BANG!");
      //  If the user clicks a cell with no value, check adjacent cells to see if they have values (that aren't bombs) and reveal them if they do
      else if (currentCell.adjacentBombCount == 0) {
        findOccupiedCells(currentCell, gameArr);
        // do adjacent cells have a value?
        // if(adjacentCell != undefined && adjacentCell.adjacentBombCount > 0){
        // if so, reveal them
        // document.getElementById(`${adjacentCell.id}`).classList.add("revealed");
        //}

        // if not, run this function on them
      }

      //  If the user clicks a cell with a number, reveal the cell
      else event.target.classList.add("revealed");
    });
  });
};

handleCellClick(document.querySelectorAll(".cell"), gameArr);
