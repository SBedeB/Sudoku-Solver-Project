class SudokuSolver {

  // Validate the puzzle string for length and allowed characters
  validate(puzzleString) {
    if (puzzleString.length !== 81) {
      return { valid: false, error: 'Expected puzzle to be 81 characters long' };
    }
    if (!/^[1-9.]+$/.test(puzzleString)) {
      return { valid: false, error: 'Invalid characters in puzzle' };
    }
    return { valid: true };
  }

  // Convert a letter (e.g., 'A') to its corresponding row index (1-9)
  letterToNumber(row) {
    switch (row.toUpperCase()) {
      case 'A': return 1;
      case 'B': return 2;
      case 'C': return 3;
      case 'D': return 4;
      case 'E': return 5;
      case 'F': return 6;
      case 'G': return 7;
      case 'H': return 8;
      case 'I': return 9;
      default: return 'none'; // Indicate an invalid input
    }
  }

  // Check if a number can be placed in a specific row
  checkRowPlacement(puzzleString, row, column, value) {
      const rowIndex = this.letterToNumber(row);
      for (let i = 0; i < 9; i++) {
          if (puzzleString[(rowIndex - 1) * 9 + i] === value) {
              return false; // If value already exists in the row, placement is invalid
          }
      }
      return true; // No conflicts found, placement is valid
  }

  // Check if a number can be placed in a specific column
  checkColPlacement(puzzleString, row, column, value) {
    for (let i = 0; i < 9; i++) {
      if (puzzleString[i * 9 + (column - 1)] === value) {
        return false;
      }
    }
    return true;
  }

  // Check if a number can be placed in a specific region (3x3 grid)
  checkRegionPlacement(puzzleString, row, column, value) {
      const startRow = Math.floor(this.letterToNumber(row) / 3) * 3;
      const startCol = Math.floor((parseInt(column, 10) - 1) / 3) * 3;
      for (let i = startRow; i < startRow + 3; i++) {
          for (let j = startCol; j < startCol + 3; j++) {
              if (puzzleString[i * 9 + j] === value) {
                  return false; // If value already exists in the region, placement is invalid
              }
          }
      }
      return true; // No conflicts found, placement is valid
  }

  // Solve the Sudoku puzzle using a backtracking algorithm
  solve(puzzleString) {
    const validation = this.validate(puzzleString);
    if (!validation.valid) return false; // Return false if the puzzle is invalid

    const board = this.convertToBoard(puzzleString);
    if (this.solveBoard(board)) {
      return this.convertToString(board); // Return solved puzzle
    }
    return false; // Puzzle unsolvable
  }

  solveBoard(board) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === '.') {
          for (let num = 1; num <= 9; num++) {
            if (this.isValidPlacement(board, row, col, num.toString())) {
              board[row][col] = num.toString();
              if (this.solveBoard(board)) return true;
              board[row][col] = '.';
            }
          }
          return false;
        }
      }
    }
    return true; // Solved
  }

  isValidPlacement(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
      // Row check
      if (board[row][i] === num) return false;
      // Column check
      if (board[i][col] === num) return false;
      // Box check
      if (board[3 * Math.floor(row / 3) + Math.floor(i / 3)][3 * Math.floor(col / 3) + i % 3] === num) return false;
    }
    return true;
  }

  // Convert puzzle string to 2D array
  convertToBoard(puzzleString) {
    let board = [];
    for (let i = 0; i < 9; i++) {
      board.push(puzzleString.substring(i * 9, i * 9 + 9).split(''));
    }
    return board;
  }

  // Convert 2D array back to puzzle string
  convertToString(board) {
    return board.map(row => row.join('')).join('');
  }

}

module.exports = SudokuSolver;
