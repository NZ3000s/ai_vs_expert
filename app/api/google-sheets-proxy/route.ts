import { NextRequest, NextResponse } from "next/server";

/**
 * Edge avoids Node server webpack chunk splits that can fail in dev with
 * "Cannot find module './NNN.js'" when `.next` is stale or paths are odd.
 */
export const runtime = "edge";

/**
 * Forwards the request body to Google Apps Script unchanged (no field injection).
 * Client sends JSON with `payload_format_version`, `participant_id`, `responses`,
 * and `response_rows` (12-value arrays). Forwarded unchanged — see
 * scripts/google-apps-script-doPost.example.gs (no TEST_* column prepends).
 */
export async function POST(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_WEBHOOK_URL?.trim();
  if (!url || url.startsWith("PASTE_")) {
    return NextResponse.json(
      {
        ok: false,
        error: "not_configured",
        message:
          "NEXT_PUBLIC_WEBHOOK_URL is missing or placeholder on the server.",
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
      {
        ok: false,
        error: "forward_failed",
        message,
      },
      { status: 502 }
    );
  }
}
