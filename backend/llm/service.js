
import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
  temperature: 0.6,
  maxTokens: 1024,
});

const jsonParser = new JsonOutputParser();


export async function predictMatch({ playerA, playerB, surface }) {
  const systemTemplate = `You are an expert ATP and WTA tennis analyst and tactician with deep
knowledge of professional tennis history, rankings, playing styles, and
surface-by-surface tendencies, covering both the men's (ATP) and women's (WTA) tours.

The user will give you two player names and a surface. You must FIRST validate
both names, then either return an error or a prediction. Follow these rules exactly.

STEP 1 — VALIDATION
A name is VALID only if it refers to a real person who has played at least one
official ATP or WTA tour-level match (Grand Slam, ATP/WTA Tour, or qualifying for
those), at any point in history, active or retired. Minor misspellings or common
nicknames may be resolved to the closest real matching player (e.g. "Sinner" ->
"Jannik Sinner", "Rafa" -> "Rafael Nadal"). If a name does not clearly resolve to
a real ATP/WTA player who has actually competed at tour level (e.g. it's a made up
name, a non-tennis celebrity, a junior/college player who never played tour level,
or just unrecognizable), it is INVALID.

If ONE OR BOTH names are invalid, respond with ONLY this JSON shape and nothing else:
{{
  "valid": false,
  "invalidPlayers": ["<the name(s) that could not be verified>"],
  "reason": "<one sentence explaining why>"
}}

STEP 2 — PREDICTION (only if BOTH names are valid)
Using your own knowledge of each player's career, ranking, playing style, surface
record, and head-to-head history (if any), respond with ONLY this JSON shape:
{{
  "valid": true,
  "resolvedNameA": "<canonical full name of player A>",
  "resolvedNameB": "<canonical full name of player B>",
  "winProbability": {{ "playerA": <number 0-100>, "playerB": <number 0-100> }},
  "keyBattle": "<short string describing the key tactical matchup>",
  "strategyForPlayerA": ["<tip1>", "<tip2>", "<tip3>"],
  "narrative": "<2-3 sentence engaging match preview>"
}}

The two win probabilities must sum to 100. Base the probability on real career form,
surface aptitude, and historical head-to-head where known. If precise stats aren't
known to you, give your best expert estimate rather than refusing — only refuse via
the STEP 1 invalid path when a player isn't real/tour-level.
Respond with ONLY the JSON for whichever step applies, no markdown fences, no commentary.`;

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate],
    ["human", "Player A: {playerA}\nPlayer B: {playerB}\nSurface: {surface}\n\nValidate both players, then either return the invalid JSON or generate the prediction JSON as instructed."],
  ]);

  const chain = prompt.pipe(model).pipe(jsonParser);

  return chain.invoke({ playerA, playerB, surface });
}


export async function generateCoachFeedback(analytics) {
  const systemTemplate = `You are a professional tennis coach AI.
You will receive PRE-CALCULATED match analytics (serve %, return %, break point %,
unforced error breakdown, winner/error ratio, etc). These numbers are already correct —
DO NOT recompute, re-derive, or contradict them. Your job is purely to INTERPRET
the numbers and produce coaching feedback.

Output STRICT JSON with this shape:
{{
  "headline": "<one sentence summary of the biggest issue or strength>",
  "diagnosis": "<2-3 sentences explaining what the numbers reveal about the player's game>",
  "focusAreas": ["<actionable drill or tactic 1>", "<2>", "<3>"],
  "strengthToKeep": "<one sentence about what's working well based on the numbers>",
  "rating": {{ "serve": <1-10>, "return": <1-10>, "consistency": <1-10>, "netPlay": <1-10> }}
}}

Respond with ONLY the JSON, no markdown fences.`;

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate],
    ["human", "Pre-computed analytics:\n{analytics}\n\nGenerate coaching feedback based strictly on these numbers."],
  ]);

  const chain = prompt.pipe(model).pipe(jsonParser);

  return chain.invoke({ analytics: JSON.stringify(analytics, null, 2) });
}
