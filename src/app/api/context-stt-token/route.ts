/* POST /api/context-stt-token — mint a short-lived Deepgram token for the Conversational Map's
 * STREAMING voice input.
 *
 * The browser streams microphone audio DIRECTLY to Deepgram's live WebSocket (lower latency, no
 * audio through our VPS). It can't be trusted with the real API key, so this route swaps the
 * server-side key for a 30-second temporary token (Deepgram /auth/grant) that the browser uses
 * only to open the socket. The real key never leaves the server.
 *
 * Needs DEEPGRAM_API_KEY to be a Member-or-higher key (usage-only keys get FORBIDDEN from
 * /auth/grant). The same key still serves the batch /api/context-stt fallback. */

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  if (!process.env.DEEPGRAM_API_KEY) {
    return NextResponse.json({ error: "Speech input isn't configured (no Deepgram key)." }, { status: 503 });
  }
  try {
    const resp = await fetch("https://api.deepgram.com/v1/auth/grant", {
      method: "POST",
      headers: { Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ ttl_seconds: 30 }),
    });
    if (!resp.ok) {
      const detail = (await resp.text()).slice(0, 200);
      const hint = resp.status === 403 ? " The Deepgram key needs Member-or-higher permission to mint tokens." : "";
      return NextResponse.json({ error: `Couldn't get a speech token (${resp.status}).${hint}`, detail }, { status: 502 });
    }
    const data = (await resp.json()) as { access_token?: string; expires_in?: number };
    if (!data.access_token) {
      return NextResponse.json({ error: "Speech token response was empty." }, { status: 502 });
    }
    return NextResponse.json({ token: data.access_token, expires_in: data.expires_in ?? 30 });
  } catch (e) {
    return NextResponse.json({ error: `Couldn't reach the speech token service: ${(e as Error).message}` }, { status: 502 });
  }
}
