/* POST /api/context-chat  — the Conversational Map.
 *
 * A conversational front-end over the `map-features` index: the user asks, in plain
 * language, about where they are now or anywhere on the map, and an LLM (Haiku) answers
 * by calling the four map tools in src/lib/map-tools.ts. The model orchestrates and
 * phrases; the tools do all the geometry (distance, bearing, clock). Same trust boundary
 * as the other map routes — the API key stays server-side, OpenSearch stays on localhost.
 *
 * Body: { message: string, location?: {lat,lon,heading?}, history?: [{role,content}] }
 *   history is prior TEXT turns only (user/assistant). Tool calls happen inside a turn and
 *   are not replayed — the model only needs past ANSWERS for context, not past tool traffic.
 * Returns: { reply: string }  (or { reply, error } on a soft failure).
 *
 * Privacy: the message + the user's coordinates are sent to the Anthropic API to answer.
 * The viewer gates on a consent notice that discloses this. */

import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { TOOL_SCHEMAS, runTool } from "@/lib/map-tools";

export const dynamic = "force-dynamic";

const MODEL = process.env.CHAT_MODEL ?? "claude-haiku-4-5";
const MAX_HISTORY = 12; // prior turns kept for context (cost bound)
const MAX_TOOL_ROUNDS = 6; // safety stop on the tool loop
// 8-point compass for stating the user's OWN facing (the one place a compass point is used).
const COMPASS8 = ["north", "north-east", "east", "south-east", "south", "south-west", "west", "north-west"];

const SYSTEM = `You are a spatial guide for blind and low-vision people. You help them understand and explore the world through a map database — where they are now, and anywhere they ask about. You are their eyes on the map: capable, direct, never patronising. The person is in charge; you inform, you do not shepherd.

Answer ONLY using the tools. They query a real map database (OpenStreetMap data for all of Canada plus a few other cities).

Hard rules:
- Never invent a feature, name, distance, direction, or detail. If a tool returns nothing, say so plainly: "I don't find anything mapped there."
- Never estimate distances or directions yourself — always take them from the tools (find_place, whats_nearby and path_between return them computed). Your job is choosing what to ask and how to say it, not doing geometry.
- Give distance in METRES, straight-line. NEVER convert it to a walking time or say how long something takes — people move at very different speeds and the app cannot know theirs — and never give route or turn-by-turn directions. Just the distance and the direction. Directions: when a tool gives a clock direction (the user's heading is known) PREFER it and lead with it — "about 30 metres, at 2 o'clock" — because it is relative to the way they are facing, which is what a walker needs. Use the compass bearing (north, south-east…) ONLY when no clock is given. This is ORIENTATION, not a route — never imply it is safe to cross or proceed.
- The user's location is given with EACH message, and they may have MOVED since their last question. Treat EVERY "where am I" / location / intersection question as brand new from the CURRENT coordinates: re-query the tools with them, and do NOT restate or carry over any place, street, or intersection from an earlier answer — the user has moved and the old one is probably wrong now. Name where they are now entirely from the fresh results. "Here", "around me", "nearby" mean the current point. For any place they name, call find_place first to get its coordinates, then describe around those.

How to speak (this is read aloud by a screen reader or spoken):
- Lead with the answer. One or two sentences, then stop. Offer to go deeper rather than dumping everything.
- For "where am I", "what corner am I at", and "nearest intersection" questions the EXACT spot matters most. Call nearest_intersections for the actual junction — its NEAREST result is the corner the user is at, so use that one (never a farther cross-street) — and whats_nearby for the named place they are at or beside. Lead with those specifics: the place and the corner. Give the area's general character only briefly and AFTER the specifics; never open with a feature count or just "a densely built-up area". A clear place plus the corner IS the answer ("You're at McDonald's, on the corner of Gerrard Street East and Sibley Avenue").
- When there are many results, summarise the shape ("several cafés within 100 metres — the nearest is Blandford, about 30 metres east") instead of listing them all. List individually only when asked, or when there are just a few.
- Nearest or most relevant first. Plain, concrete language — no visual-only words, no filler, no false cheer.
- If a place name is ambiguous, take the nearest match and say which ("the nearest Tim Hortons, on King Street"), or briefly ask which they mean.
- Settlements have a RANK (city, town, village, hamlet, locality). Honour it. For "where am I" the immediate named place is right whatever its rank ("near the hamlet of Mississauga Landing"). But for "what's the nearest TOWN / CITY / VILLAGE", answer with a place of THAT rank from area_summary's settlement ladder (\`nearest_town\` / \`nearest_city\`) — a hamlet or a locality is NOT a town, so never offer one as the answer. Name the rank when it clarifies ("the nearest town is Bobcaygeon, about 20 km away; the closest place to you is the hamlet of Mississauga Landing").
- For "where is / is there / what's the nearest <KIND of place>" (supermarket, pharmacy, café, ATM, fuel…), call whats_nearby with \`types\` set to that kind — it filters to that kind and searches WIDER, so don't give up after a short radius; a rural supermarket can be a kilometre or more away. Name each result by its real kind (a corner shop is a convenience store, not a supermarket); lead with the one that best matches what they asked, and you can mention a closer alternative of a related kind ("nearest supermarket is Foodland, 900 m; there's a convenience store closer, 400 m").

Accessibility is first-class: surface wheelchair access, tactile paving, kerbs, step-free entrances when relevant, and filter for them when asked.

Be conversational — remember the last few turns so "the nearest one", "what about cafés", "how do I get there" follow naturally.`;

