import React, { useState } from "react";
import RatingBar from "./RatingBar.jsx";

const BASE_URL = import.meta.env.VITE_API_URL || '';
console.log("DEBUG: Current Backend URL is ->", BASE_URL || "EMPTY / BLANK");

const DEFAULT_STATS = {
  firstServeIn: 58,
  firstServeWon: 70,
  secondServeWon: 50,
  doubleFaults: 6,
  totalServicePoints: 80,
  returnPointsWon: 35,
  breakPointsFaced: 5,
  breakPointsSaved: 3,
  breakPointsCreated: 6,
  breakPointsConverted: 2,
  netPointsPlayed: 10,
  netPointsWon: 3,
  winners: { forehand: 12, backhand: 4, serve: 8, volley: 2 },
  unforcedErrors: { forehand: 9, backhand: 17, doubleFault: 6, volley: 3 }
};

const FIELD_LABELS = {
  firstServeIn: "1st Serve In (%)",
  firstServeWon: "1st Serve Pts Won (%)",
  secondServeWon: "2nd Serve Pts Won (%)",
  doubleFaults: "Double Faults",
  totalServicePoints: "Total Service Points",
  returnPointsWon: "Return Pts Won (%)",
  breakPointsFaced: "Break Points Faced",
  breakPointsSaved: "Break Points Saved",
  breakPointsCreated: "Break Points Created",
  breakPointsConverted: "Break Points Converted",
  netPointsPlayed: "Net Points Played",
  netPointsWon: "Net Points Won"
};

const SHOT_TYPES = ["forehand", "backhand", "serve", "volley", "overhead", "doubleFault"];

