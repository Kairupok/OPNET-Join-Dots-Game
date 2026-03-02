export default function ResultScreen({ result, onPlayAgain, onChangeDifficulty, stats }) {
  const getResultContent = () => {
    switch (result) {
      case 'win':
        return {
          title: 'Cat Outsmarted the Dog!',
          emoji: '🐱',
          color: 'from-neon-purple to-neon-pink',
          message: 'Your strategic brilliance prevailed!'
        };
      case 'lose':
        return {
          title: 'Dog Calculated the Win!',
          emoji: '🐶',
          color: 'from-neon-cyan to-neon-blue',
          message: 'The AI was too clever this time...'
        };
      case 'draw':
        return {
          title: 'Stalemate',
          emoji: '⚖️',
          color: 'from-gray-400 to-gray-600',
          message: 'Even brilliance has limits.'
        };
      default:
        return null;
    }
  };

  const content = getResultContent();
  if (!content) return null;

  return (
    <div className="glass rounded-2xl p-6 sm:p-8 text-center animate-fade-in">
      <div className="text-6xl mb-4">{content.emoji}</div>
      <h2 className={`text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r ${content.color} bg-clip-text text-transparent`}>
        {content.title}
      </h2>
      <p className="text-white/70 mb-6">{content.message}</p>

      {/* Stats summary */}
      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div className="bg-black/20 rounded-lg p-3">
          <div className="text-white/50">Wins</div>
          <div className="text-2xl font-bold text-neon-purple">{stats.wins}</div>
        </div>
        <div className="bg-black/20 rounded-lg p-3">
          <div className="text-white/50">Losses</div>
          <div className="text-2xl font-bold text-neon-cyan">{stats.losses}</div>
        </div>
        <div className="bg-black/20 rounded-lg p-3">
          <div className="text-white/50">Draws</div>
          <div className="text-2xl font-bold text-gray-400">{stats.draws}</div>
        </div>
        <div className="bg-black/20 rounded-lg p-3">
          <div className="text-white/50">Streak</div>
          <div className="text-2xl font-bold text-neon-pink">🔥 {stats.playerStreak}</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onPlayAgain}
          className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink
                     hover:scale-105 transition-transform font-bold text-white"
        >
          Play Again
        </button>
        <button
          onClick={onChangeDifficulty}
          className="flex-1 py-3 px-6 rounded-xl bg-white/10 hover:bg-white/20
                     transition-colors font-bold text-white"
        >
          Change Difficulty
        </button>
      </div>
    </div>
  );
}
