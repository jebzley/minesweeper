import { createGameArray, generateRandomNumbers, toggle, flagCounter } from "./minesweeper.js";

it("createGameArray should create an array containing 100 objects", () => {
  const result = createGameArray();
  expect(result.length).toBe(100);
});

it("generateRandomNumbers should create an array containing 15 numbers", () => {
  const result = generateRandomNumbers();
  expect(result.length).toBe(15);
});

it("each random number in generateRandomNumbers should be unique", () => {
  const result = generateRandomNumbers();
  const unique = (value, index, self) => self.indexOf(value) === index;
  const uniqueVals = result.filter(unique);
  expect(uniqueVals.length).toBe(result.length);
});

it("toggle should return false when given true", () => {
  const result = toggle(true);
  expect(result).toBe(false);
})

it("toggle should return true when given false", () => {
  const result = toggle(false);
  expect(result).toBe(true);
})

it("flagCounter should return 2 if true", () => {
  const result = flagCounter(true, 1);
  expect(result).toBe(2);
})

it("flagCounter should return 0 if false", () => {
  const result = flagCounter(false, 1);
  expect(result).toBe(0);
})
