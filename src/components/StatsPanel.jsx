export default function StatsPanel({ stats, onReset }) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-bold">Statistics</h3>
        <button
          onClick={onReset}
          className="text-xs text-white/50 hover:text-white/80 transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="bg-black/20 rounded-lg p-2">
          <div className="text-white/50 text-xs">Games</div>
          <div className="text-white font-bold">{stats.totalGames}</div>
        </div>
        <div className="bg-black/20 rounded-lg p-2">
          <div className="text-white/50 text-xs">Best Streak</div>
          <div className="text-neon-pink font-bold">🔥 {stats.longestStreak}</div>
        </div>
        <div className="bg-black/20 rounded-lg p-2">
          <div className="text-white/50 text-xs">Wins</div>
          <div className="text-neon-purple font-bold">{stats.wins}</div>
        </div>
        <div className="bg-black/20 rounded-lg p-2">
          <div className="text-white/50 text-xs">Losses</div>
          <div className="text-neon-cyan font-bold">{stats.losses}</div>
        </div>
      </div>
    </div>
  );
}
