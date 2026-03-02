import { ROWS, COLS, CAT, DOG, EMPTY, dropPiece, checkWinner, getValidColumns } from './gameLogic.js';

// Difficulty levels
export const DIFFICULTY = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
};

// Get opponent
function getOpponent(player) {
  return player === CAT ? DOG : CAT;
}

// Check if player can win on next move
function findWinningMove(board, player) {
  const validCols = getValidColumns(board);
  for (const col of validCols) {
    const result = dropPiece(board, col, player);
    if (result) {
      const winCheck = checkWinner(result.board);
      if (winCheck && winCheck.winner === player) {
        return col;
      }
    }
  }
  return null;
}

// Count open ends for a line of pieces
function countOpenEnds(board, player, r, c, dr, dc) {
  let openEnds = 0;

  // Check forward
  let fr = r + dr * 3;
  let fc = c + dc * 3;
  if (fr >= 0 && fr < ROWS && fc >= 0 && fc < COLS && board[fr][fc] === EMPTY) {
    openEnds++;
  }

  // Check backward
  let br = r - dr;
  let bc = c - dc;
  if (br >= 0 && br < ROWS && bc >= 0 && bc < COLS && board[br][bc] === EMPTY) {
    openEnds++;
  }

  return openEnds;
}

// Evaluate window of 4 cells
function evaluateWindow(window, player) {
  const opponent = getOpponent(player);
  let score = 0;
  const playerCount = window.filter(c => c === player).length;
  const opponentCount = window.filter(c => c === opponent).length;
  const emptyCount = window.filter(c => c === EMPTY).length;

  // Win detection
  if (playerCount === 4) {
    score += 100;
  } else if (playerCount === 3 && emptyCount === 1) {
    score += 5;
  } else if (playerCount === 2 && emptyCount === 2) {
    score += 2;
  }

  // Block opponent
  if (opponentCount === 3 && emptyCount === 1) {
    score -= 4;
  } else if (opponentCount === 2 && emptyCount === 2) {
    score -= 1;
  }

  return score;
}

// Heuristic evaluation function
function evaluateBoard(board, player) {
  let score = 0;

  // Center column preference
  const centerCol = Math.floor(COLS / 2);
  const centerArray = [];
  for (let r = 0; r < ROWS; r++) {
    centerArray.push(board[r][centerCol]);
  }
  const centerCount = centerArray.filter(c => c === player).length;
  score += centerCount * 3;

  // Horizontal evaluation
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      const window = [board[r][c], board[r][c+1], board[r][c+2], board[r][c+3]];
      score += evaluateWindow(window, player);
    }
  }

  // Vertical evaluation
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c < COLS; c++) {
      const window = [board[r][c], board[r+1][c], board[r+2][c], board[r+3][c]];
      score += evaluateWindow(window, player);
    }
  }

  // Diagonal evaluation (top-left to bottom-right)
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      const window = [board[r][c], board[r+1][c+1], board[r+2][c+2], board[r+3][c+3]];
      score += evaluateWindow(window, player);
    }
  }

  // Diagonal evaluation (top-right to bottom-left)
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 3; c < COLS; c++) {
      const window = [board[r][c], board[r+1][c-1], board[r+2][c-2], board[r+3][c-3]];
      score += evaluateWindow(window, player);
    }
  }

  return score;
}

// Minimax algorithm with alpha-beta pruning
function minimax(board, depth, alpha, beta, maximizingPlayer) {
  const validCols = getValidColumns(board);
  const isTerminal = checkWinner(board) || validCols.length === 0;

  if (depth === 0 || isTerminal) {
    if (isTerminal) {
      const win = checkWinner(board);
      if (win) {
        return win.winner === DOG ? 10000000 : -10000000;
      }
      return 0;
    }
    return evaluateBoard(board, DOG);
  }

  if (maximizingPlayer) {
    let value = -Infinity;
    for (const col of validCols) {
      const result = dropPiece(board, col, DOG);
      if (result) {
        const newScore = minimax(result.board, depth - 1, alpha, beta, false);
        value = Math.max(value, newScore);
        alpha = Math.max(alpha, value);
        if (beta <= alpha) break;
      }
    }
    return value;
  } else {
    let value = Infinity;
    for (const col of validCols) {
      const result = dropPiece(board, col, CAT);
      if (result) {
        const newScore = minimax(result.board, depth - 1, alpha, beta, true);
        value = Math.min(value, newScore);
        beta = Math.min(beta, value);
        if (beta <= alpha) break;
      }
    }
    return value;
  }
}