type Turn = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { reply: "", error: "The conversational map isn't configured yet (no API key on the server)." },
      { status: 503 },
    );
  }

  let body: { message?: string; location?: { lat: number; lon: number; heading?: number }; history?: Turn[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ reply: "", error: "Bad request." }, { status: 400 });
  }

  const message = (body.message ?? "").trim();
  if (!message) return NextResponse.json({ reply: "", error: "Empty message." }, { status: 400 });

  const loc = body.location;
  const heading = typeof loc?.heading === "number" ? loc.heading : undefined;

  // Prior text turns (capped), then the new user turn with the location appended as context.
  const history = (body.history ?? [])
    .filter((t) => (t.role === "user" || t.role === "assistant") && typeof t.content === "string")
    .slice(-MAX_HISTORY);

  // When the user's facing is known: OPEN by telling them which way they face, as a compass
  // point (this is the ONE legitimate compass use — it's the anchor that makes the clock
  // directions meaningful), then give every other direction as a clock position. Without this
  // the model both omits the facing and slips into its own compass knowledge ("Bobcaygeon is
  // north-west") on descriptive answers, even though the tools hand it only a clock value.
  const facingWord = heading != null ? COMPASS8[Math.round(heading / 45) % 8] : null;
  const facingNote = facingWord
    ? `, facing ${facingWord}. Their facing is KNOWN, and the app states it for them at the very start of the reply — so do NOT state their compass facing yourself. Give EVERY direction to a place or feature as the EXACT clock number the tool returns — always say the o'clock value, e.g. "at 3 o'clock", "at 9 o'clock", "at 12 o'clock". Do NOT soften or replace it with "to your left", "to your right", "ahead", "behind" or similar vague words, and NEVER use a compass point — not even for a distant place you happen to know. The clock value is precise; the vague words throw that precision away`
    : "";
  const locNote = loc
    ? `\n\n[The user is at latitude ${loc.lat}, longitude ${loc.lon}${facingNote}. Use this for "here"/"nearby"; for anywhere else, find_place first.]`
    : `\n\n[The user's current location is not available — ask them to name a place, or to enable location.]`;

  const messages: Anthropic.Messages.MessageParam[] = [
    ...history.map((t) => ({ role: t.role, content: t.content })),
    { role: "user", content: message + locNote },
  ];

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // Cache the (large, stable) system prompt + tools so every turn after the first is cheap.
  const system: Anthropic.Messages.TextBlockParam[] = [
    { type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } },
  ];
  const tools = TOOL_SCHEMAS.map((t, i) =>
    i === TOOL_SCHEMAS.length - 1 ? { ...t, cache_control: { type: "ephemeral" as const } } : t,
  ) as unknown as Anthropic.Messages.Tool[];

  try {
    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const resp = await client.messages.create({ model: MODEL, max_tokens: 1024, system, tools, messages });

      if (resp.stop_reason === "tool_use") {
        const toolUses = resp.content.filter((b): b is Anthropic.Messages.ToolUseBlock => b.type === "tool_use");
        const toolResults: Anthropic.Messages.ToolResultBlockParam[] = await Promise.all(
          toolUses.map(async (tu) => {
            let out: unknown;
            try {
              out = await runTool(
                tu.name, tu.input as Record<string, unknown>, heading,
                loc ? { lat: loc.lat, lon: loc.lon } : undefined,
              );
            } catch (e) {
              out = { error: `tool ${tu.name} failed: ${(e as Error).message}` };
            }
            return { type: "tool_result", tool_use_id: tu.id, content: JSON.stringify(out) };
          }),
        );
        messages.push({ role: "assistant", content: resp.content });
        messages.push({ role: "user", content: toolResults });
        continue;
      }

      const reply = resp.content
        .filter((b): b is Anthropic.Messages.TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("")
        .trim();
      if (!reply) return NextResponse.json({ reply: "I'm not sure how to answer that — try rephrasing?" });
      // Lead every answer with the user's facing (the ONE compass point) when known — the anchor
      // that makes the clock directions in the reply meaningful, exactly like the Context Map.
      return NextResponse.json({ reply: facingWord ? `You're facing ${facingWord}. ${reply}` : reply });
    }
    return NextResponse.json({ reply: "That question took more steps than I can take in one go — try narrowing it down?" });
  } catch (e) {
    return NextResponse.json(
      { reply: "", error: `Something went wrong reaching the assistant: ${(e as Error).message}` },
      { status: 502 },
    );
  }
}
