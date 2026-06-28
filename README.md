# 🎾 MatchPoint AI

An AI Tennis Match Predictor + Tactician (Phase 1) and an AI Tennis Coach (Phase 2).

matchpoint-ai/
├── backend/      Node.js + Express API (analytics engine + LangChain LLM calls)
└── frontend/     React + Tailwind UI (court-themed)

## How it works

Phase 1 — Match Predictor + Tactician
1. Pick two players + a surface in the UI.
2. Backend sends the names and surface to the LLM via a LangChain chain, which:
   - Validates that both are real ATP/WTA tour-level players
   - Returns win probability, key tactical battle, strategy tips, and a short preview.

Phase 2 — AI Coach
1. Enter a match stat sheet (serve %, errors by shot type, etc.) in the UI.
2. Backend's analytics engine (`analytics/engine.js`) computes ALL
   numbers itself — serve win %, return win %, break point %, winner/error
   ratio, error breakdown by shot, biggest "leak", etc.
3. Only the *computed* results are sent to the LLM via LangChain. The LLM never does math
   — it interprets the numbers and returns a headline, diagnosis, focus
   areas, and 1–10 ratings.
```
Stats → Analytics Engine (backend, pure math) → LangChain chain → LLM → Coach Feedback


## LangChain architecture

`llm/service.js` uses the following LangChain primitives:

| Component | Package | Purpose |
|---|---|---|
| `ChatGroq` | `@langchain/groq` | Chat model backed by Groq's API |
| `ChatPromptTemplate` | `@langchain/core/prompts` | Structured system + human prompt assembly |
| `JsonOutputParser` | `@langchain/core/output_parsers` | Auto-parses JSON from model output |

Each LLM call is a simple chain: `prompt | model | jsonParser`.

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env and add your GROQ_API_KEY (get one at console.groq.com)
npm start
```

Runs on `http://localhost:4000`.

> Default model is `llama-3.3-70b-versatile`. Swap `GROQ_MODEL` in `.env` for any other

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173` and proxies `/api/*` to the backend.

## Using the app

### Match Predictor tab
1. Choose Player A, Player B, and a surface (Clay / Hard / Grass).
2. Click **Predict Match**.
3. You'll get:
   - A win-probability bar (green vs. terracotta)
   - A one-line "Key Battle" matchup
   - 3 strategy tips for Player A
   - A short match preview

### AI Coach tab
1. Fill in your match stat sheet:
   - Serve %, double faults, return %, break points
   - Winners by shot type (forehand / backhand / serve / volley)
   - Unforced errors by shot type (+ double faults)
2. Click **Get Coaching Feedback**.
3. You'll get:
   - **Computed Analytics** — serve win %, return win %, break point %,
     winner/error ratio, and your "biggest leak"
   - **Game Ratings** — serve / return / consistency / net play, 1–10
   - **Focus Areas** — 3 actionable drills based on your numbers
   - A note on what's already working

