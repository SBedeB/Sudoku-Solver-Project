const chai = require('chai');
const assert = chai.assert;

const SudokuSolver = require('../controllers/sudoku-solver.js');
let solver = new SudokuSolver();

suite('Unit Tests', () => {

  test('Valid puzzle string of 81 characters', () => {
    let puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.isTrue(solver.validate(puzzle).valid);
  });

  test('Puzzle string with invalid characters (not 1-9 or .)', () => {
    let puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37A';
    assert.isFalse(solver.validate(puzzle).valid);
  });

  test('Puzzle string that is not 81 characters in length', () => {
    let puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3';
    assert.isFalse(solver.validate(puzzle).valid);
  });

  test('Logic handles a valid row placement', () => {
    let puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.isTrue(solver.checkRowPlacement(puzzle, 'A', 2, '3'));
  });

  test('Logic handles an invalid row placement', () => {
    let puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.isFalse(solver.checkRowPlacement(puzzle, 'A', 2, '5'));
  });

  test('Logic handles a valid column placement', () => {
    let puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.isTrue(solver.checkColPlacement(puzzle, 'A', 2, '3'));
  });

  test('Logic handles an invalid column placement', () => {
    let puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.isFalse(solver.checkColPlacement(puzzle, 'A', 1, '2'));
  });

  test('Logic handles a valid region (3x3 grid) placement', () => {
    let puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.isTrue(solver.checkRegionPlacement(puzzle, 'A', 2, '3'));
  });

  test('Logic handles an invalid region (3x3 grid) placement', () => {
    let puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.isFalse(solver.checkRegionPlacement(puzzle, 'A', 2, '2'));
  });

  test('Valid puzzle strings pass the solver', () => {
    let puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    let solved = solver.solve(puzzle);
    assert.isNotNull(solved);
    assert.match(solved, /^[1-9]+$/);
  });

  test('Invalid puzzle strings fail the solver', () => {
    let puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3';
    let solved = solver.solve(puzzle);
    assert.isFalse(solved);
  });

  test('Solver returns the expected solution for an incomplete puzzle', () => {
    let puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    let solution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
    assert.equal(solver.solve(puzzle), solution);
  });
});