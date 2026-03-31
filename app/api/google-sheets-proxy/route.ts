import { NextRequest, NextResponse } from "next/server";

/**
 * Edge avoids Node server webpack chunk splits that can fail in dev with
 * "Cannot find module './NNN.js'" when `.next` is stale or paths are odd.
 */
export const runtime = "edge";

/**
 * Forwards the request body to Google Apps Script unchanged (no field injection).
 * Client sends `{ responses: SheetResponseRow[] }` — each row is a 12-element
 * array in SHEET_ROW_KEYS order (lib/experimentWebhook.ts).
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
