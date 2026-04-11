import type { RoundRecord } from "@/lib/types";

export const LS_COMPLETED = "experiment_completed";
export const LS_PROGRESS = "experiment_progress";

/** `sessionStorage` key: experiment start time (ms) for timer continuity on refresh. */
export const SESSION_TIMER_START_KEY = "be_experiment_session_timer_start_ms";

export type PersistedProgress = {
  /** Active round index (0-based) into `scenarioOrder`. */
  currentRoundIndex: number;
  records: RoundRecord[];
  /** Scenario ids (1…N) in play order for this session; stable across refresh. */
  scenarioOrder?: number[];
};

/** One completed session per browser (`experiment_completed` in localStorage). */
export function readCompleted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(LS_COMPLETED) === "true";
  } catch {
    return false;
  }
}

/** Call when all rounds are finished; clears in-progress state. */
export function setExperimentCompleted(): void {
  try {
    localStorage.setItem(LS_COMPLETED, "true");
    localStorage.removeItem(LS_PROGRESS);
  } catch {
    /* private mode / quota */
  }
  try {
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.removeItem(SESSION_TIMER_START_KEY);
    }
  } catch {
    /* ignore */
  }
}

export function readProgress(): PersistedProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LS_PROGRESS);
    if (!raw) return null;
    const p = JSON.parse(raw) as PersistedProgress;
    if (
      typeof p.currentRoundIndex !== "number" ||
      !Array.isArray(p.records)
    ) {
      return null;
    }
    return p;
  } catch {
    return null;
  }
}

export function writeProgress(p: PersistedProgress): void {
  try {
    localStorage.setItem(LS_PROGRESS, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

export function clearProgress(): void {
  try {
    localStorage.removeItem(LS_PROGRESS);
  } catch {
    /* ignore */
  }
}
