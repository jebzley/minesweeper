// ====================== TODO ======================
// - Add gameover state/reset button
//       ^ BE AT LEAST HERE BY END OF DAY ^
// - Add timer/smiley/bomb count
// - CSS styling
// - Create unit tests / e2e tests

class Cell {
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

const renderBoard = () => {
  let divContent = "";
  for (let i = 0; i < 100; i++) {
    if (i < 10) divContent += `<div id='cell0${i}' class='cell'></div>`;
    else divContent += `<div id='cell${i}' class='cell'></div>`;
  }
  console.log(divContent);
  return divContent;
};

document.getElementById("game-grid").innerHTML = renderBoard();

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

const gameArr = createGameArray(Cell);

const placeBombs = (gameArr) => {
  for (let i = 0; i < 15; i++)
    gameArr[Math.floor(Math.random() * 100)].isBomb = true;
};

placeBombs(gameArr);

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

const calculateAdjacentBombCount = (gameArr) => {
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

calculateAdjacentBombCount(gameArr);

const renderCells = (gameArr, index) => {
  if (gameArr[index].isBomb) return "<p>💣</p>";
  else if (gameArr[index].adjacentBombCount == 0) return "";
  else if (gameArr[index].adjacentBombCount == 1)
    return '<p style="color:blue">1</p>';
  else if (gameArr[index].adjacentBombCount == 2)
    return '<p style="color:green">2</p>';
  else if (gameArr[index].adjacentBombCount > 2)
    return `<p style="color:red">${gameArr[index].adjacentBombCount}</p>`;
};

document.querySelectorAll(".cell").forEach((cell, index) => {
  cell.innerHTML = renderCells(gameArr, index);
});

const findOccupiedCells = (currentCell, gameArr) => {
  const adjacentCells = findAdjacentCells(currentCell, gameArr).filter(
    (cell) => cell != undefined && !cell.isRevealed && !cell.isBomb
  && !cell.hasFlag);
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

const toggle = bool => bool ? false : true;

// ----------------------------GAME & HTML LOGIC----------------------------

document.querySelectorAll(".cell").forEach((cell) => {
  const currentCell = gameArr.find((object) => object.id == cell.id);
  cell.addEventListener("contextmenu", (event) => {
    if(!currentCell.isRevealed){
      currentCell.hasFlag = toggle(currentCell.hasFlag);
      cell.classList.toggle('flagged');
    }
    event.preventDefault();
  }, false)

  cell.addEventListener("click", (event) => {
    console.log("cell clicked: " + event.target.id);
    console.log(currentCell);

    //  If the user clicks a bomb, game over
    if (currentCell.isBomb && !currentCell.hasFlag) {
      //end game
    }
    else if (currentCell.adjacentBombCount == 0 && !currentCell.hasFlag) {
      findOccupiedCells(currentCell, gameArr);
    }

    if (!currentCell.isRevealed && !currentCell.hasFlag){
      currentCell.isRevealed = true;
    }
    
    gameArr.forEach((object) => {
      if (object.isRevealed){
        document.getElementById(`${object.id}`).classList.add('revealed')
        object.hasFlag = false;
      }
    })
  });
});
