import { CAT, DOG } from '../utils/gameLogic';

export default function DifficultySelect({ onSelect, currentStreak }) {
  const difficulties = [
    {
      id: 'easy',
      name: 'Easy',
      subname: 'Playful Pup',
      emoji: '🐶',
      description: '40% random moves, casual gameplay',
      color: 'from-green-400 to-emerald-600'
    },
    {
      id: 'medium',
      name: 'Medium',
      subname: 'Street Smart',
      emoji: '🦊',
      description: 'Blocks wins, 2-move lookahead',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      id: 'hard',
      name: 'Hard',
      subname: 'Cyber Strategist',
      emoji: '🤖',
      description: 'Minimax algorithm depth 5',
      color: 'from-red-500 to-pink-600'
    }
  ];

  return (
    <div className="glass rounded-2xl p-6 sm:p-8 max-w-md mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
        Choose Difficulty
      </h2>
      {currentStreak > 0 && (
        <p className="text-center text-neon-cyan mb-6">🔥 Win Streak: {currentStreak}</p>
      )}

      <div className="space-y-4">
        {difficulties.map((diff) => (
          <button
            key={diff.id}
            onClick={() => onSelect(diff.id)}
            className={`
              w-full p-4 rounded-xl transition-all duration-300
              bg-gradient-to-r ${diff.color}
              hover:scale-105 hover:shadow-lg
              flex items-center gap-4
            `}
          >
            <span className="text-3xl">{diff.emoji}</span>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h3 className="text-white font-bold text-lg">{diff.name}</h3>
                <span className="text-white/80 font-medium">- {diff.subname}</span>
              </div>
              <p className="text-white/70 text-sm">{diff.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
