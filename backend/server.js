// server.js
import express from "express";
import cors from "cors";
import "dotenv/config";

import { computeAnalytics } from "./analytics/engine.js";
import { predictMatch, generateCoachFeedback } from "./llm/service.js";

const app = express();
app.use(cors());
app.use(express.json());

const express = require('express');
const cors = require('cors'); // 1. Import cors

// Optional: Add this if you want to fix the "Cannot GET /" message:
app.get('/', (req, res) => {
  res.send('MatchPoint AI Backend is running smoothly!');
});

// ---------- PHASE 1: Match Predictor ----------
// Players are now free text — any ATP or WTA player name, not a fixed
// roster. The Groq LLM itself verifies the player has real tour-level
// history and produces the prediction from its own knowledge.

app.post("/api/predict", async (req, res) => {
  try {
    const { playerA, playerB, surface } = req.body;

    const nameA = (playerA || "").trim();
    const nameB = (playerB || "").trim();

    if (!nameA || !nameB || !surface) {
      return res.status(400).json({ error: "playerA, playerB, and surface are required" });
    }
    if (!["Clay", "Hard", "Grass"].includes(surface)) {
      return res.status(400).json({ error: "surface must be Clay, Hard, or Grass" });
    }
    if (nameA.toLowerCase() === nameB.toLowerCase()) {
      return res.status(400).json({ error: "Player A and Player B must be different players" });
    }

    const result = await predictMatch({ playerA: nameA, playerB: nameB, surface });

    if (result.valid === false) {
      const invalid = result.invalidPlayers?.join(", ") || `${nameA} / ${nameB}`;
      return res.status(404).json({
        error: result.reason ||
          `${invalid} could not be verified as a player who has played an ATP or WTA tour-level match.`
      });
    }

    res.json({
      matchup: `${result.resolvedNameA || nameA} vs ${result.resolvedNameB || nameB}`,
      surface,
      ...result
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------- PHASE 2: AI Coach ----------

app.post("/api/coach", async (req, res) => {
  try {
    const stats = req.body;

    // Basic validation
    const required = [
      "firstServeIn", "firstServeWon", "secondServeWon", "doubleFaults",
      "totalServicePoints", "returnPointsWon",
      "breakPointsFaced", "breakPointsSaved",
      "breakPointsCreated", "breakPointsConverted",
      "netPointsPlayed", "netPointsWon"
    ];
    for (const field of required) {
      if (stats[field] === undefined) {
        return res.status(400).json({ error: `Missing field: ${field}` });
      }
    }
    if (!stats.unforcedErrors || !stats.winners) {
      return res.status(400).json({ error: "winners and unforcedErrors objects are required" });
    }

    // Step 1: backend computes ALL stats (analytics engine)
    const analytics = computeAnalytics(stats);

    // Step 2: LLM interprets pre-computed analytics into coaching feedback
    const feedback = await generateCoachFeedback(analytics);

    res.json({ analytics, feedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🎾 Tennis AI backend running on port ${PORT}`));
