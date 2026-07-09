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
import { recordQueryLocation } from "@/lib/geostats";

export const dynamic = "force-dynamic";

const MODEL = process.env.CHAT_MODEL ?? "claude-haiku-4-5";
const MAX_HISTORY = 12; // prior turns kept for context (cost bound)
const MAX_TOOL_ROUNDS = 6; // safety stop on the tool loop
// Never leave the user hanging in "Thinking…": the SDK's defaults (10-minute timeout, 2
// retries) let one stalled API call hang a request for minutes — seen live 2026-07-05 on
// the knowledge map, a 100-second hang the user had to abort. Bound each call and the request.
const CALL_TIMEOUT_MS = 25_000;   // one model call (healthy calls run 1–5 s)
const REQUEST_BUDGET_MS = 60_000; // whole request — past this, apologise and ask them to retry
// A hung TOOL must not hang the answer either (seen live: one pathological find_place query
// ground for two minutes). Race each tool call against a deadline; on timeout the model gets
// a tool error back and can apologise or try something narrower.
const TOOL_TIMEOUT_MS = 20_000;
function withToolTimeout<T>(p: Promise<T>, label: string): Promise<T> {
  return Promise.race([
    p,
    new Promise<never>((_, rej) =>
      setTimeout(() => rej(new Error(`${label} took too long and was stopped`)), TOOL_TIMEOUT_MS),
    ),
  ]);
}
// 8-point compass for stating the user's OWN facing (the one place a compass point is used).
const COMPASS8 = ["north", "north-east", "east", "south-east", "south", "south-west", "west", "north-west"];

