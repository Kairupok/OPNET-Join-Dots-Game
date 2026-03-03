import { useState, useCallback, useEffect } from 'react';
import Board from './components/Board';
import DifficultySelect from './components/DifficultySelect';
import ThinkingPanel from './components/ThinkingPanel';
import ResultScreen from './components/ResultScreen';
import StatsPanel from './components/StatsPanel';
import { createBoard, dropPiece, checkWinner, checkDraw, getNextRow, CAT, DOG } from './utils/gameLogic';
import { getAIMove, getThinkingTime, DIFFICULTY } from './utils/ai';
import { loadStats, updateStats, resetStats } from './utils/stats';

function App() {
  const [gameState, setGameState] = useState('difficulty'); // difficulty, playing, result
  const [board, setBoard] = useState(createBoard());
  const [currentPlayer, setCurrentPlayer] = useState(CAT);
  const [difficulty, setDifficulty] = useState(DIFFICULTY.MEDIUM);
  const [winner, setWinner] = useState(null);
  const [winningPositions, setWinningPositions] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const [aiReasoning, setAiReasoning] = useState([]);
  const [round, setRound] = useState(1);
  const [hoveredColumn, setHoveredColumn] = useState(null);
  const [stats, setStats] = useState(loadStats());
  const [lastDroppedPosition, setLastDroppedPosition] = useState(null);

  // Reset game
  const resetGame = useCallback(() => {
    setBoard(createBoard());
    setCurrentPlayer(CAT);
    setWinner(null);
    setWinningPositions(null);
    setIsThinking(false);
    setAiReasoning([]);
    setRound(1);
    setHoveredColumn(null);
    setLastDroppedPosition(null);
  }, []);

  // Handle difficulty selection
  const handleDifficultySelect = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    resetGame();
    setGameState('playing');
  };

  // Handle column click
  const handleColumnClick = useCallback((col) => {
    if (gameState !== 'playing' || isThinking || winner || currentPlayer !== CAT) return;
    if (board[0][col] !== null) return; // Column full

    // Drop player's piece
    const result = dropPiece(board, col, CAT);
    if (!result) return;

    setBoard(result.board);
    setLastDroppedPosition({ row: result.row, col });

    // Check for win
    const winResult = checkWinner(result.board);
    if (winResult) {
      setWinner(CAT);
      setWinningPositions(winResult.positions);
      const newStats = updateStats('win');
      setStats(newStats);
      // Delay showing result to let win animation play
      setTimeout(() => setGameState('result'), 1500);
      return;
    }

    // Check for draw
    if (checkDraw(result.board)) {
      setWinner('draw');
      const newStats = updateStats('draw');
      setStats(newStats);
      setGameState('result');
      return;
    }

    // Switch to AI turn
    setCurrentPlayer(DOG);
    setIsThinking(true);
  }, [gameState, isThinking, winner, currentPlayer, board]);

  // AI turn
  useEffect(() => {
    if (currentPlayer === DOG && gameState === 'playing' && !winner) {
      const thinkingTime = getThinkingTime(difficulty);

      setTimeout(() => {
        const aiResult = getAIMove(board, difficulty);
        if (aiResult === null) return;

        setAiReasoning(aiResult.reasoning);

        // Small delay to show reasoning
        setTimeout(() => {
          const result = dropPiece(board, aiResult.column, DOG);
          if (!result) return;

          setBoard(result.board);
          setLastDroppedPosition({ row: result.row, col: aiResult.column });

          // Check for win
          const winResult = checkWinner(result.board);
          if (winResult) {
            setWinner(DOG);
            setWinningPositions(winResult.positions);
            const newStats = updateStats('lose');
            setStats(newStats);
            // Delay showing result to let win animation play
            setTimeout(() => setGameState('result'), 1500);
            return;
          }

          // Check for draw
          if (checkDraw(result.board)) {
            setWinner('draw');
            const newStats = updateStats('draw');
            setStats(newStats);
            setGameState('result');
            return;
          }

          // Switch back to player
          setCurrentPlayer(CAT);
          setRound(prev => prev + 1);
          setIsThinking(false);
        }, 500);
      }, thinkingTime);
    }
  }, [currentPlayer, gameState, winner, board, difficulty]);

  // Handle play again
  const handlePlayAgain = () => {
    resetGame();
    setGameState('playing');
  };

  // Handle change difficulty
  const handleChangeDifficulty = () => {
    resetGame();
    setGameState('difficulty');
  };

  // Handle stats reset
  const handleResetStats = () => {
    setStats(resetStats());
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center px-4 py-8">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-5xl sm:text-7xl font-black bg-gradient-to-r from-neon-purple via-neon-pink to-neon-cyan bg-clip-text text-transparent drop-shadow-lg mb-4 tracking-wider title-glow" style={{ fontFamily: '"Press Start 2P", cursive' }}>
            OPNET
          </h1>
          <p className="text-white/80 text-lg sm:text-xl font-medium" style={{ fontFamily: '"Russo One", sans-serif' }}>Join Dots • Cat vs AI</p>
        </header>

        {/* Difficulty Selection */}
        {gameState === 'difficulty' && (
          <DifficultySelect
            onSelect={handleDifficultySelect}
            currentStreak={stats.playerStreak}
          />
        )}

        {/* Game Board */}
        {gameState === 'playing' && (
          <div className="w-full max-w-4xl">
            {/* Game info */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className={`text-2xl ${currentPlayer === CAT && !winner ? 'animate-bounce' : ''}`}>
                  {currentPlayer === CAT ? '🐱' : '🐶'}
                </span>
                <span className="text-white font-bold">
                  {currentPlayer === CAT ? 'Your Turn' : 'AI Thinking...'}
                </span>
              </div>
              <div className="text-white/50 text-sm">
                {difficulty === DIFFICULTY.EASY && '🐶 Playful Pup'}
                {difficulty === DIFFICULTY.MEDIUM && '🦊 Street Smart'}
                {difficulty === DIFFICULTY.HARD && '🤖 Cyber Strategist'}
              </div>
            </div>

            {/* Main game area */}
            <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
              {/* Board */}
              <div className="flex-1 flex justify-center">
                <Board
                  board={board}
                  onColumnClick={handleColumnClick}
                  winner={winner}
                  winningPositions={winningPositions}
                  currentPlayer={currentPlayer}
                  isPlayerTurn={currentPlayer === CAT}
                  hoveredColumn={hoveredColumn}
                  onColumnHover={setHoveredColumn}
                  lastDroppedPosition={lastDroppedPosition}
                />
              </div>

              {/* Side panel */}
              <div className="w-full lg:w-80 flex flex-col gap-4">
                <ThinkingPanel
                  isThinking={isThinking}
                  reasoning={aiReasoning}
                  round={round}
                  board={board}
                />
                <StatsPanel stats={stats} onReset={handleResetStats} />
              </div>
            </div>
          </div>
        )}

        {/* Result Screen */}
        {gameState === 'result' && (
          <ResultScreen
            result={winner === CAT ? 'win' : winner === DOG ? 'lose' : 'draw'}
            onPlayAgain={handlePlayAgain}
            onChangeDifficulty={handleChangeDifficulty}
            stats={stats}
          />
        )}
      </div>
    </div>
  );
}

export default App;
