import React, { useState } from "react";
import Predictor from "./components/Predictor.jsx";
import Coach from "./components/Coach.jsx";

const TABS = [
  { id: "predict", label: "Match Predictor", emoji: "🎾" },
  { id: "coach", label: "AI Coach", emoji: "🏆" }
];

export default function App() {
  const [tab, setTab] = useState("predict");

  return (
    <div className="min-h-screen bg-[#1B3A2B] bg-court-lines font-body">
      <header className="border-b border-chalk/10">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl uppercase tracking-wider text-chalk">
              Match<span className="text-ace-500">Point</span> AI
            </h1>
            <p className="text-chalk/50 text-sm mt-1">
              Predict the match. Fix your game.
            </p>
          </div>
          <span className="hidden sm:inline-block scoreboard-digit text-clay-300 text-sm border border-chalk/15 rounded-full px-4 py-1">
            🎾 Court is open
          </span>
        </div>
      </header>

      <nav className="max-w-5xl mx-auto px-6 mt-6">
        <div className="flex gap-2 bg-ink/40 border border-chalk/10 rounded-full p-1 w-fit">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-2 rounded-full font-display uppercase tracking-wide text-sm transition
                ${tab === t.id
                  ? "bg-ace-500 text-ink"
                  : "text-chalk/60 hover:text-chalk"}`}
            >
              <span className="mr-2">{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {tab === "predict" ? <Predictor /> : <Coach />}
      </main>

      <footer className="max-w-5xl mx-auto px-6 py-8 text-chalk/30 text-xs">
        MatchPoint AI · Phase 1 Predictor + Phase 2 Coach 
      </footer>
    </div>
  );
}
