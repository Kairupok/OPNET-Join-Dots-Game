import { ROWS, COLS, CAT, DOG, EMPTY } from '../utils/gameLogic';

export default function Board({ board, onColumnClick, winner, winningPositions, currentPlayer, isPlayerTurn, hoveredColumn, onColumnHover }) {
  const isWinningPosition = (row, col) => {
    if (!winningPositions) return false;
    return winningPositions.some(([r, c]) => r === row && c === col);
  };

  const isColumnHovered = (col) => {
    return hoveredColumn === col && isPlayerTurn && currentPlayer === CAT;
  };

  const getPieceClass = (cell, row, col) => {
    let baseClass = 'w-12 h-12 rounded-full transition-all duration-300 ';

    if (cell === CAT) {
      baseClass += 'piece-cat';
    } else if (cell === DOG) {
      baseClass += 'piece-dog';
    } else {
      baseClass += 'bg-transparent';
    }

    // Winning piece animation
    if (isWinningPosition(row, col)) {
      baseClass += ' winner-pulse';
    }

    return baseClass;
  };

  return (
    <div className="relative">
      {/* Column hover beams */}
      {isPlayerTurn && currentPlayer === CAT && (
        <div className="absolute -top-4 left-0 right-0 h-4 flex pointer-events-none">
          {Array.from({ length: COLS }).map((_, col) => (
            <div
              key={col}
              className={`flex-1 mx-0.5 rounded-t transition-opacity duration-200 ${
                hoveredColumn === col
                  ? 'bg-gradient-to-t from-neon-purple/50 to-transparent opacity-100'
                  : 'opacity-0'
              }`}
            />
          ))}
        </div>
      )}

      {/* Board grid */}
      <div
        className="glass rounded-2xl p-4 relative overflow-hidden"
        onMouseLeave={() => onColumnHover && onColumnHover(null)}
      >
        {/* Grid cells */}
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: ROWS }).map((_, row) =>
            Array.from({ length: COLS }).map((_, col) => (
              <div
                key={`${row}-${col}`}
                onClick={() => onColumnClick(col)}
                onMouseEnter={() => onColumnHover && onColumnHover(col)}
                className={`
                  relative w-12 h-12 sm:w-14 sm:h-14 rounded-full
                  ${hoveredColumn === col && isPlayerTurn && currentPlayer === CAT && board[0][col] === EMPTY
                    ? 'cursor-pointer'
                    : ''}
                `}
              >
                {/* Column hover indicator */}
                {isColumnHovered(col) && board[0][col] === EMPTY && (
                  <div className="absolute inset-0 rounded-full bg-neon-purple/30 animate-pulse" />
                )}

                {/* Piece */}
                <div className={getPieceClass(board[row][col], row, col)}>
                  {board[row][col] && (
                    <div className="w-full h-full rounded-full" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Board overlay for disabled state */}
        {(!isPlayerTurn || winner) && (
          <div className="absolute inset-0 bg-transparent" />
        )}
      </div>

      {/* Column click indicators */}
      <div className="flex justify-center mt-2 gap-1 sm:gap-2">
        {Array.from({ length: COLS }).map((_, col) => (
          <button
            key={col}
            onClick={() => onColumnClick(col)}
            disabled={!isPlayerTurn || winner || board[0][col] !== null}
            className={`
              w-12 h-8 sm:w-14 sm:h-10 rounded-b-lg transition-all duration-200
              ${isPlayerTurn && !winner && board[0][col] === null
                ? 'bg-neon-purple/20 hover:bg-neon-purple/40 cursor-pointer'
                : 'bg-transparent cursor-not-allowed'}
            `}
          >
            <span className="text-white/50 text-xs font-mono">{col + 1}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
