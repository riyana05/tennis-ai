import React from "react";

export default function ProbabilityBar({ nameA, nameB, pctA, pctB }) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-2 font-display uppercase tracking-wide text-sm">
        <span className="text-ace-400">{nameA}</span>
        <span className="text-clay-300">{nameB}</span>
      </div>
      <div className="flex h-12 rounded-md overflow-hidden border border-chalk/20">
        <div
          className="bg-ace-500 flex items-center justify-start px-3 transition-all duration-700 ease-out"
          style={{ width: `${pctA}%` }}
        >
          <span className="scoreboard-digit text-ink font-bold text-lg">{pctA}%</span>
        </div>
        <div
          className="bg-clay-500 flex items-center justify-end px-3 transition-all duration-700 ease-out"
          style={{ width: `${pctB}%` }}
        >
          <span className="scoreboard-digit text-chalk font-bold text-lg">{pctB}%</span>
        </div>
      </div>
    </div>
  );
}
