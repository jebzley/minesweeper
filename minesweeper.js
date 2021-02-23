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

export const padNumber = (number) => (number < 10 ? `0${number}` : number);

export const renderBoard = () => {
  let divContent = "";
  for (let i = 0; i < 100; i++) {
    divContent += `<div id='cell${padNumber(i)}' class='cell'></div>`
  }
  return divContent;
};

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

export const generateRandomNumbers = () => {
  let randomNumArray = [];
  while (randomNumArray.length < 15) {
    let randomNumber = Math.floor(Math.random() * 99);
    if (randomNumArray.indexOf(randomNumber) === -1)
      randomNumArray.push(randomNumber);
  }
  return randomNumArray;
};
export const placeBombs = (gameArr) => {
  const randomNumArray = generateRandomNumbers();
  randomNumArray.forEach((number) => {
    gameArr[number].isBomb = true;
  });
};

export const getBombCount = (gameArr) => {
  let amountOfBombs = 0;
  gameArr.forEach((object) => {
    if (object.isBomb) amountOfBombs++;
  });
  return amountOfBombs;
};

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

export const calculateAdjacentBombCount = (gameArr) => {
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

export const renderCells = (gameArr, index) => {
  if (gameArr[index].isBomb) return "<img src='./img/bomb.png'>";
  else if (gameArr[index].adjacentBombCount == 0) return "";
  else if (gameArr[index].adjacentBombCount == 1)
    return '<p style="color:blue">1</p>';
  else if (gameArr[index].adjacentBombCount == 2)
    return '<p style="color:green">2</p>';
  else if (gameArr[index].adjacentBombCount > 2)
    return `<p style="color:red">${gameArr[index].adjacentBombCount}</p>`;
};

export const findOccupiedCells = (currentCell, gameArr) => {
  const adjacentCells = findAdjacentCells(currentCell, gameArr).filter(
    (cell) =>
      cell != undefined && !cell.isRevealed && !cell.isBomb && !cell.hasFlag
  );
  adjacentCells.forEach((adjacentCell) => {
    if (adjacentCell.adjacentBombCount > 0 && !adjacentCell.isRevealed) {
      adjacentCell.isRevealed = true;
    } else if (
      adjacentCell.adjacentBombCount == 0 &&
      !adjacentCell.isRevealed
    ) {
      adjacentCell.isRevealed = true;
      findOccupiedCells(adjacentCell, gameArr);
    }
  });
};

export const toggle = (bool) => (bool ? false : true);

export const gameOver = (gameArr) => {
  gameArr.forEach((object) => (object.isRevealed = true));
};

export const flagCounter = (state, flagCount) => {
  if (state) {
    return (flagCount += 1);
  } else return (flagCount -= 1);
};


