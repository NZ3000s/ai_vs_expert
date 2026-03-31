"use client";

import { useEffect, useState } from "react";

const KEY = "be_experiment_participant_id";

/** UUID v4 without the `uuid` package (avoids Turbopack dev resolution issues). */
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

function readId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = randomUuid();
    localStorage.setItem(KEY, id);
  }
  return id;
}

/** Stable anonymous participant id for behavioral logging. */
export function useParticipantId(): string | null {
  const [id, setId] = useState<string | null>(null);
  useEffect(() => {
    setId(readId());
  }, []);
  return id;
}
