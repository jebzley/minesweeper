// ====================== TODO ======================
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
    i < 10
      ? (divContent += `<div id='cell0${i}' class='cell'></div>`)
      : (divContent += `<div id='cell${i}' class='cell'></div>`);
  }
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
  for (let i = 0; i < 16; i++)
    {gameArr[Math.floor(Math.random() * 99)].isBomb = true;}
};

placeBombs(gameArr);

const getBombCount = (gameArr) =>{
  let amountOfBombs = 0;
  gameArr.forEach(object => {
    if(object.isBomb) amountOfBombs++;
  }) 
  return amountOfBombs;
}

let amountOfBombs = getBombCount(gameArr);

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
  if (gameArr[index].isBomb) return "<img src='../img/bomb.png'>";
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

const toggle = (bool) => (bool ? false : true);

const gameOver = (gameArr) => {
  gameArr.forEach((object) => (object.isRevealed = true));
};

const flagCounter = (state, flagCount) => {
  if (state) {
    return (flagCount = flagCount + 1);
  } else return (flagCount = flagCount - 1);
};

const padNumber = (number) => (number < 10 ? `0${number}` : number);

// ----------------------------GAME & HTML LOGIC----------------------------
const score = {
  amountOfFlags: 0,
  tilesRevealed: 0
};

let timeInSeconds = 0;
let timeInMinutes = 0;

let timer = setInterval(() => {
  timeInSeconds++;

  if (timeInSeconds > 60) {
    timeInMinutes++;
    timeInSeconds = 0;
  }
  document.getElementById("timer").innerHTML = `${padNumber(
    timeInMinutes
  )} : ${padNumber(timeInSeconds)}`;
}, 1000);

document.querySelectorAll(".cell").forEach((cell) => {
  const currentCell = gameArr.find((object) => object.id == cell.id);

  // RIGHT CLICK HANDLING
  cell.addEventListener(
    "contextmenu",
    (event) => {
      if (!currentCell.isRevealed && score.amountOfFlags < amountOfBombs) {
        currentCell.hasFlag = toggle(currentCell.hasFlag);
        cell.classList.toggle("flagged");
        score.amountOfFlags = flagCounter(
          currentCell.hasFlag,
          score.amountOfFlags
        );
      } else {
        currentCell.hasFlag = false;
        cell.classList.remove("flagged");
        if (score.amountOfFlags > 0) score.amountOfFlags--;
      }
      document.getElementById("flag-count").innerHTML =
        amountOfBombs - score.amountOfFlags;
      event.preventDefault();
    },
    false
  );

  // LEFT CLICK HANDLING
  cell.addEventListener("click", () => {
    if (currentCell.isBomb && !currentCell.hasFlag) {
      gameOver(gameArr);
      cell.classList.add("detonated");
      document
        .querySelectorAll(".cell")
        .forEach((cell) => cell.classList.remove("flagged"));
      clearInterval(timer);
      document.getElementById("smiley").classList.add("smiley--gameover");
      document.getElementById("endgame-box").style.display = "flex";
      document.getElementById("game-over-message").innerText =
        "Close, but no cigar!\nWould you like to play again?";
    }

    if (currentCell.adjacentBombCount == 0 && !currentCell.hasFlag) {
      findOccupiedCells(currentCell, gameArr);
    }

    if (!currentCell.isRevealed && !currentCell.hasFlag) {
      currentCell.isRevealed = true;
    }

    gameArr.forEach((object) => {
      if (object.isRevealed) {
        document.getElementById(`${object.id}`).classList.add("revealed");
        object.hasFlag = false;
      }
    });

    // HANDLE WIN STATE
    let cellsNotRevealed = gameArr.filter((object) => !object.isRevealed);
    if (cellsNotRevealed.length == amountOfBombs) {
      gameOver(gameArr);
      document
        .querySelectorAll(".cell")
        .forEach((cell) => cell.classList.remove("flagged"));
      clearInterval(timer);
      document.getElementById("smiley").classList.add("smiley--win");
      document.getElementById("endgame-box").style.display = "flex";
      document.getElementById("game-over-message").innerText =
        "Congratulations! You beat the game in ${TIME}.\nWould you like to play again?";
    }
  });

  cell.addEventListener("mousedown", () => {
    document.getElementById("smiley").classList.add("smiley--mousedown");
  })

  cell.addEventListener("mouseup", () => {
    document.getElementById("smiley").classList.remove("smiley--mousedown");
  })
});


// HANDLE NEWGAME
document.querySelectorAll('.reset').forEach((button) =>{
  button.addEventListener("click", () => {
    score.amountOfFlags = 0;
    score.tilesRevealed = 0;
    gameArr.forEach((object) => {
      object.hasFlag = false;
      object.adjacentBombCount = 0;
      object.isRevealed = false;
      object.isBomb = false;
    });
  
    placeBombs(gameArr);
    amountOfBombs = getBombCount(gameArr);
    calculateAdjacentBombCount(gameArr);
    document.getElementById("endgame-box").style.display = "none";
    document.querySelectorAll(".cell").forEach((cell, index) => {
      cell.classList.remove("revealed");
      cell.classList.remove("detonated");
      cell.classList.remove("flagged");
      cell.innerHTML = renderCells(gameArr, index);
    });
  
    document.getElementById("flag-count").innerHTML = amountOfBombs - score.amountOfFlags;
  
    document.getElementById("timer").innerHTML = `00 : 00`;
    timeInSeconds = 0;
    timeInMinutes = 0;
    clearInterval(timer);
    timer = setInterval(() => {
      timeInSeconds++;
  
      if (timeInSeconds > 60) {
        timeInMinutes++;
        timeInSeconds = 0;
      }
      document.getElementById("timer").innerHTML = `${padNumber(
        timeInMinutes
      )} : ${padNumber(timeInSeconds)}`;
    }, 1000);
    document.getElementById("smiley").classList.remove("smiley--gameover");
    document.getElementById("smiley").classList.remove("smiley--win");
  });
  
})