export default function Coach() {
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  function updateField(key, value) {
    setStats((s) => ({ ...s, [key]: Number(value) }));
  }

  function updateShot(category, shot, value) {
    setStats((s) => ({
      ...s,
      [category]: { ...s[category], [shot]: Number(value) }
    }));
  }

  async function handleAnalyze() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stats)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-ink/40 border border-chalk/10 rounded-xl p-6">
        <h2 className="font-display text-2xl uppercase tracking-wide mb-1 text-chalk">
          Match Stat Sheet
        </h2>
        <p className="text-chalk/50 text-sm mb-5">
          Enter your numbers — the analytics engine crunches them, then the AI coach reads the results.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.keys(FIELD_LABELS).map((key) => (
            <div key={key}>
              <label className="block text-xs uppercase tracking-widest text-chalk/60 mb-1">
                {FIELD_LABELS[key]}
              </label>
              <input
                type="number"
                value={stats[key]}
                onChange={(e) => updateField(key, e.target.value)}
                className="w-full bg-ink border border-chalk/20 rounded-md px-3 py-2 text-chalk scoreboard-digit focus:outline-none focus:ring-2 focus:ring-ace-500"
              />
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mt-6">
          <div>
            <h3 className="font-display uppercase tracking-wide text-sm text-ace-400 mb-3">
              Winners by Shot
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {SHOT_TYPES.filter((s) => s !== "doubleFault").map((shot) => (
                <div key={shot}>
                  <label className="block text-xs capitalize text-chalk/60 mb-1">{shot}</label>
                  <input
                    type="number"
                    value={stats.winners[shot] ?? 0}
                    onChange={(e) => updateShot("winners", shot, e.target.value)}
                    className="w-full bg-ink border border-chalk/20 rounded-md px-3 py-2 text-chalk scoreboard-digit focus:outline-none focus:ring-2 focus:ring-ace-500"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display uppercase tracking-wide text-sm text-clay-300 mb-3">
              Unforced Errors by Shot
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {SHOT_TYPES.map((shot) => (
                <div key={shot}>
                  <label className="block text-xs capitalize text-chalk/60 mb-1">{shot}</label>
                  <input
                    type="number"
                    value={stats.unforcedErrors[shot] ?? 0}
                    onChange={(e) => updateShot("unforcedErrors", shot, e.target.value)}
                    className="w-full bg-ink border border-chalk/20 rounded-md px-3 py-2 text-chalk scoreboard-digit focus:outline-none focus:ring-2 focus:ring-clay-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="mt-6 w-full md:w-auto px-8 py-3 rounded-full bg-clay-500 text-chalk font-display uppercase tracking-wider font-semibold hover:bg-clay-300 hover:text-ink transition disabled:opacity-50"
        >
          {loading ? "Crunching the numbers…" : "Get Coaching Feedback"}
        </button>

        {error && <p className="mt-3 text-clay-300 text-sm">⚠ {error}</p>}
      </div>

      {result && (
        <div className="space-y-6 animate-[fadeIn_0.4s_ease-out]">
          {/* Headline */}
          <div className="bg-ink/40 border border-chalk/10 rounded-xl p-6">
            <p className="text-xs uppercase tracking-widest text-chalk/50 mb-2">Coach's Take</p>
            <h3 className="font-display text-2xl text-chalk mb-3">{result.feedback.headline}</h3>
            <p className="text-chalk/80">{result.feedback.diagnosis}</p>
          </div>

          {/* Analytics grid */}
          <div className="bg-ink/40 border border-chalk/10 rounded-xl p-6">
            <h3 className="font-display uppercase tracking-wide text-sm text-ace-400 mb-4">
              Computed Analytics
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Stat label="Serve Win %" value={`${result.analytics.serveWinPct}%`} />
              <Stat label="Return Win %" value={`${result.analytics.returnWinPct}%`} />
              <Stat label="Break Pts Saved" value={`${result.analytics.breakPointSavedPct}%`} />
              <Stat label="Break Pts Converted" value={`${result.analytics.breakPointConvertedPct}%`} />
              <Stat label="Net Win %" value={`${result.analytics.netWinPct}%`} />
              <Stat label="Double Fault %" value={`${result.analytics.doubleFaultPct}%`} />
              <Stat label="Winners" value={result.analytics.totalWinners} />
              <Stat label="Unforced Errors" value={result.analytics.totalErrors} />
              <Stat
                label="Winner/Error Ratio"
                value={result.analytics.winnerErrorRatio}
                highlight
              />
            </div>

            {result.analytics.biggestLeak && (
              <div className="mt-5 p-4 rounded-lg bg-clay-900/40 border border-clay-500/40">
                <p className="text-clay-300 text-sm">
                  <span className="font-display uppercase tracking-wide">Biggest Leak: </span>
                  Your <span className="capitalize font-semibold">{result.analytics.biggestLeak}</span> is producing{" "}
                  <span className="scoreboard-digit font-semibold">{result.analytics.biggestLeakPct}%</span> of all unforced errors.
                </p>
              </div>
            )}
          </div>

          {/* Ratings */}
          <div className="bg-ink/40 border border-chalk/10 rounded-xl p-6">
            <h3 className="font-display uppercase tracking-wide text-sm text-chalk mb-4">
              Game Ratings
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <RatingBar label="Serve" value={result.feedback.rating.serve} />
              <RatingBar label="Return" value={result.feedback.rating.return} />
              <RatingBar label="Consistency" value={result.feedback.rating.consistency} />
              <RatingBar label="Net Play" value={result.feedback.rating.netPlay} />
            </div>
          </div>

          {/* Focus areas */}
          <div className="bg-ink/40 border border-chalk/10 rounded-xl p-6">
            <h3 className="font-display uppercase tracking-wide text-sm text-ace-400 mb-3">
              Focus Areas
            </h3>
            <ul className="space-y-2 mb-4">
              {result.feedback.focusAreas.map((f, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="font-display scoreboard-digit text-clay-300 w-6 shrink-0">{`0${i + 1}`}</span>
                  <span className="text-chalk/90">{f}</span>
                </li>
              ))}
            </ul>
            <p className="text-chalk/70 text-sm border-t border-chalk/10 pt-3">
              <span className="text-ace-400 font-semibold">Keep it up: </span>
              {result.feedback.strengthToKeep}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, highlight }) {
  return (
    <div className={`p-3 rounded-lg border ${highlight ? "border-ace-500 bg-ace-500/10" : "border-chalk/10"}`}>
      <p className="text-xs uppercase tracking-widest text-chalk/50 mb-1">{label}</p>
      <p className="scoreboard-digit text-2xl font-semibold text-chalk">{value}</p>
    </div>
  );
}
