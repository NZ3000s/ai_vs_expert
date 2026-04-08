import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

/** Default control-group Apps Script web app URL (override via env). */
const DEFAULT_CONTROL_WEBHOOK =
  "https://script.google.com/macros/s/AKfycbzuNdtfPMjUbZNCHP07uYvZdnofdDsEE9pwfZv9HwctUyG6m2_dhrHK-J3oeNuK7lTDSA/exec";

function resolveWebhookUrl(): string | null {
  const u =
    process.env.CONTROL_SHEETS_WEBHOOK_URL?.trim() ||
    process.env.NEXT_PUBLIC_CONTROL_SHEETS_WEBHOOK_URL?.trim();
  if (u) return u;
  return DEFAULT_CONTROL_WEBHOOK;
}

/**
 * Forwards JSON `{ participant_id, responses }` to Google Apps Script unchanged.
 */
export async function POST(req: NextRequest) {
  const url = resolveWebhookUrl();
  if (!url || url.startsWith("PASTE_")) {
    return NextResponse.json(
      {
        ok: false,
        error: "not_configured",
        message: "Control webhook URL is missing or invalid.",
      },
      { status: 500 }
    );
  }

  let body: string;
  try {
    body = await req.text();
  } catch {
    return NextResponse.json(
      { ok: false, error: "bad_request", message: "Could not read body" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      redirect: "follow",
    });
    const responseBody = await res.text();
    return NextResponse.json({
      ok: true,
      forwardedStatus: res.status,
      forwardedStatusText: res.statusText,
      responseBody,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { ok: false, error: "forward_failed", message },
      { status: 502 }
    );
  }
}
