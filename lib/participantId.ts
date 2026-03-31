/**
 * Stable anonymous participant id (localStorage). Used for RoundRecord and
 * Google Sheets rows — always read via getParticipantId(), not React state alone.
 */
export const PARTICIPANT_ID_STORAGE_KEY = "participant_id";

const LEGACY_PARTICIPANT_ID_KEY = "be_experiment_participant_id";

function randomUuid(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Returns the same id for the whole session. Persists under `participant_id`;
 * migrates legacy `be_experiment_participant_id` if present.
 */
export function getParticipantId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = localStorage.getItem(PARTICIPANT_ID_STORAGE_KEY);
    if (!id) {
      id = localStorage.getItem(LEGACY_PARTICIPANT_ID_KEY);
      if (id) {
        localStorage.setItem(PARTICIPANT_ID_STORAGE_KEY, id);
      }
    }
    if (!id) {
      id = randomUuid();
      localStorage.setItem(PARTICIPANT_ID_STORAGE_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}
