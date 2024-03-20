'use strict';
require('dotenv').config();
const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  let solver = new SudokuSolver();

  // Endpoint for checking a puzzle placement
  app.post('/api/check', (req, res) => {
      const { puzzle, coordinate, value } = req.body;

      // Check for missing fields
      if (!puzzle || !coordinate || !value) {
          return res.json({ error: 'Required field(s) missing' });
      }

      // Validate the puzzle string
      const validation = solver.validate(puzzle);
      if (!validation.valid) {
          return res.json({ error: validation.error });
      }

      // Extract row and column from coordinate
      const row = coordinate.charAt(0);
      const column = coordinate.charAt(1);

      // Validate the coordinate
      if (!/^[A-I][1-9]$/.test(coordinate)) {
          return res.json({ error: 'Invalid coordinate' });
      }

      // Validate the value
      if (!/^[1-9]$/.test(value)) {
          return res.json({ error: 'Invalid value' });
      }

      // Calculate index in the puzzle string using the letterToNumber method
      // Adjusted as per instruction to ensure zero-based indexing matches array positions
      const index = (solver.letterToNumber(row) - 1) * 9 + (parseInt(column, 10) - 1);

      // Check if the existing value at the index matches the provided value
      if (puzzle[index] === value) {
          return res.json({ valid: true });
      }

      // If they don't match, proceed with further validation for conflicts
      const validRow = solver.checkRowPlacement(puzzle, row, column, value);
      const validColumn = solver.checkColPlacement(puzzle, row, column, value);
      const validRegion = solver.checkRegionPlacement(puzzle, row, column, value);
      const conflicts = [];
      if (!validRow) {
          conflicts.push('row');
      }
      if (!validColumn) {
          conflicts.push('column');
      }
      if (!validRegion) {
          conflicts.push('region');
      }

      // Respond based on validation results
      if (conflicts.length > 0) {
          res.json({ valid: false, conflict: conflicts });
      } else {
          res.json({ valid: true });
      }
  });

  // Endpoint for solving a puzzle
  app.post('/api/solve', (req, res) => {
    const { puzzle } = req.body;

    // Check if puzzle field is missing
    if (!puzzle) {
      return res.json({ error: 'Required field missing' });
    }

    // Validate the puzzle string
    const validation = solver.validate(puzzle);
    if (!validation.valid) {
      return res.json({ error: validation.error });
    }

    // Solve the puzzle
    const solution = solver.solve(puzzle);
    if (solution) {
      res.json({ solution });
    } else {
      res.json({ error: 'Puzzle cannot be solved' });
    }
  });
};
