import {
  Cell,
  renderBoard,
  createGameArray,
  placeBombs,
  getBombCount,
  calculateAdjacentBombCount,
  renderCells,
  findOccupiedCells,
  toggle,
  gameOver,
  flagCounter,
  padNumber,
} from "./minesweeper.js";

// INITIALISATION
document.getElementById("game-grid").innerHTML = renderBoard();
const gameArr = createGameArray();
placeBombs(gameArr);
let amountOfBombs = getBombCount(gameArr);
calculateAdjacentBombCount(gameArr);
document.querySelectorAll(".cell").forEach((cell, index) => {
  cell.innerHTML = renderCells(gameArr, index);
});
const score = {
  amountOfFlags: 0,
  tilesRevealed: 0,
};
document.getElementById("flag-count").innerHTML =
  amountOfBombs - score.amountOfFlags;

// START TIMER
let timeInSeconds = 0;
let timeInMinutes = 0;

let timer = setInterval(() => {
  timeInSeconds++;

  if (timeInSeconds > 60) {
    timeInMinutes++;
    timeInSeconds = 0;
  }
  document.getElementById("timer").innerHTML = `<h3>${padNumber(
    timeInMinutes
  )} : ${padNumber(timeInSeconds)}</h3>`;
}, 1000);

document.querySelectorAll(".cell").forEach((cell) => {
  const currentCell = gameArr.find((object) => object.id == cell.id);

  // RIGHT CLICK HANDLING
  cell.addEventListener(
    "contextmenu",
    (event) => {
      event.preventDefault();
      if (
        !currentCell.isRevealed &&
        currentCell.hasFlag == true &&
        score.amountOfFlags == amountOfBombs
      ) {
        currentCell.hasFlag = false;
        cell.classList.remove("flagged");
        score.amountOfFlags--;
      } else if (
        !currentCell.isRevealed &&
        score.amountOfFlags < amountOfBombs
      ) {
        currentCell.hasFlag = toggle(currentCell.hasFlag);
        cell.classList.toggle("flagged");
        score.amountOfFlags = flagCounter(
          currentCell.hasFlag,
          score.amountOfFlags
        );
      }

      document.getElementById("flag-count").innerHTML =
        amountOfBombs - score.amountOfFlags;
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
  });

  cell.addEventListener("mouseup", () => {
    document.getElementById("smiley").classList.remove("smiley--mousedown");
  });
});

// HANDLE NEWGAME
document.querySelectorAll(".reset").forEach((button) => {
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

    document.getElementById("flag-count").innerHTML =
      amountOfBombs - score.amountOfFlags;

    document.getElementById("timer").innerHTML = `<h3>00 : 00</h3>`;
    timeInSeconds = 0;
    timeInMinutes = 0;
    clearInterval(timer);
    timer = setInterval(() => {
      timeInSeconds++;

      if (timeInSeconds > 60) {
        timeInMinutes++;
        timeInSeconds = 0;
      }
      document.getElementById("timer").innerHTML = `<h3>${padNumber(
        timeInMinutes
      )} : ${padNumber(timeInSeconds)}</h3>`;
    }, 1000);
    document.getElementById("smiley").classList.remove("smiley--gameover");
    document.getElementById("smiley").classList.remove("smiley--win");
  });
});

let currentTime = new Date();
let hours = currentTime.getHours();
let minutes = currentTime.getMinutes();
if (minutes < 10) {
  minutes = "0" + minutes;
}
let t_str = hours + ":" + minutes + " ";
if (hours > 11) {
  t_str += "PM";
} else {
  t_str += "AM";
}
document.getElementById("time").innerHTML = t_str;
