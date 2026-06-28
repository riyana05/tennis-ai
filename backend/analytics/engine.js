
export function computeAnalytics(stats) {
  const errors = stats.unforcedErrors || {};
  const winners = stats.winners || {};

  const totalErrors = sum(Object.values(errors));
  const totalWinners = sum(Object.values(winners));

  // Per-shot error breakdown as % of total UE
  const errorBreakdownPct = {};
  for (const [shot, count] of Object.entries(errors)) {
    errorBreakdownPct[shot] = totalErrors > 0
      ? round((count / totalErrors) * 100)
      : 0;
  }

  // Per-shot winner breakdown
  const winnerBreakdownPct = {};
  for (const [shot, count] of Object.entries(winners)) {
    winnerBreakdownPct[shot] = totalWinners > 0
      ? round((count / totalWinners) * 100)
      : 0;
  }

  const winnerErrorRatio = totalErrors > 0
    ? round(totalWinners / totalErrors, 2)
    : totalWinners > 0 ? Infinity : 0;

  // Serve Win % — overall % of service points won
  const firstServeWinContribution = (stats.firstServeIn / 100) * (stats.firstServeWon / 100);
  const secondServeInPct = 100 - stats.firstServeIn;
  const secondServeWinContribution = (secondServeInPct / 100) * (stats.secondServeWon / 100);
  const serveWinPct = round((firstServeWinContribution + secondServeWinContribution) * 100);

  // Return Win %
  const returnWinPct = round(stats.returnPointsWon);

  // Break Point %
  const breakPointSavedPct = stats.breakPointsFaced > 0
    ? round((stats.breakPointsSaved / stats.breakPointsFaced) * 100)
    : 100;
  const breakPointConvertedPct = stats.breakPointsCreated > 0
    ? round((stats.breakPointsConverted / stats.breakPointsCreated) * 100)
    : 0;

  // Net play
  const netWinPct = stats.netPointsPlayed > 0
    ? round((stats.netPointsWon / stats.netPointsPlayed) * 100)
    : 0;

  // Double fault rate as % of total service points
  const doubleFaultPct = stats.totalServicePoints > 0
    ? round((stats.doubleFaults / stats.totalServicePoints) * 100)
    : 0;

  // Identify the dominant error category (the "leak")
  let biggestLeak = null;
  let biggestLeakPct = 0;
  for (const [shot, pct] of Object.entries(errorBreakdownPct)) {
    if (pct > biggestLeakPct) {
      biggestLeakPct = pct;
      biggestLeak = shot;
    }
  }

  return {
    serveWinPct,
    returnWinPct,
    breakPointSavedPct,
    breakPointConvertedPct,
    netWinPct,
    doubleFaultPct,
    totalWinners,
    totalErrors,
    winnerErrorRatio,
    errorBreakdownPct,
    winnerBreakdownPct,
    biggestLeak,
    biggestLeakPct,
    raw: stats
  };
}

function sum(arr) {
  return arr.reduce((a, b) => a + (Number(b) || 0), 0);
}

function round(n, decimals = 0) {
  if (!isFinite(n)) return n;
  const factor = Math.pow(10, decimals);
  return Math.round(n * factor) / factor;
}
