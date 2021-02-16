class Cell{
  constructor(column, row){
    this.column = column;
    this.row = row;
    this.isBomb = false;
    this.hasFlag = false;
    this.adjacentBombCount = 0;
  }
}

const gameGrid = document.getElementById("game-grid");

// Create an array of 100 objects representing each cell with their corresponding row and column data


const createGameArray = () => {
  let tempArr = [];
  for(let row=0;row<10;row++){
    tempArr[row] = [];
    for (let col=0;col<10;col++){
      tempArr[row][col] = new Cell(col, row);
    }
  }
  return [].concat.apply([], tempArr);
}

const gameArr = createGameArray();

// Randomly place 10 bombs on cells
for(let i = 0; i<10; i++){
  gameArr[Math.floor(Math.random() * 100)].isBomb = true;
}

console.log(gameArr);

// Populate the game grid with divs because I'm too lazy to make 100 divs
for(let i=1;i<101;i++) gameGrid.innerHTML += `<div id='${i}' class='cell'></div>`;



// Increment values on each cell depending on how many adjacent bombs it has

// Click events on each cell
//  If the user clicks a bomb, game over
//  If the user clicks a cell with a number, reveal the cell
//  If the user clicks a cell with no value, check adjacent cells to see if they have values (that aren't bombs) and reveal them if they do
//    Call this recursively for each cell checked until values are revealed