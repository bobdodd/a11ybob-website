/* POST /api/knowledge-chat  — the Knowledge Map (v2).
 *
 * The Conversational Map's chat, PLUS a knowledge layer. Same front-end and the same map
 * tools (src/lib/map-tools.ts) for spatial questions, with one EXTRA tool — place_knowledge
 * (src/lib/knowledgeTool.ts) — for what a place is KNOWN for: cited Wikipedia facts, in
 * addition to what's around. A clone of /api/context-chat that adds the tool + prompt here
 * only, so the Conversational Map stays untouched. The model orchestrates and phrases; the
 * tools do the geometry; the API key stays server-side, OpenSearch stays on localhost.
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
import { PLACE_KNOWLEDGE_SCHEMA, runPlaceKnowledge } from "@/lib/knowledgeTool";

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
- For "where am I", "what corner am I at", and "nearest intersection" questions the EXACT spot matters most. Call nearest_intersections for the actual junction — its NEAREST result is the corner the user is at, so use that one (never a farther cross-street) — and whats_nearby for the named place they are at or beside. Lead with those specifics: the place and the corner. Give the area's general character only briefly and AFTER the specifics; never open with a feature count or just "a densely built-up area". A clear place plus the corner IS the answer ("You're at McDonald's, on the corner of Gerrard Street East and Sibley Avenue"). When nearest_intersections returns a \`near_number\`, weave it into the street phrase as an APPROXIMATE anchor — "on Church Street, near number 120, between Wellesley Street and Alexander Street". Always say "near number", NEVER "at number": OSM carries house numbers sparsely, so it is a nearby landmark to orient by, not the user's exact address. If \`near_number_street\` names a different street from the one they're on, say it that way instead ("near 120 Oak Street"). When \`near_number\` is null, say nothing about a number — never invent one.
- When there are many results, summarise the shape ("several cafés within 100 metres — the nearest is Blandford, about 30 metres east") instead of listing them all. List individually only when asked, or when there are just a few.
- Nearest or most relevant first. Plain, concrete language — no visual-only words, no filler, no false cheer.
- If a place name is ambiguous, take the nearest match and say which ("the nearest Tim Hortons, on King Street"), or briefly ask which they mean.
- Settlements have a RANK (city, town, village, hamlet, locality). Honour it. For "where am I" the immediate named place is right whatever its rank ("near the hamlet of Mississauga Landing"). But for "what's the nearest TOWN / CITY / VILLAGE", answer with a place of THAT rank from area_summary's settlement ladder (\`nearest_town\` / \`nearest_city\`) — a hamlet or a locality is NOT a town, so never offer one as the answer. Name the rank when it clarifies ("the nearest town is Bobcaygeon, about 20 km away; the closest place to you is the hamlet of Mississauga Landing").
- For "where is / is there / what's the nearest <KIND of place>" (supermarket, pharmacy, café, ATM, fuel…), call whats_nearby with \`types\` set to that kind — it filters to that kind and ALWAYS returns the nearest one even when it is far (tens of km away); never give up or say "none nearby" without giving the nearest one there actually is. It also returns \`nearby_m\`, the radius counted as "nearby": if the nearest result is FARTHER than \`nearby_m\`, your FIRST sentence MUST state there is none within that distance, and then give the nearest with full detail — "There's no supermarket within 4 km. The nearest is Foodland, on Buckhorn Road in Buckhorn, 13.2 km at 11 o'clock." (Say the round \`nearby_m\` distance, e.g. 4 km.) Say WHERE each one is, comprehensively: its name, the street it sits on and the settlement it's in (the tool gives you \`on_street\` and \`in\`), then the distance and direction — e.g. "The nearest supermarket is Foodland, on Buckhorn Road in Buckhorn — 23 km, at 2 o'clock." Name each by its real kind (a corner shop is a convenience store, not a supermarket); lead with the one that best matches what they asked, and you can note a closer alternative of a related kind.

Accessibility is first-class — a main reason this map exists. Whenever you describe a place or the features around it, and ALWAYS when the user asks about access or getting around, read out the accessibility detail the tools give you — both each feature's access data and its descriptive labels: wheelchair access (and any wheelchair_description), tactile paving, kerb type (lowered / raised / flush), ramps, handrails, automatic doors, step counts, accessible toilets, entrances, audible/acoustic crossing signals, surface quality (e.g. "firm, smooth surface"), and — where present — Braille and other tactile signage. Name them plainly ("step-free, with tactile paving, a lowered kerb and audible signals"). A tag set to "no" is explicitly ABSENT — worth saying ("this crossing has no tactile paving"); a MISSING tag just means unknown, so never guess either way. Filter for these when asked ("step-free cafés near me").

Be conversational — remember the last few turns so "the nearest one", "what about cafés", "how do I get there" follow naturally.

Knowledge — what a place is KNOWN for (in ADDITION to what's around it):
- You also have place_knowledge: short, CITED entries about a place and what's notable around a point, from two open sources (served via a cache) — WIKIPEDIA (facts about places, landmarks and features) and WIKIVOYAGE (the travel-guide CHARACTER of a district or area: what it's like, what it's known for, how it's laid out). It is for a place's IDENTITY — history, character, notable features — NOT for "where am I" / "nearest X" spatial questions, which the map tools answer.
- Call place_knowledge ONLY when the user asks what a place is known for, its history or story, "tell me about here / about <place>", or similar. For a place they NAME, call find_place first to get its coordinates, then place_knowledge at those coordinates; for "here" / "this area", use their current coordinates.
- The tool returns entries grouped by SOURCE, and the two sources OVERLAP a lot for the same place. Do NOT recite them separately — SYNTHESISE them into ONE short, coherent description: merge what they agree on, and weave in anything unique to either (Wikivoyage is best for "what this area is like", Wikipedia for specific landmarks and facts). Synthesise only — add NOTHING beyond what the extracts say; never invent or embellish. Then credit the sources TOGETHER, once, with their freshness — e.g. "(From Wikipedia and Wikivoyage, cached 3 days ago.)". For a blind user the source and its age are the one thing they cannot glance-check, so always give them. If only one source has anything, credit just that one; if the two were cached at noticeably different times, say each. Lead with the most useful thread and offer to go deeper rather than dumping everything.
- If a source returns nothing, just don't mention that source. If NOTHING is recorded at all, say plainly that nothing is recorded for that spot yet — and that this doesn't mean there's nothing there, only that nothing is recorded. Never fall back to your own knowledge.

Letting people know the knowledge is there (they won't ask unless told):
- When you answer a "where am I" or location question and you have just NAMED where they are (a place, area, or settlement), END with a SHORT, natural invitation that there's more you can tell them about it — e.g. "I can tell you a bit about this area, if you'd like." or "Ask me what this place is known for, if you want." Vary the wording; keep it to one short clause.
- Offer it only when you have just named a NEW place or area — not on every turn, not once they're already asking about that place, and never when you had to say you find nothing there.`;

type Turn = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { reply: "", error: "The knowledge map isn't configured yet (no API key on the server)." },
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
  // Map tools + the knowledge tool. Cache the last entry so the whole tool block is cached.
  const allTools = [...TOOL_SCHEMAS, PLACE_KNOWLEDGE_SCHEMA];
  const tools = allTools.map((t, i) =>
    i === allTools.length - 1 ? { ...t, cache_control: { type: "ephemeral" as const } } : t,
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
              out = tu.name === "place_knowledge"
                ? await runPlaceKnowledge(
                    tu.input as { lat?: number; lon?: number },
                    loc ? { lat: loc.lat, lon: loc.lon } : undefined,
                  )
                : await runTool(
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
