/* POST /api/context-stt — speech-to-text for the Conversational Map.
 *
 * Receives a short recorded audio clip (the raw bytes, with the recorder's MIME type as
 * Content-Type) and returns its transcript, by forwarding to Deepgram server-side. The
 * Deepgram key stays on the server, same trust boundary as the chat + map routes. The
 * viewer then feeds the transcript into /api/context-chat as if it had been typed.
 *
 * Deepgram's `nova` models are strong in noise (the Pride-crowd case). No SDK — a plain
 * fetch of the raw body is all it needs. Needs DEEPGRAM_API_KEY set server-side.
 *
 * Privacy: the recorded audio is sent to Deepgram to transcribe. The viewer's consent
 * gate discloses this. */

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const MODEL = process.env.DEEPGRAM_MODEL ?? "nova-2";

export async function POST(req: NextRequest) {
  if (!process.env.DEEPGRAM_API_KEY) {
    return NextResponse.json(
      { transcript: "", error: "Speech input isn't configured yet (no Deepgram key on the server)." },
      { status: 503 },
    );
  }

  const audio = await req.arrayBuffer();
  if (!audio || audio.byteLength < 200) {
    return NextResponse.json({ transcript: "", error: "I didn't catch any audio — try again." }, { status: 400 });
  }

  const contentType = req.headers.get("content-type") || "audio/webm";
  // smart_format + punctuate clean up the transcript; the model is noise-robust.
  const url = `https://api.deepgram.com/v1/listen?model=${encodeURIComponent(MODEL)}&smart_format=true&punctuate=true`;

  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`, "Content-Type": contentType },
      body: audio,
    });
    if (!resp.ok) {
      return NextResponse.json(
        { transcript: "", error: `Speech service error (${resp.status}).` },
        { status: 502 },
      );
    }
    const data = (await resp.json()) as {
      results?: { channels?: Array<{ alternatives?: Array<{ transcript?: string }> }> };
    };
    const transcript = data.results?.channels?.[0]?.alternatives?.[0]?.transcript?.trim() ?? "";
    return NextResponse.json({ transcript });
  } catch (e) {
    return NextResponse.json(
      { transcript: "", error: `Couldn't reach the speech service: ${(e as Error).message}` },
      { status: 502 },
    );
  }
}