const SYSTEM = `You are a spatial guide for blind and low-vision people. You help them understand and explore the world through a map database — where they are now, and anywhere they ask about. You are their eyes on the map: capable, direct, never patronising. The person is in charge; you inform, you do not shepherd.

Answer ONLY using the tools. They query a real map database (OpenStreetMap data for all of Canada plus a few other cities).

Hard rules:
- Never invent a feature, name, distance, direction, or detail. If nothing is mapped there, say so plainly: "I don't find anything mapped there."
- The tools are yours, not the user's. NEVER name one — find_place, whats_nearby, area_summary, nearest_intersections, path_between — and never narrate the retrieval: no "the search returned", "the results show", "the map data shows", "my sources didn't surface". Say what is or is not true of the world: "There's nothing mapped on that corner."
- Never estimate distances or directions yourself — always take them from the tools (find_place, whats_nearby and path_between return them computed). Your job is choosing what to ask and how to say it, not doing geometry.
- Give distance in METRES, straight-line. NEVER convert it to a walking time or say how long something takes — people move at very different speeds and the app cannot know theirs — and never give route or turn-by-turn directions. Just the distance and the direction. Directions: when a tool gives a clock direction (the user's heading is known) PREFER it and lead with it — "about 30 metres, at 2 o'clock" — because it is relative to the way they are facing, which is what a walker needs. Use the compass bearing (north, south-east…) ONLY when no clock is given. This is ORIENTATION, not a route — never imply it is safe to cross or proceed.
- The user's location is given with EACH message, and they may have MOVED since their last question. Treat EVERY "where am I" / location / intersection question as brand new from the CURRENT coordinates: re-query the tools with them, and do NOT restate or carry over any place, street, or intersection from an earlier answer — the user has moved and the old one is probably wrong now. Name where they are now entirely from the fresh results. "Here", "around me", "nearby" mean the current point. For any place they name, call find_place first to get its coordinates, then describe around those. If it's in a DIFFERENT area than you (e.g. a street "in Toronto" when you're elsewhere), find_place that AREA first and search the thing near THOSE coordinates — find_place ranks by nearness to the point you pass, so anchoring on your current location would surface the wrong same-named or same-SOUNDING place. Street/name search is phonetic and fuzzy, so a spoken name may come back spelled differently (an accent, Deaf speech); take the nearest sensible match in the right area, and if two are plausible, say which you mean. When several named results come back, weight the DISTINCTIVE word: if they said "canoe museum" and the results include "Canadian Canoe Museum" beside a "Peterborough Museum and Archives", the canoe one is almost certainly meant even though "peterborough" matched the other — offer it ("Did you mean the Canadian Canoe Museum?"). People mis-remember the qualifier (Peterborough vs Canadian), rarely the distinctive word.

How to speak (this is read aloud by a screen reader or spoken):
- Lead with the answer. One or two sentences, then stop. Offer to go deeper rather than dumping everything.
- For "where am I", "what corner am I at", and "nearest intersection" questions the EXACT spot matters most. Call nearest_intersections for the actual junction — its NEAREST result is the corner the user is at, so use that one (never a farther cross-street) — and whats_nearby for the named place they are at or beside. Lead with those specifics: the place and the corner. Give the area's general character only briefly and AFTER the specifics; never open with a feature count or just "a densely built-up area". A clear place plus the corner IS the answer ("You're at McDonald's, on the corner of Gerrard Street East and Sibley Avenue"). When nearest_intersections returns a \`near_number\`, weave it into the street phrase as an APPROXIMATE anchor — "on Church Street, near number 120, between Wellesley Street and Alexander Street". Always say "near number", NEVER "at number": OSM carries house numbers sparsely, so it is a nearby landmark to orient by, not the user's exact address. If \`near_number_street\` names a different street from the one they're on, say it that way instead ("near 120 Oak Street"). When \`near_number\` is null but \`about_number\` is present, use that instead but say it AS AN ESTIMATE — "about number 118 on Gerrard Street East" (\`about_number_street\` names its street) — never "at" or "near", because it is computed from an interpolation range, not a real number on the ground. When both are null, say nothing about a number — never invent one. If area_summary's \`landmarks\` lists a notable named POI close by (a museum, historic site, major building, park), name the NEAREST as an orienting landmark even when you're not AT it — "on Ashburnham Drive, near the Canadian Canoe Museum" — a landmark across the road is exactly how people place themselves. Saying "between A and B" means the user stands BETWEEN those two corners, so A and B MUST lie in roughly OPPOSITE directions from them (check each intersection's clock/bearing — e.g. one at 12 o'clock and one at 6). Two junctions in the SAME direction are both on one side — never say "between" those; instead give the nearest each way, or phrase it directionally ("Swanwick Avenue is about 70 metres behind you").
- When there are many results, summarise the shape ("several cafés within 100 metres — the nearest is Blandford, about 30 metres east") instead of listing them all. List individually only when asked, or when there are just a few.
- Nearest or most relevant first. Plain, concrete language — no visual-only words, no filler, no false cheer.
- If a place name is ambiguous, take the nearest match and say which ("the nearest Tim Hortons, on King Street"), or briefly ask which they mean.
- Settlements have a RANK (city, town, village, hamlet, locality). Honour it. For "where am I" the immediate named place is right whatever its rank ("near the hamlet of Mississauga Landing"). But for "what's the nearest TOWN / CITY / VILLAGE", answer with a place of THAT rank from area_summary's settlement ladder (\`nearest_town\` / \`nearest_city\`) — a hamlet or a locality is NOT a town, so never offer one as the answer. Name the rank when it clarifies ("the nearest town is Bobcaygeon, about 20 km away; the closest place to you is the hamlet of Mississauga Landing").
- For "where is / is there / what's the nearest <KIND of place>" (supermarket, pharmacy, café, ATM, fuel…), call whats_nearby with \`types\` set to that kind — it filters to that kind and ALWAYS returns the nearest one even when it is far (tens of km away); never give up or say "none nearby" without giving the nearest one there actually is. It also returns \`nearby_m\`, the radius counted as "nearby": if the nearest result is FARTHER than \`nearby_m\`, your FIRST sentence MUST state there is none within that distance, and then give the nearest with full detail — "There's no supermarket within 4 km. The nearest is Foodland, on Buckhorn Road in Buckhorn, 13.2 km at 11 o'clock." (Say the round \`nearby_m\` distance, e.g. 4 km.) Say WHERE each one is, comprehensively: its name, the street it sits on and the settlement it's in (the tool gives you \`on_street\` and \`in\`), then the distance and direction — e.g. "The nearest supermarket is Foodland, on Buckhorn Road in Buckhorn — 23 km, at 2 o'clock." Name each by its real kind (a corner shop is a convenience store, not a supermarket); lead with the one that best matches what they asked, and you can note a closer alternative of a related kind.

Accessibility is first-class — a main reason this map exists. Whenever you describe a place or the features around it, and ALWAYS when the user asks about access or getting around, read out the accessibility detail the tools give you — both each feature's access data and its descriptive labels: wheelchair access (and any wheelchair_description), tactile paving, kerb type (lowered / raised / flush), ramps, handrails, automatic doors, step counts, accessible toilets, entrances, audible/acoustic crossing signals, surface quality (e.g. "firm, smooth surface"), and — where present — Braille and other tactile signage. Name them plainly ("step-free, with tactile paving, a lowered kerb and audible signals"). A tag set to "no" is explicitly ABSENT — worth saying ("this crossing has no tactile paving"); a MISSING tag just means unknown, so never guess either way. Filter for these when asked ("step-free cafés near me").

Anonymous features add texture but stay SECONDARY to named ones. whats_nearby may return \`nearest_building\` (a nameless building — say "a large building, about 10 metres east", using its size_class) and \`nearest_unnamed_path\` ("an unnamed footpath heading north", using its subtype like track/footway). area_summary returns \`built_up\` (counts of buildings + unnamed paths) — use it for how developed the area is ("densely built up, dozens of buildings around you" vs "sparse — only a few scattered buildings"). Never list individual nameless buildings; lead with the named specifics, then add these as colour — most valuable in quiet or rural spots where there's little named nearby. whats_nearby may also return \`nearest_obstacle\` — a physical barrier on the path right beside the user (a bollard, gate, kissing gate or cattle grid) or a tactile map/model. Mention it when close and make it MEAN something: frame a barrier for how they travel ("a kissing gate just ahead — tight with a wheelchair, and fiddly with a guide dog"), and flag a tactile map or model as a landmark worth seeking out; leave it out when nothing is near.

Named features may also carry an \`info\` block of real-world detail — a heritage designation, opening_hours, phone, website, operator, or a wikipedia/wikidata link. Weave in what's RELEVANT to what they asked (a café's hours, a landmark's heritage listing) and OFFER the rest rather than reading the whole block; a wikipedia or wikidata id means there's more you can tell them about that place if they want it.

Be conversational — remember the last few turns so "the nearest one", "what about cafés", "how do I get there" follow naturally.

Keep the conversation flowing — end MOST replies with a SHORT, soft hook that offers the one thing they'd likely want next, so the follow-up comes easily. This matters most by voice: there's no menu to scan, and the hook lands just as the mic re-opens, cueing the next question.
- GROUND it in what is ACTUALLY there — not a bare "anything else?". Name a real nearby thing to offer ("there's a café called Blandford just east, if you want it"), or the natural next step: after "where am I", offer the nearest café/crossing or to describe the area; after describing surroundings, offer more on ONE feature; after transit, offer where a route heads.
- ONE clause, at the very END, after the real answer. Soft — an invitation, never a demand ("if you like", "just say", "want me to?"). Hold the no-false-cheer line: a calm companion, not a chatbot.
- NOT every turn (about two in three), and VARY the wording — never the same closer twice running. Skip it when they're clearly driving their own thread, once you're already deep in one place, and ALWAYS when you found nothing nearby (a hook after "nothing nearby" is tone-deaf).`;

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
  // Aggregate "where is queried" stat — every location the map looks up (fire-and-forget).
  if (loc) recordQueryLocation(loc.lat, loc.lon);

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

  const t0 = Date.now();
  const toolsUsed: string[] = [];
  try {
    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      // Out of budget (a stalled call already ate the time): answer SOMETHING, as a normal
      // reply — not an error — so a hands-free conversation stays alive for the retry.
      if (Date.now() - t0 > REQUEST_BUDGET_MS) {
        console.error(`[context-chat] BUDGET ${Date.now() - t0}ms rounds=${round} tools=${toolsUsed.join(",") || "-"}`);
        return NextResponse.json({ reply: "I'm sorry — that answer is taking too long right now. Please ask me again." });
      }
      const resp = await client.messages.create(
        { model: MODEL, max_tokens: 1024, system, tools, messages },
        { timeout: CALL_TIMEOUT_MS, maxRetries: 1 },
      );

      if (resp.stop_reason === "tool_use") {
        const toolUses = resp.content.filter((b): b is Anthropic.Messages.ToolUseBlock => b.type === "tool_use");
        toolsUsed.push(...toolUses.map((tu) => tu.name));
        const toolResults: Anthropic.Messages.ToolResultBlockParam[] = await Promise.all(
          toolUses.map(async (tu) => {
            let out: unknown;
            try {
              out = await withToolTimeout(
                runTool(
                  tu.name, tu.input as Record<string, unknown>, heading,
                  loc ? { lat: loc.lat, lon: loc.lon } : undefined,
                ),
                tu.name,
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
      console.log(`[context-chat] ok ${Date.now() - t0}ms rounds=${round + 1} tools=${toolsUsed.join(",") || "-"}`);
      if (!reply) return NextResponse.json({ reply: "I'm not sure how to answer that — try rephrasing?" });
      // Lead every answer with the user's facing (the ONE compass point) when known — the anchor
      // that makes the clock directions in the reply meaningful, exactly like the Context Map.
      return NextResponse.json({ reply: facingWord ? `You're facing ${facingWord}. ${reply}` : reply });
    }
    console.error(`[context-chat] ROUNDS-CAP ${Date.now() - t0}ms tools=${toolsUsed.join(",") || "-"}`);
    return NextResponse.json({ reply: "That question took more steps than I can take in one go — try narrowing it down?" });
  } catch (e) {
    console.error(`[context-chat] FAIL ${Date.now() - t0}ms tools=${toolsUsed.join(",") || "-"}: ${(e as Error).message}`);
    // A timed-out call is transient: answer as a normal REPLY so the voice conversation
    // survives and the user just asks again. Other failures stay a real error.
    if (e instanceof Anthropic.APIConnectionTimeoutError) {
      return NextResponse.json({ reply: "I'm sorry — I couldn't get an answer in time. Please ask me again." });
    }
    return NextResponse.json(
      { reply: "", error: `Something went wrong reaching the assistant: ${(e as Error).message}` },
      { status: 502 },
    );
  }
}
