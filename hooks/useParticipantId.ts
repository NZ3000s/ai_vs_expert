"use client";

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const KEY = "be_experiment_participant_id";

function readId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = uuidv4();
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
