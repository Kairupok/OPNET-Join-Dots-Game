export function loadStats() {
  const saved = localStorage.getItem('opnet-stats');
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    totalGames: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    playerStreak: 0,
    aiStreak: 0,
    longestStreak: 0
  };
}

export function saveStats(stats) {
  localStorage.setItem('opnet-stats', JSON.stringify(stats));
}

export function updateStats(result) {
  const stats = loadStats();
  stats.totalGames++;

  if (result === 'win') {
    stats.wins++;
    stats.playerStreak++;
    stats.aiStreak = 0;
    if (stats.playerStreak > stats.longestStreak) {
      stats.longestStreak = stats.playerStreak;
    }
  } else if (result === 'lose') {
    stats.losses++;
    stats.aiStreak++;
    stats.playerStreak = 0;
    if (stats.aiStreak > stats.longestStreak) {
      stats.longestStreak = stats.aiStreak;
    }
  } else {
    stats.draws++;
    stats.playerStreak = 0;
    stats.aiStreak = 0;
  }

  saveStats(stats);
  return stats;
}

export function resetStats() {
  const emptyStats = {
    totalGames: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    playerStreak: 0,
    aiStreak: 0,
    longestStreak: 0
  };
  saveStats(emptyStats);
  return emptyStats;
}
