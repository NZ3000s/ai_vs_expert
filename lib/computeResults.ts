import { EXPERIMENT_ROUNDS, TOTAL_ROUNDS } from "@/data/experiments";
import type { Prediction, RoundRecord } from "@/lib/types";

export type InterpretationKind =
  | "empty"
  | "expertHeavy"
  | "aiHeavy"
  | "balanced";

export type ResultsSummary = {
  user: {
    score: number;
    totalRounds: number;
    accuracyPct: number;
  };
  trust: {
    pctExpert: number;
    pctAi: number;
    expertFollows: number;
    aiFollows: number;
  };
  sources: {
    expertAccuracyPct: number;
    aiAccuracyPct: number;
  };
  /** For localized copy via i18n (`main.results.interpretation.*`). */
  interpretationKind: InterpretationKind;
};

function userPredictionForRound(r: RoundRecord): Prediction {
  return r.followed_source === "Expert"
    ? r.expert_prediction
    : r.ai_prediction;
}

/** Whether the participant's followed source was correct vs outcome. */
function roundUserCorrect(r: RoundRecord): boolean {
  return userPredictionForRound(r) === r.outcome;
}

export function computeResultsSummary(records: RoundRecord[]): ResultsSummary {
  const totalRounds = records.length;

  let score = 0;
  let expertFollows = 0;
  for (const r of records) {
    if (roundUserCorrect(r)) score += 1;
    if (r.followed_source === "Expert") expertFollows += 1;
  }

  const aiFollows = totalRounds - expertFollows;
  const denom = totalRounds > 0 ? totalRounds : 1;
  const pctExpert = (expertFollows / denom) * 100;
  const pctAi = (aiFollows / denom) * 100;

  let expertWins = 0;
  let aiWins = 0;
  for (const row of EXPERIMENT_ROUNDS) {
    if (row.expert.prediction === row.outcome) expertWins += 1;
    if (row.ai.prediction === row.outcome) aiWins += 1;
  }

  const expertAccuracyPct = (expertWins / TOTAL_ROUNDS) * 100;
  const aiAccuracyPct = (aiWins / TOTAL_ROUNDS) * 100;

  const interpretationKind: InterpretationKind =
    totalRounds === 0 ? "empty" : interpretTrustKind(pctExpert);

  return {
    user: {
      score,
      totalRounds,
      accuracyPct: totalRounds === 0 ? 0 : (score / totalRounds) * 100,
    },
    trust: {
      pctExpert,
      pctAi,
      expertFollows,
      aiFollows,
    },
    sources: {
      expertAccuracyPct,
      aiAccuracyPct,
    },
    interpretationKind,
  };
}

function interpretTrustKind(pctExpert: number): InterpretationKind {
  if (pctExpert >= 55) return "expertHeavy";
  if (pctExpert <= 45) return "aiHeavy";
  return "balanced";
}
