// Board dimensions
export const ROWS = 6;
export const COLS = 7;

// Player constants
export const CAT = 'cat';
export const DOG = 'dog';
export const EMPTY = null;

// Create empty board
export function createBoard() {
  return Array(ROWS).fill(null).map(() => Array(COLS).fill(EMPTY));
}

// Check if column is valid and not full
export function isValidColumn(board, col) {
  return col >= 0 && col < COLS && board[0][col] === EMPTY;
}

// Drop piece into column - returns new board and row position
export function dropPiece(board, col, player) {
  if (!isValidColumn(board, col)) return null;

  const newBoard = board.map(row => [...row]);
  let rowPosition = -1;

  for (let r = ROWS - 1; r >= 0; r--) {
    if (newBoard[r][col] === EMPTY) {
      newBoard[r][col] = player;
      rowPosition = r;
      break;
    }
  }

  return { board: newBoard, row: rowPosition };
}

// Check for winner - returns array of winning positions or null
export function checkWinner(board) {
  // Check horizontal
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      const cell = board[r][c];
      if (cell && cell === board[r][c+1] && cell === board[r][c+2] && cell === board[r][c+3]) {
        return {
          winner: cell,
          positions: [[r, c], [r, c+1], [r, c+2], [r, c+3]]
        };
      }
    }
  }

  // Check vertical
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = board[r][c];
      if (cell && cell === board[r+1][c] && cell === board[r+2][c] && cell === board[r+3][c]) {
        return {
          winner: cell,
          positions: [[r, c], [r+1, c], [r+2, c], [r+3, c]]
        };
      }
    }
  }

  // Check diagonal (top-left to bottom-right)
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      const cell = board[r][c];
      if (cell && cell === board[r+1][c+1] && cell === board[r+2][c+2] && cell === board[r+3][c+3]) {
        return {
          winner: cell,
          positions: [[r, c], [r+1, c+1], [r+2, c+2], [r+3, c+3]]
        };
      }
    }
  }

  // Check diagonal (top-right to bottom-left)
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 3; c < COLS; c++) {
      const cell = board[r][c];
      if (cell && cell === board[r+1][c-1] && cell === board[r+2][c-2] && cell === board[r+3][c-3]) {
        return {
          winner: cell,
          positions: [[r, c], [r+1, c-1], [r+2, c-2], [r+3, c-3]]
        };
      }
    }
  }

  return null;
}

// Check for draw (board full)
export function checkDraw(board) {
  return board[0].every(cell => cell !== EMPTY);
}

// Get valid columns
export function getValidColumns(board) {
  const valid = [];
  for (let c = 0; c < COLS; c++) {
    if (board[0][c] === EMPTY) valid.push(c);
  }
  return valid;
}

// Generate ASCII representation for AI
export function boardToAscii(board) {
  let ascii = '| . . . . . . . |\n';
  for (let r = 0; r < ROWS; r++) {
    ascii += '| ';
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] === CAT) ascii += 'C ';
      else if (board[r][c] === DOG) ascii += 'D ';
      else ascii += '. ';
    }
    ascii += '|\n';
  }
  return ascii;
}

// Get next row in column (for preview)
export function getNextRow(board, col) {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r][col] === EMPTY) return r;
  }
  return -1;
}
