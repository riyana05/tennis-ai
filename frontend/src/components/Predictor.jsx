import React, { useState } from "react";
import ProbabilityBar from "./ProbabilityBar.jsx";

const BASE_URL = 'https://tennis-backend-y0jn.onrender.com';

const SURFACES = [
  { id: "Clay", label: "Clay", swatch: "bg-clay-500" },
  { id: "Hard", label: "Hard", swatch: "bg-blue-500" },
  { id: "Grass", label: "Grass", swatch: "bg-ace-500" }
];

export default function Predictor() {
  const [playerA, setPlayerA] = useState("");
  const [playerB, setPlayerB] = useState("");
  const [surface, setSurface] = useState("Clay");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handlePredict() {
    const nameA = playerA.trim();
    const nameB = playerB.trim();

    if (!nameA || !nameB) {
      setError("Enter both player names.");
      return;
    }
    if (nameA.toLowerCase() === nameB.toLowerCase()) {
      setError("Pick two different players — this isn't a mirror match.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerA: nameA, playerB: nameB, surface })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Prediction failed");
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
        <h2 className="font-display text-2xl uppercase tracking-wide mb-4 text-chalk">
          Set the Match
        </h2>
        <p className="text-chalk/50 text-sm mb-4">
          Enter any two ATP or WTA players, past or present.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-chalk/60 mb-1">
              Player A
            </label>
            <input
              type="text"
              value={playerA}
              onChange={(e) => setPlayerA(e.target.value)}
              placeholder="e.g. Carlos Alcaraz"
              className="w-full bg-ink border border-chalk/20 rounded-md px-3 py-2 text-chalk placeholder:text-chalk/30 focus:outline-none focus:ring-2 focus:ring-ace-500"
            />
          </div>

          <div className="flex items-end justify-center">
            <span className="font-display text-3xl text-clay-300 pb-2">VS</span>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-chalk/60 mb-1">
              Player B
            </label>
            <input
              type="text"
              value={playerB}
              onChange={(e) => setPlayerB(e.target.value)}
              placeholder="e.g. Iga Swiatek"
              className="w-full bg-ink border border-chalk/20 rounded-md px-3 py-2 text-chalk placeholder:text-chalk/30 focus:outline-none focus:ring-2 focus:ring-clay-500"
            />
          </div>
        </div>

        <div className="mt-5">
          <label className="block text-xs uppercase tracking-widest text-chalk/60 mb-2">
            Surface
          </label>
          <div className="flex gap-3">
            {SURFACES.map((s) => (
              <button
                key={s.id}
                onClick={() => setSurface(s.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition
                  ${surface === s.id
                    ? "border-chalk bg-chalk/10 text-chalk"
                    : "border-chalk/20 text-chalk/50 hover:text-chalk/80 hover:border-chalk/40"}`}
              >
                <span className={`w-3 h-3 rounded-full ${s.swatch}`} />
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handlePredict}
          disabled={loading || !playerA.trim() || !playerB.trim()}
          className="mt-6 w-full md:w-auto px-8 py-3 rounded-full bg-ace-500 text-ink font-display uppercase tracking-wider font-semibold hover:bg-ace-400 transition disabled:opacity-50"
        >
          {loading ? "Reading the court…" : "Predict Match"}
        </button>

        {error && (
          <p className="mt-3 text-clay-300 text-sm">⚠ {error}</p>
        )}
      </div>

      {result && (
        <div className="bg-ink/40 border border-chalk/10 rounded-xl p-6 space-y-6 animate-[fadeIn_0.4s_ease-out]">
          <div>
            <p className="text-xs uppercase tracking-widest text-chalk/50 mb-1">
              {result.matchup} · {result.surface} Court
            </p>
            <h3 className="font-display text-xl text-chalk">Win Probability</h3>
          </div>

          <ProbabilityBar
            nameA={result.matchup.split(" vs ")[0]}
            nameB={result.matchup.split(" vs ")[1]}
            pctA={result.winProbability.playerA}
            pctB={result.winProbability.playerB}
          />

          {result.narrative && (
            <p className="text-chalk/80 italic border-l-2 border-ace-500 pl-4">
              {result.narrative}
            </p>
          )}

          <div>
            <h4 className="font-display uppercase tracking-wide text-sm text-clay-300 mb-2">
              Key Battle
            </h4>
            <p className="text-chalk text-lg">{result.keyBattle}</p>
          </div>

          <div>
            <h4 className="font-display uppercase tracking-wide text-sm text-ace-400 mb-2">
              Recommended Strategy
            </h4>
            <ul className="space-y-2">
              {result.strategyForPlayerA?.map((tip, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="mt-1 w-2 h-2 rounded-full bg-ace-500 shrink-0" />
                  <span className="text-chalk/90">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
