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

/** @deprecated Removed; kept only so reset clears any stale tab state. */
const LEGACY_SESSION_DISPATCH = "experiment_webhook_dispatch";

/**
 * Clears webhook send guards when the participant starts a new session from the
 * intro flow. Call when starting rounds, not on page refresh mid-experiment.
 */
export function resetWebhookSendStateForNewSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(LS_WEBHOOK_SENT);
    localStorage.removeItem(LS_WEBHOOK_PENDING);
  } catch {
    /* ignore */
  }
  try {
    sessionStorage.removeItem(LEGACY_SESSION_DISPATCH);
  } catch {
    /* ignore */
  }
}

/**
 * Google Sheets column order. Each row is a plain object with exactly these keys,
 * built in this order so JSON.stringify matches sheet headers. Apps Script can
 * use row.participant_id, row.round_number, … or sheetRowToValues(row).
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

export type SheetResponseRow = {
  participant_id: string;
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

/** Bump when sheet column order or semantics change (Apps Script can branch on this). */
export const SHEETS_PAYLOAD_FORMAT_VERSION = 2 as const;

export type ExperimentWebhookPayload = {
  /** Use with `response_rows` in Apps Script; ignore legacy TEST_* / debug prepend paths. */
  payload_format_version: typeof SHEETS_PAYLOAD_FORMAT_VERSION;
  /** Same id on every row — also sent top-level for Apps Script that prepends manually. */
  participant_id: string;
  responses: SheetResponseRow[];
  /**
   * Each row as 12 values in SHEET_ROW_KEYS order (includes column A). Prefer this in
   * Apps Script: `data.response_rows.forEach(r => sheet.appendRow(r))` so participant_id
   * is never omitted when mapping fields by hand.
   */
  response_rows: unknown[][];
};

/** Values in header order (for Apps Script sheet.appendRow(values)). */
export function sheetRowToValues(row: SheetResponseRow): unknown[] {
  return SHEET_ROW_KEYS.map((k) => row[k]);
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

  const answered_at =
    r.answered_at && r.answered_at.trim().length > 0
      ? r.answered_at
      : new Date().toISOString();

  return {
    participant_id: participantId,
    round_number: sessionRoundIndex,
    scenario_id: r.round_number,
    asset: String(r.asset),
    expert_prediction: r.expert_prediction,
    ai_prediction: r.ai_prediction,
    outcome: r.outcome,
    user_choice_source,
    user_choice_prediction,
    matched_outcome,
    response_time_ms: r.response_time_ms,
    answered_at,
  };
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
  if (typeof row.participant_id !== "string" || row.participant_id.trim() === "") {
    console.error(`[sheets] row ${index}: invalid participant_id`);
    return false;
  }
  if (row.participant_id !== participantId) {
    console.error(`[sheets] row ${index}: participant_id mismatch`);
    return false;
  }
  if (
    typeof row.round_number !== "number" ||
    row.round_number < 1 ||
    row.round_number > TOTAL_ROUNDS
  ) {
    console.error(`[sheets] row ${index}: round_number out of range`);
    return false;
  }
  if (row.expert_prediction !== "UP" && row.expert_prediction !== "DOWN") {
    console.error(`[sheets] row ${index}: expert_prediction invalid`);
    return false;
  }
  if (row.ai_prediction !== "UP" && row.ai_prediction !== "DOWN") {
    console.error(`[sheets] row ${index}: ai_prediction invalid`);
    return false;
  }
  if (row.outcome !== "UP" && row.outcome !== "DOWN") {
    console.error(`[sheets] row ${index}: outcome invalid`);
    return false;
  }
  if (row.user_choice_source !== "expert" && row.user_choice_source !== "ai") {
    console.error(`[sheets] row ${index}: user_choice_source invalid`);
    return false;
  }
  if (
    row.user_choice_prediction !== "UP" &&
    row.user_choice_prediction !== "DOWN"
  ) {
    console.error(`[sheets] row ${index}: user_choice_prediction invalid`);
    return false;
  }
  if (typeof row.matched_outcome !== "boolean") {
    console.error(`[sheets] row ${index}: matched_outcome invalid`);
    return false;
  }
  if (
    typeof row.response_time_ms !== "number" ||
    !Number.isFinite(row.response_time_ms) ||
    row.response_time_ms < 0
  ) {
    console.error(`[sheets] row ${index}: response_time_ms invalid`);
    return false;
  }
  if (!isValidIsoTimestamp(row.answered_at)) {
    console.error(`[sheets] row ${index}: answered_at must be ISO 8601`);
    return false;
  }
  return true;
}

function validateResponseRows(
  participantId: string,
  rows: SheetResponseRow[],
  responseRows: unknown[][]
): boolean {
  if (responseRows.length !== rows.length) {
    console.error("[sheets] response_rows length mismatch");
    return false;
  }
  for (let i = 0; i < rows.length; i++) {
    const expected = sheetRowToValues(rows[i]);
    const actual = responseRows[i];
    if (!Array.isArray(actual) || actual.length !== expected.length) {
      console.error(`[sheets] response_rows[${i}] invalid shape`);
      return false;
    }
    if (String(actual[0]) !== participantId) {
      console.error(`[sheets] response_rows[${i}] participant_id mismatch`);
      return false;
    }
  }
  return true;
}

function validateSubmission(
  participantId: string,
  rows: SheetResponseRow[],
  responseRows: unknown[][]
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
    if (!validateRow(rows[i], participantId, i)) {
      return false;
    }
  }
  if (!validateResponseRows(participantId, rows, responseRows)) {
    return false;
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

function clearLegacyDispatchKey(): void {
  try {
    sessionStorage.removeItem(LEGACY_SESSION_DISPATCH);
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

  /**
   * Do not gate on isConfiguredUrl() here. NEXT_PUBLIC_WEBHOOK_URL is inlined at
   * build time; production servers often set the real URL only at runtime, which
   * would leave the client bundle with a placeholder and skip all POSTs silently.
   * The proxy route validates env and returns 500 if the webhook is not set.
   */
  if (!skipGuards) {
    try {
      if (localStorage.getItem(LS_WEBHOOK_SENT) === "true") {
        return;
      }
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
        clearLegacyDispatchKey();
        savePendingPayload(payload);
        return;
      }
      if (data.ok !== true) {
        clearLegacyDispatchKey();
        savePendingPayload(payload);
        return;
      }
      const status = data.forwardedStatus;
      if (status < 200 || status >= 300) {
        clearLegacyDispatchKey();
        savePendingPayload(payload);
        return;
      }
      if (markCompletedOnSuccess) {
        markSent();
      }
    })
    .catch(() => {
      clearLegacyDispatchKey();
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
  const response_rows = rows.map((r) => sheetRowToValues(r));

  if (!validateSubmission(participantId, rows, response_rows)) {
    clearLegacyDispatchKey();
    console.error(
      "[sheets] submitExperimentWebhook: validation failed (see errors above)"
    );
    return;
  }

  const payload: ExperimentWebhookPayload = {
    payload_format_version: SHEETS_PAYLOAD_FORMAT_VERSION,
    participant_id: participantId,
    responses: rows,
    response_rows,
  };

  postJsonToWebhook(payload, {
    markCompletedOnSuccess: true,
  });
}
