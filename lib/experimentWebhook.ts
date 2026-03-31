import { TOTAL_ROUNDS } from "@/data/experiments";
import { getParticipantId } from "@/lib/participantId";
import type { RoundRecord } from "@/lib/types";

/**
 * Client-safe: `NEXT_PUBLIC_*` is inlined by Next.js at build/dev compile time.
 */
export const WEBHOOK_URL =
  (typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_WEBHOOK_URL?.trim()) ||
  "PASTE_YOUR_WEBHOOK_URL_HERE";

export const LS_WEBHOOK_SENT = "experiment_webhook_sent";
export const LS_WEBHOOK_PENDING = "experiment_webhook_pending";

const SESSION_DISPATCH = "experiment_webhook_dispatch";

/**
 * Google Sheets column order (index 0..11). Each row is a fixed-length tuple —
 * no object key ordering.
 */
export const SHEET_ROW_KEYS = [
  "participant_id",
  "round_number",
  "scenario_id",
  "asset",
  "expert_prediction",
  "ai_prediction",
  "outcome",
  "user_choice_source",
  "user_choice_prediction",
  "matched_outcome",
  "response_time_ms",
  "answered_at",
] as const;

export const SHEET_COLUMNS = SHEET_ROW_KEYS.length;

/** One sheet row: values in the exact order above. */
export type SheetResponseRow = readonly [
  string,
  number,
  number,
  string,
  "UP" | "DOWN",
  "UP" | "DOWN",
  "UP" | "DOWN",
  "expert" | "ai",
  "UP" | "DOWN",
  boolean,
  number,
  string,
];

export type ExperimentWebhookPayload = {
  responses: SheetResponseRow[];
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

function isValidIsoTimestamp(s: string): boolean {
  if (!s || typeof s !== "string") return false;
  return Number.isFinite(Date.parse(s.trim()));
}

function buildSheetRow(
  participantId: string,
  r: RoundRecord,
  sessionRoundIndex: number
): SheetResponseRow {
  const user_choice_prediction =
    r.followed_source === "Expert" ? r.expert_prediction : r.ai_prediction;
  const user_choice_source: "expert" | "ai" =
    r.followed_source === "Expert" ? "expert" : "ai";
  const matched_outcome = user_choice_prediction === r.outcome;

  return [
    participantId,
    sessionRoundIndex,
    r.round_number,
    String(r.asset),
    r.expert_prediction,
    r.ai_prediction,
    r.outcome,
    user_choice_source,
    user_choice_prediction,
    matched_outcome,
    r.response_time_ms,
    r.answered_at ?? "",
  ];
}

export function buildSheetRows(
  participantId: string,
  records: RoundRecord[]
): SheetResponseRow[] {
  return records.map((r, i) =>
    buildSheetRow(participantId, r, i + 1)
  );
}

function validateRow(
  row: SheetResponseRow,
  participantId: string,
  index: number
): boolean {
  if (row.length !== SHEET_COLUMNS) {
    console.error(`[sheets] row ${index}: expected ${SHEET_COLUMNS} columns`);
    return false;
  }

  const pid = row[0];
  const roundNum = row[1];
  const ep = row[4];
  const ap = row[5];
  const out = row[6];
  const ucs = row[7];
  const ucp = row[8];
  const matched = row[9];
  const rt = row[10];
  const answered = row[11];

  if (typeof pid !== "string" || pid.trim() === "") {
    console.error(`[sheets] row ${index}: invalid participant_id`);
    return false;
  }
  if (pid !== participantId) {
    console.error(`[sheets] row ${index}: participant_id mismatch`);
    return false;
  }
  if (
    typeof roundNum !== "number" ||
    roundNum < 1 ||
    roundNum > TOTAL_ROUNDS
  ) {
    console.error(`[sheets] row ${index}: round_number out of range`);
    return false;
  }
  if (ep !== "UP" && ep !== "DOWN") {
    console.error(`[sheets] row ${index}: expert_prediction invalid`);
    return false;
  }
  if (ap !== "UP" && ap !== "DOWN") {
    console.error(`[sheets] row ${index}: ai_prediction invalid`);
    return false;
  }
  if (out !== "UP" && out !== "DOWN") {
    console.error(`[sheets] row ${index}: outcome invalid`);
    return false;
  }
  if (ucs !== "expert" && ucs !== "ai") {
    console.error(`[sheets] row ${index}: user_choice_source invalid`);
    return false;
  }
  if (ucp !== "UP" && ucp !== "DOWN") {
    console.error(`[sheets] row ${index}: user_choice_prediction invalid`);
    return false;
  }
  if (typeof matched !== "boolean") {
    console.error(`[sheets] row ${index}: matched_outcome invalid`);
    return false;
  }
  if (typeof rt !== "number" || !Number.isFinite(rt) || rt < 0) {
    console.error(`[sheets] row ${index}: response_time_ms invalid`);
    return false;
  }
  if (!isValidIsoTimestamp(answered)) {
    console.error(`[sheets] row ${index}: answered_at must be ISO 8601`);
    return false;
  }
  return true;
}

function validateSubmission(
  participantId: string,
  rows: SheetResponseRow[]
): boolean {
  if (typeof participantId !== "string" || participantId.trim() === "") {
    console.error("[sheets] submit aborted: participant_id empty");
    return false;
  }
  if (rows.length !== TOTAL_ROUNDS) {
    console.error(
      `[sheets] submit aborted: expected ${TOTAL_ROUNDS} rows, got ${rows.length}`
    );
    return false;
  }
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].length !== SHEET_COLUMNS) {
      console.error(`[sheets] row ${i}: wrong column count`);
      return false;
    }
    if (!validateRow(rows[i], participantId, i)) {
      return false;
    }
  }
  return true;
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

/** Same-origin POST; server forwards JSON body unchanged to Google Apps Script. */
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

/**
 * Sends all rounds in one request. Reads participant_id from localStorage at
 * submit time (avoids empty id when React state lags).
 */
export function submitExperimentWebhook(records: RoundRecord[]): void {
  if (!records?.length) {
    return;
  }

  const participantId = getParticipantId();
  const rows = buildSheetRows(participantId, records);

  if (!validateSubmission(participantId, rows)) {
    clearDispatchGuard();
    return;
  }

  const payload: ExperimentWebhookPayload = { responses: rows };

  postJsonToWebhook(WEBHOOK_URL, payload, {
    markCompletedOnSuccess: true,
  });
}
