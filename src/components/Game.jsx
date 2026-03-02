import { useState, useEffect, useCallback } from 'react';
import Board from './Board';
import ThinkingPanel from './ThinkingPanel';
import DifficultySelect from './DifficultySelect';
import ResultScreen from './ResultScreen';
import StatsPanel from './StatsPanel';
import {
  createBoard,
  dropPiece,
  checkWinner,
  checkDraw,
  getNextRow,
  CAT,
  DOG,
  ROWS,
  COLS
} from '../utils/gameLogic';
import { getAIMove, getThinkingTime, DIFFICULTY } from '../utils/ai';
import { loadStats, updateStats, resetStats } from '../utils/stats';

export default function Game() {
  const [gameState, setGameState] = useState('menu'); // menu, playing, result
  const [board, setBoard] = useState(createBoard());
  const [currentPlayer, setCurrentPlayer] = useState(CAT);
  const [winner, setWinner] = useState(null);
  const [winningPositions, setWinningPositions] = useState(null);
  const [difficulty, setDifficulty] = useState(DIFFICULTY.MEDIUM);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [hoveredColumn, setHoveredColumn] = useState(null);
  const [aiReasoning, setAiReasoning] = useState([]);
  const [round, setRound] = useState(1);
  const [stats, setStats] = useState(loadStats());

  // Handle player move
  const handleColumnClick = useCallback((col) => {
    if (isAnimating || isThinking || winner || currentPlayer !== CAT) return;
    if (board[0][col] !== EMPTY) return;

    setIsAnimating(true);

    // Drop piece
    const result = dropPiece(board, col, CAT);
    if (result) {
      setBoard(result.board);

      // Check for win
      const winResult = checkWinner(result.board);
      if (winResult) {
        setWinner(CAT);
        setWinningPositions(winResult.positions);
        const newStats = updateStats('win');
        setStats(newStats);
        setGameState('result');
        setIsAnimating(false);
        return;
      }

      // Check for draw
      if (checkDraw(result.board)) {
        setWinner('draw');
        const newStats = updateStats('draw');
        setStats(newStats);
        setGameState('result');
        setIsAnimating(false);
        return;
      }

      // Switch to AI
      setCurrentPlayer(DOG);
      setIsThinking(true);
      setIsAnimating(false);
      setRound(prev => prev + 1);
    }
  }, [board, currentPlayer, isAnimating, isThinking, winner]);

  // AI turn
  useEffect(() => {
    if (currentPlayer === DOG && !winner && !isAnimating) {
      const thinkingTime = getThinkingTime(difficulty);

      setTimeout(() => {
        const aiResult = getAIMove(board, difficulty);

        if (aiResult) {
          setAiReasoning(aiResult.reasoning);

          const moveResult = dropPiece(board, aiResult.column, DOG);
          if (moveResult) {
            setBoard(moveResult.board);

            const winResult = checkWinner(moveResult.board);
            if (winResult) {
              setWinner(DOG);
              setWinningPositions(winResult.positions);
              const newStats = updateStats('lose');
              setStats(newStats);
              setGameState('result');
              setIsThinking(false);
              return;
            }

            if (checkDraw(moveResult.board)) {
              setWinner('draw');
              const newStats = updateStats('draw');
              setStats(newStats);
              setGameState('result');
              setIsThinking(false);
              return;
            }

            setCurrentPlayer(CAT);
            setIsThinking(false);
          }
        }
      }, thinkingTime);
    }
  }, [currentPlayer, board, difficulty, winner, isAnimating]);

  // Start game with difficulty
  const handleDifficultySelect = (diff) => {
    setDifficulty(diff);
    setBoard(createBoard());
    setCurrentPlayer(CAT);
    setWinner(null);
    setWinningPositions(null);
    setIsAnimating(false);
    setIsThinking(false);
    setAiReasoning([]);
    setRound(1);
    setGameState('playing');
  };

  // Play again
  const handlePlayAgain = () => {
    setBoard(createBoard());
    setCurrentPlayer(CAT);
    setWinner(null);
    setWinningPositions(null);
    setIsAnimating(false);
    setIsThinking(false);
    setAiReasoning([]);
    setRound(1);
    setGameState('playing');
  };

  // Change difficulty
  const handleChangeDifficulty = () => {
    setGameState('menu');
  };

  // Reset stats
  const handleResetStats = () => {
    setStats(resetStats());
  };

  // Handle hover
  const handleColumnHover = (col) => {
    setHoveredColumn(col);
  };

  const handleColumnLeave = () => {
    setHoveredColumn(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-4 sm:p-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-center bg-gradient-to-r from-neon-purple via-neon-pink to-neon-cyan bg-clip-text text-transparent">
            OPNET — Join Dots
          </h1>
          <p className="text-center text-white/50 text-sm mt-1">
            Cat 🐱 vs Dog 🐶 — Connect Four
          </p>
        </header>

        {/* Game content */}
        <main className="flex-1 flex items-center justify-center p-4">
          {gameState === 'menu' && (
            <DifficultySelect
              onSelect={handleDifficultySelect}
              currentStreak={stats.playerStreak}
            />
          )}

          {gameState === 'playing' && (
            <div className="w-full max-w-4xl">
              <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
                {/* Game board */}
                <div className="flex-1 flex flex-col items-center"
                     onMouseLeave={handleColumnLeave}>
                  {/* Status */}
                  <div className="mb-4 text-center">
                    {winner ? (
                      <span className={`text-xl font-bold ${
                        winner === CAT ? 'text-neon-purple' :
                        winner === DOG ? 'text-neon-cyan' : 'text-gray-400'
                      }`}>
                        {winner === CAT ? '🐱 Cat Wins!' :
                         winner === DOG ? '🐶 Dog Wins!' : '⚖️ Draw!'}
                      </span>
                    ) : (
                      <span className="text-xl">
                        {currentPlayer === CAT ? (
                          <span className="text-neon-purple">🐱 Your Turn</span>
                        ) : (
                          <span className="text-neon-cyan">🐶 AI Thinking...</span>
                        )}
                      </span>
                    )}
                  </div>

                  <div
                    onMouseLeave={() => setHoveredColumn(null)}
                  >
                    <Board
                      board={board}
                      onColumnClick={handleColumnClick}
                      winner={winner}
                      winningPositions={winningPositions}
                      currentPlayer={currentPlayer}
                      isPlayerTurn={currentPlayer === CAT && !isThinking && !winner}
                      hoveredColumn={hoveredColumn}
                    />
                  </div>
                </div>

                {/* Right panel */}
                <div className="w-full lg:w-80 flex flex-col gap-4">
                  {/* Thinking panel */}
                  <ThinkingPanel
                    isThinking={isThinking}
                    reasoning={aiReasoning}
                    round={round}
                    board={board}
                  />

                  {/* Stats panel */}
                  <StatsPanel
                    stats={stats}
                    onReset={handleResetStats}
                  />
                </div>
              </div>
            </div>
          )}

          {gameState === 'result' && (
            <ResultScreen
              result={winner === CAT ? 'win' : winner === DOG ? 'lose' : 'draw'}
              onPlayAgain={handlePlayAgain}
              onChangeDifficulty={handleChangeDifficulty}
              stats={stats}
            />
          )}
        </main>
      </div>
    </div>
  );
}
