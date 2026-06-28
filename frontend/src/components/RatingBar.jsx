import React from "react";

export default function RatingBar({ label, value, max = 10 }) {
  const pct = Math.round((value / max) * 100);
  const color =
    value >= 7 ? "bg-ace-500" : value >= 4 ? "bg-clay-300" : "bg-clay-500";

  return (
    <div>
      <div className="flex justify-between text-xs uppercase tracking-widest text-chalk/60 mb-1">
        <span>{label}</span>
        <span className="scoreboard-digit">{value}/10</span>
      </div>
      <div className="h-2 rounded-full bg-chalk/10 overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
