import type { ControlResponseRow } from "@/lib/types";
import { TOTAL_ROUNDS } from "@/data/experiments";

export const LS_CONTROL_COMPLETED = "control_experiment_completed";
export const LS_CONTROL_PROGRESS = "control_experiment_progress";

export type PersistedControlProgress = {
  scenarioOrder: number[];
  currentRoundIndex: number;
  records: ControlResponseRow[];
  sessionStartMs: number;
};

/** One completed submission per browser (`control_experiment_completed` after successful webhook). */
export function readControlCompleted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(LS_CONTROL_COMPLETED) === "true";
  } catch {
    return false;
  }
}

/** Call only after the server accepts the webhook (successful submission). */
export function setControlExperimentCompleted(): void {
  try {
    localStorage.setItem(LS_CONTROL_COMPLETED, "true");
  } catch {
    /* ignore */
  }
}

/**
 * Mid-session: `records.length === currentRoundIndex` &lt; TOTAL_ROUNDS.
 * After last answer (awaiting or viewing results, webhook may retry): both equal TOTAL_ROUNDS.
 */
export function readControlProgress(): PersistedControlProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LS_CONTROL_PROGRESS);
    if (!raw) return null;
    const p = JSON.parse(raw) as PersistedControlProgress;
    if (
      !Array.isArray(p.scenarioOrder) ||
      p.scenarioOrder.length !== TOTAL_ROUNDS ||
      typeof p.currentRoundIndex !== "number" ||
      !Array.isArray(p.records) ||
      typeof p.sessionStartMs !== "number"
    ) {
      return null;
    }
    if (
      p.records.length === TOTAL_ROUNDS &&
      p.currentRoundIndex === TOTAL_ROUNDS
    ) {
      return p;
    }
    if (p.records.length >= TOTAL_ROUNDS) {
      return null;
    }
    if (p.records.length !== p.currentRoundIndex) {
      return null;
    }
    return p;
  } catch {
    return null;
  }
}

export function writeControlProgress(p: PersistedControlProgress): void {
  try {
    localStorage.setItem(LS_CONTROL_PROGRESS, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

export function clearControlProgress(): void {
  try {
    localStorage.removeItem(LS_CONTROL_PROGRESS);
  } catch {
    /* ignore */
  }
}
