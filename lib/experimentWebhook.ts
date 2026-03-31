import type { RoundRecord } from "@/lib/types";

/**
 * Client-safe: `NEXT_PUBLIC_*` is inlined by Next.js at build/dev compile time.
 * Set in `.env.local` and restart `next dev` so the browser bundle picks it up.
 * Not hardcoded — reads `process.env.NEXT_PUBLIC_WEBHOOK_URL` at compile time.
 */
export const WEBHOOK_URL =
  (typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_WEBHOOK_URL?.trim()) ||
  "PASTE_YOUR_WEBHOOK_URL_HERE";

export const LS_WEBHOOK_SENT = "experiment_webhook_sent";
export const LS_WEBHOOK_PENDING = "experiment_webhook_pending";

const SESSION_DISPATCH = "experiment_webhook_dispatch";

export type ExperimentResponseRow = {
  round_number: number;
  scenario_id: number;
  asset: string;
  expert_prediction: "UP" | "DOWN";
  ai_prediction: "UP" | "DOWN";
  outcome: "UP" | "DOWN";
  user_choice_source: "expert" | "ai";
  user_choice_prediction: "UP" | "DOWN";
  matched_outcome: boolean;
  response_time_ms: number;
  answered_at: string;
};

export type ExperimentWebhookPayload = {
  participant_id: string;
  responses: ExperimentResponseRow[];
};

function isConfiguredUrl(url: string): boolean {
  const u = url.trim();
  if (!u || u === "PASTE_YOUR_WEBHOOK_URL_HERE") return false;
  if (u.startsWith("PASTE_")) return false;
  try {
    const parsed = new URL(u);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export function buildWebhookResponses(
  records: RoundRecord[]
): ExperimentResponseRow[] {
  return records.map((r) => {
    const user_choice_prediction =
      r.followed_source === "Expert"
        ? r.expert_prediction
        : r.ai_prediction;
    return {
      round_number: r.round_number,
      scenario_id: r.round_number,
      asset: r.asset,
      expert_prediction: r.expert_prediction,
      ai_prediction: r.ai_prediction,
      outcome: r.outcome,
      user_choice_source: r.followed_source === "Expert" ? "expert" : "ai",
      user_choice_prediction,
      matched_outcome: user_choice_prediction === r.outcome,
      response_time_ms: r.response_time_ms,
      answered_at: r.answered_at ?? "",
    };
  });
}

function savePendingPayload(payload: ExperimentWebhookPayload): void {
  try {
    localStorage.setItem(LS_WEBHOOK_PENDING, JSON.stringify(payload));
  } catch {
    /* quota / private mode */
  }
}

function markSent(): void {
  try {
    localStorage.setItem(LS_WEBHOOK_SENT, "true");
    localStorage.removeItem(LS_WEBHOOK_PENDING);
  } catch {
    /* ignore */
  }
}

function clearDispatchGuard(): void {
  try {
    sessionStorage.removeItem(SESSION_DISPATCH);
  } catch {
    /* ignore */
  }
}

/** Same-origin POST; server forwards to Google (avoids browser CORS to script.google.com). */
export const GOOGLE_SHEETS_PROXY_PATH = "/api/google-sheets-proxy" as const;

type GoogleProxyJson =
  | {
      ok: true;
      forwardedStatus: number;
      forwardedStatusText?: string;
      responseBody: string;
    }
  | { ok: false; error: string; message?: string };

async function readGoogleProxyJson(res: Response): Promise<GoogleProxyJson | null> {
  try {
    const d = (await res.json()) as unknown;
    if (d && typeof d === "object" && "ok" in d) {
      return d as GoogleProxyJson;
    }
  } catch {
    /* ignore */
  }
  return null;
}

type PostOptions = {
  skipGuards?: boolean;
  markCompletedOnSuccess?: boolean;
};

/** POST JSON to the webhook via same-origin proxy. */
export function postJsonToWebhook(
  url: string,
  payload: ExperimentWebhookPayload,
  options: PostOptions
): void {
  const { skipGuards, markCompletedOnSuccess } = options;

  if (!payload?.responses?.length) {
    return;
  }

  if (typeof window === "undefined") {
    return;
  }

  const trimmed = url.trim();

  if (!isConfiguredUrl(trimmed)) {
    return;
  }

  if (!skipGuards) {
    try {
      if (localStorage.getItem(LS_WEBHOOK_SENT) === "true") {
        return;
      }
      if (sessionStorage.getItem(SESSION_DISPATCH) === "1") {
        return;
      }
      sessionStorage.setItem(SESSION_DISPATCH, "1");
    } catch {
      /* ignore */
    }
  }

  fetch(GOOGLE_SHEETS_PROXY_PATH, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then(async (res) => {
      const data = await readGoogleProxyJson(res);
      if (!data) {
        clearDispatchGuard();
        savePendingPayload(payload);
        return;
      }
      if (data.ok !== true) {
        clearDispatchGuard();
        savePendingPayload(payload);
        return;
      }
      const status = data.forwardedStatus;
      if (status < 200 || status >= 300) {
        clearDispatchGuard();
        savePendingPayload(payload);
        return;
      }
      if (markCompletedOnSuccess) {
        markSent();
      }
    })
    .catch(() => {
      clearDispatchGuard();
      savePendingPayload(payload);
    });
}

export function submitExperimentWebhook(
  participantId: string,
  records: RoundRecord[]
): void {
  if (!records?.length) {
    return;
  }

  const payload: ExperimentWebhookPayload = {
    participant_id: participantId || "unknown",
    responses: buildWebhookResponses(records),
  };

  postJsonToWebhook(WEBHOOK_URL, payload, {
    markCompletedOnSuccess: true,
  });
}
