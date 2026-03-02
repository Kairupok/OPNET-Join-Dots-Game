import { useState, useEffect } from 'react';
import { boardToAscii, ROWS, COLS } from '../utils/gameLogic';

export default function ThinkingPanel({ isThinking, reasoning, round, board }) {
  const [displayedReasoning, setDisplayedReasoning] = useState([]);
  const [currentLine, setCurrentLine] = useState('');

  useEffect(() => {
    if (!reasoning || reasoning.length === 0) {
      setDisplayedReasoning([]);
      setCurrentLine('');
      return;
    }

    setDisplayedReasoning([]);
    setCurrentLine('');

    let lineIndex = 0;
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      if (lineIndex >= reasoning.length) {
        clearInterval(typeInterval);
        return;
      }

      const currentText = reasoning[lineIndex];

      if (charIndex < currentText.length) {
        setCurrentLine(currentText.substring(0, charIndex + 1));
        charIndex++;
      } else {
        setDisplayedReasoning(prev => [...prev, currentText]);
        setCurrentLine('');
        lineIndex++;
        charIndex = 0;
      }
    }, 30);

    return () => clearInterval(typeInterval);
  }, [reasoning]);

  return (
    <div className="glass rounded-2xl p-4 h-full min-h-[300px] flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-3 h-3 rounded-full ${isThinking ? 'bg-neon-cyan animate-pulse' : 'bg-gray-500'}`} />
        <h3 className="text-lg font-bold text-neon-cyan">
          {isThinking ? 'DOG (AI) is thinking...' : 'Ready'}
        </h3>
        <span className="text-white/50 text-sm ml-auto">Round {round}</span>
      </div>

      {/* Board preview */}
      <div className="flex-1 bg-black/30 rounded-lg p-2 font-mono text-xs mb-4 overflow-hidden">
        <pre className="text-neon-purple/70">
          {boardToAscii(board)}
        </pre>
      </div>

      {/* Reasoning display */}
      <div className="space-y-1">
        {displayedReasoning.map((line, i) => (
          <p key={i} className="text-white/80 text-sm font-mono animate-fade-in">
            {line}
          </p>
        ))}
        {currentLine && (
          <p className="text-white/80 text-sm font-mono">
            {currentLine}
            <span className="animate-pulse">▋</span>
          </p>
        )}
        {!isThinking && displayedReasoning.length === 0 && !currentLine && (
          <p className="text-white/50 text-sm italic">Waiting for move...</p>
        )}
      </div>
    </div>
  );
}
