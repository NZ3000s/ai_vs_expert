/**
 * Stable anonymous participant id for the control experiment only (separate key
 * from the main study if both run on the same origin).
 */
export const PARTICIPANT_ID_STORAGE_KEY = "control_experiment_participant_id";

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

export function getParticipantId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = localStorage.getItem(PARTICIPANT_ID_STORAGE_KEY);
    if (!id) {
      id = randomUuid();
      localStorage.setItem(PARTICIPANT_ID_STORAGE_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}