// Get random valid column
function getRandomMove(board) {
  const validCols = getValidColumns(board);
  return validCols[Math.floor(Math.random() * validCols.length)];
}

// Easy difficulty AI
function easyAI(board) {
  // 40% chance of random move
  if (Math.random() < 0.4) {
    return getRandomMove(board);
  }

  // Check for immediate win
  const winMove = findWinningMove(board, DOG);
  if (winMove !== null) return winMove;

  // Check for immediate block
  const blockMove = findWinningMove(board, CAT);
  if (blockMove !== null) return blockMove;

  // Sometimes ignore center priority
  if (Math.random() < 0.3) {
    return getRandomMove(board);
  }

  // Prefer center
  const centerCol = Math.floor(COLS / 2);
  if (board[0][centerCol] === EMPTY) {
    return centerCol;
  }

  return getRandomMove(board);
}

// Medium difficulty AI
function mediumAI(board) {
  // Always take immediate win
  const winMove = findWinningMove(board, DOG);
  if (winMove !== null) return winMove;

  // Always block immediate loss
  const blockMove = findWinningMove(board, CAT);
  if (blockMove !== null) return blockMove;

  // Prefer center
  const centerCol = Math.floor(COLS / 2);
  if (board[0][centerCol] === EMPTY) {
    return centerCol;
  }

  // Pick random from valid columns
  return getRandomMove(board);
}

// Hard difficulty AI
function hardAI(board) {
  // First check for immediate win
  const winMove = findWinningMove(board, DOG);
  if (winMove !== null) return winMove;

  // Then check for immediate block
  const blockMove = findWinningMove(board, CAT);
  if (blockMove !== null) return blockMove;

  // Use minimax for deeper evaluation
  const validCols = getValidColumns(board);
  let bestScore = -Infinity;
  let bestCol = validCols[0];

  for (const col of validCols) {
    const result = dropPiece(board, col, DOG);
    if (result) {
      const score = minimax(result.board, 5, -Infinity, Infinity, false);
      if (score > bestScore) {
        bestScore = score;
        bestCol = col;
      }
    }
  }

  return bestCol;
}

// Main AI function - returns column choice and reasoning
export function getAIMove(board, difficulty, gameHistory = []) {
  const validCols = getValidColumns(board);
  if (validCols.length === 0) return null;

  let move;
  let reasoning = [];

  switch (difficulty) {
    case DIFFICULTY.EASY:
      move = easyAI(board);
      reasoning = [
        'Analyzing immediate threats...',
        'Evaluating center control...',
        'Selected column: ' + (move + 1)
      ];
      break;

    case DIFFICULTY.MEDIUM:
      move = mediumAI(board);
      const winMove = findWinningMove(board, DOG);
      const blockMove = findWinningMove(board, CAT);
      if (winMove !== null) {
        reasoning = ['Found winning move!', 'Taking the win.'];
      } else if (blockMove !== null) {
        reasoning = ['Detected threat!', 'Blocking opponent win.'];
      } else {
        reasoning = ['Evaluating 2-move threats...', 'Checking center control...', 'Optimizing position.'];
      }
      reasoning.push('Selected column: ' + (move + 1));
      break;

    case DIFFICULTY.HARD:
      move = hardAI(board);
      reasoning = [
        'Running minimax algorithm (depth 5)...',
        'Evaluating all possible futures...',
        'Calculating optimal defense...',
        'Analyzing double-threats...',
        'Selected column: ' + (move + 1)
      ];
      break;

    default:
      move = getRandomMove(board);
  }

  return {
    column: move,
    reasoning: reasoning
  };
}

// Get thinking time based on difficulty
export function getThinkingTime(difficulty) {
  switch (difficulty) {
    case DIFFICULTY.EASY:
      return 500 + Math.random() * 500; // 0.5-1s
    case DIFFICULTY.MEDIUM:
      return 1000 + Math.random() * 500; // 1-1.5s
    case DIFFICULTY.HARD:
      return 1500 + Math.random() * 1000; // 1.5-2.5s
    default:
      return 1000;
  }
}
