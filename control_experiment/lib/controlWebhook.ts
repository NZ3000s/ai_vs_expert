import { TOTAL_ROUNDS } from "@/data/experiments";
import {
  clearControlProgress,
  setControlExperimentCompleted,
} from "@/lib/controlStorage";
import { getParticipantId } from "@/lib/participantId";
import type { ControlResponseRow } from "@/lib/types";

export const CONTROL_PROXY_PATH = "/api/control-sheets-proxy" as const;

export const LS_CONTROL_WEBHOOK_SENT = "control_experiment_webhook_sent";
const SESSION_DISPATCH = "control_webhook_dispatch";

export type ControlWebhookPayload = {
  participant_id: string;
  responses: ControlResponseRow[];
};

type ProxyJson =
  | {
      ok: true;
      forwardedStatus: number;
      forwardedStatusText?: string;
      responseBody: string;
    }
  | { ok: false; error: string; message?: string };

async function readProxyJson(res: Response): Promise<ProxyJson | null> {
  try {
    const d = (await res.json()) as unknown;
    if (d && typeof d === "object" && "ok" in d) {
      return d as ProxyJson;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function validateRecords(records: ControlResponseRow[]): boolean {
  const pid = getParticipantId();
  if (!pid.trim()) {
    return false;
  }
  if (records.length !== TOTAL_ROUNDS) {
    return false;
  }
  return true;
}

function clearDispatchGuard(): void {
  try {
    sessionStorage.removeItem(SESSION_DISPATCH);
  } catch {
    /* ignore */
  }
}

function shouldSkipDuplicatePost(): boolean {
  try {
    if (localStorage.getItem(LS_CONTROL_WEBHOOK_SENT) === "true") {
      return true;
    }
    if (sessionStorage.getItem(SESSION_DISPATCH) === "1") {
      return true;
    }
  } catch {
    /* ignore */
  }
  return false;
}

function markWebhookSent(): void {
  try {
    localStorage.setItem(LS_CONTROL_WEBHOOK_SENT, "true");
  } catch {
    /* ignore */
  }
}

/**
 * Sends `{ participant_id, responses }` via same-origin proxy.
 * On successful HTTP response: sets `control_experiment_completed`, webhook-sent flag, clears progress.
 */
export function submitControlWebhook(records: ControlResponseRow[]): void {
  if (!validateRecords(records)) {
    clearDispatchGuard();
    return;
  }

  const participant_id = getParticipantId();
  const payload: ControlWebhookPayload = { participant_id, responses: records };

  if (typeof window === "undefined") return;

  if (shouldSkipDuplicatePost()) {
    return;
  }

  try {
    sessionStorage.setItem(SESSION_DISPATCH, "1");
  } catch {
    /* ignore */
  }

  fetch(CONTROL_PROXY_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then(async (res) => {
      const data = await readProxyJson(res);
      clearDispatchGuard();
      if (!data || data.ok !== true) {
        return;
      }
      if (data.forwardedStatus >= 200 && data.forwardedStatus < 300) {
        setControlExperimentCompleted();
        markWebhookSent();
        clearControlProgress();
      }
    })
    .catch(() => {
      clearDispatchGuard();
    });
}
