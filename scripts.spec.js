import {createGameArray} from './minesweeper.js';

it ('should create an array containing 100 objects', () => {
  // Arrange
  const result = createGameArray();
  // Assert
  expect (result.length).toBe(100)
  
});