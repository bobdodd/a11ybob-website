/* POST /api/knowledge-chat  — the Knowledge Map (v2).
 *
 * The Conversational Map's chat, PLUS a knowledge layer. Same front-end and the same map
 * tools (src/lib/map-tools.ts) for spatial questions, with one EXTRA tool — place_knowledge
 * (src/lib/knowledgeTool.ts) — for what a place is KNOWN for: cited Wikipedia facts, in
 * addition to what's around. A clone of /api/context-chat that adds the tool + prompt here
 * only, so the Conversational Map stays untouched. The model orchestrates and phrases; the
 * tools do the geometry; the API key stays server-side, OpenSearch stays on localhost.
 *
 * Body: { message: string, location?: {lat,lon,heading?}, history?: [{role,content}],
 *         canShowMap?: boolean, modality?: "voice"|"typed" }
 *   history is prior TEXT turns only (user/assistant). Tool calls happen inside a turn and
 *   are not replayed — the model only needs past ANSWERS for context, not past tool traffic.
 *   canShowMap: the client HAS a visual map this chat can drive (the tiled map viewer sends
 *   it; the audio-only Knowledge/Context maps don't) — gates the show_on_map tool + its
 *   prompt addendum, so the other demos are untouched. modality: how THIS message arrived —
 *   voice confirms before moving the map on a single match; typed goes direct (a typed send
 *   is already deliberate).
 * Returns: { reply: string }  (or { reply, error } on a soft failure). When the model chose
 *   to move the map, also { mapAction: { lat, lon, name?, osm_id? } } — the client recentres
 *   and (via osm_id) lands focus on the actual tile feature.
 *
 * Privacy: the message + the user's coordinates are sent to the Anthropic API to answer.
 * The viewer gates on a consent notice that discloses this. */

import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { TOOL_SCHEMAS, runTool } from "@/lib/map-tools";
import { PLACE_KNOWLEDGE_SCHEMA, runPlaceKnowledge } from "@/lib/knowledgeTool";
import { TRANSIT_NEARBY_SCHEMA, runTransitNearby } from "@/lib/transitTool";
import { MEMORY_TOOL_SCHEMAS, MemoryStore, runMemoryTool } from "@/lib/memoryTool";
import { recordQueryLocation } from "@/lib/geostats";
import { CoordGuard } from "@/lib/coordGuard";

export const dynamic = "force-dynamic";

const MODEL = process.env.CHAT_MODEL ?? "claude-haiku-4-5";
const MAX_HISTORY = 12; // prior turns kept for context (cost bound)
const MAX_TOOL_ROUNDS = 6; // safety stop on the tool loop
// Never leave the user hanging in "Thinking…": the SDK's defaults (10-minute timeout, 2
// retries) let one stalled API call hang a request for minutes — seen live 2026-07-05, a
// 100-second hang the user had to abort. Bound each model call, and the whole request.
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

/* Tool-call tracing — for debugging what the model actually ASKED the tools, which is the only
 * way to explain an answer anchored on the wrong point (e.g. the nearest 504 stop reported as
 * 502 m when the index says 77 m). A trace necessarily carries the user's question AND their
 * coordinates, so it is never on for everyone: set TRACE_TOOLS to a secret on the server, and
 * send that same secret as the `x-trace-token` request header. Only requests carrying it are
 * traced, so no ordinary visitor's location is ever written to the log and this can stay
 * enabled between sessions. Unset TRACE_TOOLS and tracing is impossible for anyone. */
const TRACE_TOKEN = process.env.TRACE_TOOLS ?? "";
const TRACE_RESULT_CHARS = 900; // a whole tool result can be tens of kB; keep the head

type TraceEntry = {
  round: number; tool: string; input: unknown; ms: number;
  refused?: boolean; error?: string; result?: unknown;
};

// Keep the shape the model saw. Truncate rather than drop: the head carries the coordinates and
// the first results, which is what any anchoring question turns on.
function traceResult(out: unknown): unknown {
  const s = JSON.stringify(out) ?? "";
  if (s.length <= TRACE_RESULT_CHARS) return out;
  return { truncated: true, bytes: s.length, head: s.slice(0, TRACE_RESULT_CHARS) };
}

const SYSTEM = `You are a spatial guide for blind and low-vision people. You help them understand and explore the world through a map database — where they are now, and anywhere they ask about. You are their eyes on the map: capable, direct, never patronising. The person is in charge; you inform, you do not shepherd.

Answer ONLY using the tools. They query a real map database (OpenStreetMap data for all of Canada plus a few other cities).

Hard rules:
- Never invent a feature, name, distance, direction, or detail. If nothing is mapped there, say so plainly: "I don't find anything mapped there."
- The tools are yours, not the user's. NEVER name one — place_knowledge, find_place, whats_nearby, area_summary, nearest_intersections, path_between, transit_nearby. And never make the lookup the SUBJECT of a sentence: not "the search returned…", "the search found…", "the results show…", "the data shows…", "the knowledge base…", "my sources didn't surface…", nor ANY paraphrase of those. Do not mention searching, looking up, querying, results, or a database, in any wording. The subject of every sentence is the place, or you — "Nothing is recorded about the building itself. It stands in the Financial District, which…". Crediting a SOURCE is the opposite of this, and required: Wikipedia, Wikivoyage, Wikidata and their freshness are the one thing a blind user cannot glance-check, and "Wikipedia describes it as…" is always welcome.
- NEVER invent coordinates. A latitude/longitude you pass to a tool must be one a tool GAVE you this turn, or the user's own location — never one you recall or estimate. For a place the user names, call find_place ALONE and WAIT for it, then call the other tool with the lat/lng from its result. Guessing a point and querying transit or knowledge there produces real distances measured from the wrong place, which is far worse than a slower answer. Calls at coordinates you were not given are refused.
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

Named features may also carry an \`info\` block of real-world detail — a heritage designation, opening_hours, phone, website, operator, or a wikipedia/wikidata link. Weave in what's RELEVANT to what they asked (a café's hours, a landmark's heritage listing) and OFFER the rest rather than reading the whole block; a wikipedia or wikidata id means there's more you can tell them about that place — including via place_knowledge — if they want it.

Be conversational — remember the last few turns so "the nearest one", "what about cafés", "how do I get there" follow naturally.

Knowledge — what a place is KNOWN for (in ADDITION to what's around it):
- You also have place_knowledge: short, CITED entries about a place and what's notable around a point, from two open sources (served via a cache) — WIKIPEDIA (facts about places, landmarks and features) and WIKIVOYAGE (the travel-guide CHARACTER of a district or area: what it's like, what it's known for, how it's laid out). It is for a place's IDENTITY — history, character, notable features — NOT for "where am I" / "nearest X" spatial questions, which the map tools answer.
- Call place_knowledge ONLY when the user asks what a place is known for, its history or story, "tell me about here / about <place>", or similar. For a place they NAME, call find_place first to get its coordinates, then place_knowledge at those coordinates; for "here" / "this area", use their current coordinates.
- It looks OUTWARD from a point: Wikipedia within 10 km, Wikivoyage within 20 km, nearest first. Most buildings have no article of their own, so what comes back is usually the NEIGHBOURS, not the place asked about — each entry's \`distance_m\` tells you which. Treat an entry as being about the place only when it sits essentially on it. When nothing is recorded about the place itself, say so plainly and then give the area — "Nothing is recorded about Roserock Place itself. It stands in the Financial District, which is…" — never explain what the lookup did or did not find.
- The tool returns entries grouped by SOURCE, and the two sources OVERLAP a lot for the same place. Do NOT recite them separately — SYNTHESISE them into ONE short, coherent description: merge what they agree on, and weave in anything unique to either (Wikivoyage is best for "what this area is like", Wikipedia for specific landmarks and facts). Synthesise only — add NOTHING beyond what the extracts say; never invent or embellish. Then credit the sources TOGETHER, once, with their freshness — e.g. "(From Wikipedia and Wikivoyage, cached 3 days ago.)". For a blind user the source and its age are the one thing they cannot glance-check, so always give them. If only one source has anything, credit just that one; if the two were cached at noticeably different times, say each. Lead with the most useful thread and offer to go deeper rather than dumping everything.
- If a source returns nothing, just don't mention that source. If NOTHING is recorded at all, say plainly that nothing is recorded for that spot yet — and that this doesn't mean there's nothing there, only that nothing is recorded. Never fall back to your own knowledge.
- Some entries also carry structured \`facts\` (from Wikidata): what it is, when built/opened, architect, architectural style, heritage designation, operator, official website, height, population. These are a LOT at once, so OFFER rather than recite them: when a place has notable facts — ESPECIALLY a \`heritage\` designation — add a short hook and stop, e.g. "This is a historic building — I've a few details on it, want them?" or "It's a designated heritage site, if you'd like to know more." Only if they say yes, give the interesting ones in a sentence or two ("Built in 1887, opened 1889, designed by Stéphen Sauvestre; a listed historic monument, about 330 metres tall."), crediting Wikidata. Pick the notable fields — never reel off every one, and never state a fact that isn't in \`facts\`.

Keep the conversation flowing — end MOST replies with a SHORT, soft hook that offers the one thing they'd likely want next, so the follow-up comes easily. This matters most by voice: there's no menu to scan, and the hook lands just as the mic re-opens, cueing the next question.
- GROUND it in what is ACTUALLY there — not a bare "anything else?". Name a real nearby thing to offer ("there's a café called Blandford just east, if you want it"), or the natural next step for what you just answered: after "where am I", offer what the area is KNOWN FOR ("I can tell you a bit about this area, if you'd like") or the nearest café/crossing; after describing surroundings, offer more on ONE feature; after transit, offer where a route heads.
- ONE clause, at the very END, after the real answer. Soft — an invitation, never a demand ("if you like", "just say", "want me to?"). Hold the no-false-cheer line: a calm companion, not a chatbot.
- NOT every turn (about two in three), and VARY the wording — never the same closer twice running. Skip it when they're clearly driving their own thread, once you're already deep in one place, and ALWAYS when you had to say nothing is recorded / nothing is nearby (a hook after "nothing here" is tone-deaf).

Transit — routes serving nearby stops (from the STATIC schedule):
- You also have transit_nearby: the public-transit routes serving stops near a point, from agencies' published static schedules (GTFS). Use it for "what transit / buses / streetcars / trains serve here", "how do I get around from here", "nearest stop", or when transit is clearly relevant to a place. For "here" use the current coordinates; for a place they NAME, find_place first, then transit_nearby there.
- It returns nearby stops, each with the routes serving it (number + name + mode + \`dest\`, the destination(s)/direction it heads there), the agency, distance, and a coarse service pattern. ALWAYS give a route as its number AND name AND where it heads — e.g. "the 20 Cliffside bus, towards Victoria Park Station" or "the 501 Queen streetcar, towards Neville Park and Long Branch" — never just the number. Say which stop and how far, and the agency. Lead with the nearest stop / most useful routes; summarise when there are many.
- Each route also carries \`sched\`: the typical timetable at that stop, split into weekday / saturday / sunday. Each has \`first\` and \`last\` (first and last departure as a 24h clock — "05:20" is 5:20am, "01:10" is 1:10am after midnight) and \`headway\` (typical minutes between departures per period: am_peak, midday, pm_peak, evening). Use it when someone asks how early/late, how often, or how well-served a route is: give the first/last bus and a typical frequency in plain words — "the first 9 Mall Express is about 6:40am, the last around 10:15pm, roughly hourly through the day". Call out weekday-vs-weekend differences when they matter ("less on Sundays — first one's about 10:30am"). Round and hedge ("about", "roughly", "typically") — it's the published schedule and can change. Not every route has \`sched\`.
- Accessibility: each stop has \`wheelchair\` — "yes" = step-free / wheelchair-accessible boarding, "no" = it is not (empty = the agency didn't say). Some routes also carry \`wheel\` (yes / no / some) for wheelchair-accessible vehicles. Surface it when accessibility is relevant, or as useful colour for a blind or mobility-impaired traveller ("that stop is step-free"). State it only when the data says so — never guess when it's empty.
- KNOWLEDGE, NOT live times. First/last and typical frequency are fine — they're the timetable. But NEVER give an actual "next bus", "in X minutes", or how long until one comes — you have no real-time data and must not imply you do. If asked when the very next one is, say you have the timetable (first/last, how often) but not live arrivals. Mention the service pattern when useful ("runs daily", "weekdays only"). If transit_nearby returns nothing, say there's no stop mapped nearby in the schedule data.

Personal memory — remember / recall / forget (the user's own, kept on THEIR device, private, no expiry):
- Saving happens ONLY through the \`remember\` TOOL. Telling the user something is "saved" without having CALLED \`remember\` in this turn is a FAILURE — nothing was saved, and they will lose it. Same rule for \`forget\`. When asked to remember, the tool call comes FIRST, then the confirmation.
- "Remember where I am" (or "remember this spot as X") → \`remember\` kind 'place' with their CURRENT coordinates. If they named it, use their name as the label; if not, label it by the street or place you would describe them at, and offer once that they can name it ("Saved this spot on Hannaford Street — want to call it something?").
- "Remember that 135 bus" / "keep a list of those schools" → \`remember\` kind 'note', and put the SUBSTANCE of what you just told them in \`text\` — the route number, name, destination, first/last and frequency; the actual school names with distances — so you can read it back later WITHOUT fresh lookups. "Add this one too" = remember again with the same label, text extended.
- "Where's that spot / the cottage dock / my spot?" → \`recall\`: saved places come back with live distance and direction from where they stand NOW — answer with the clock direction as usual ("about 400 metres away, at 2 o'clock").
- If they name a place or thing you can't find on the map, try \`recall\` before saying you can't find it — it may be one of theirs.
- "What do I have remembered?" → \`recall\` and read the labels (offer detail on any one). "Forget the schools" / "forget everything" → \`forget\`, only ever when asked, and confirm what was removed.
- Be honest about what memory is: it lives on THIS device and browser only, and clearing the browser's site data erases it — say so if they ask where it's kept. Never invent a memory: if recall finds nothing, say so plainly.

Help — "what can you do?", "help", "how does this work?":
- Give a SHORT spoken tour, not a feature dump: one line of what you are (a conversational map of what's around them — with transit, what places are known for, and a personal memory), then three or four example questions spanning DIFFERENT abilities — e.g. "where am I?", "is there a step-free café near me?", "what buses serve here?", "remember where I am". Mention they can say "follow me" for a running description as they walk; that a tap anywhere (or Escape) interrupts you while you're talking — the microphone is OFF during speech, so a spoken "shush" can't be heard then; and "what did I say?" to hear what was heard. Keep it under about 90 words, end by inviting them to just try one.`;

/* The visual-map addendum — appended to SYSTEM only when the client declared
 * canShowMap. A separate cached block would fragment the prompt cache for no
 * gain: the two variants (with/without) each cache fine on their own. */
const SHOW_ON_MAP_PROMPT = `

The visual map (this user is LOOKING at a map of this conversation):
- You have show_on_map: it moves the user's visual map to a feature and highlights it. The map moving is a big event for the user — call it ONLY when they asked to GO somewhere or SEE it on the map ("take me to", "show me", "go to", "find X" clearly meaning go) — NEVER merely because an answer mentions places. Informational answers leave the map alone.
- Moving happens ONLY through the show_on_map TOOL. Telling the user the map is showing something, or that you're "taking" them somewhere, without having CALLED show_on_map in this turn is a FAILURE — the map did NOT move, and they are now looking at the wrong place believing it's the right one. The tool call comes FIRST, then the words.
- Coordinates follow the same hard rule as every tool: from find_place THIS turn (or the user's own location), never invented. Pass the result's osm_id when it has one — that is what lets the map highlight the exact feature rather than just the spot.
- Several plausible matches: name at most THREE, each with what tells it apart (street, containing place) plus distance and direction, then ask which — and show the chosen one when they answer. Offer more only if none fits.
- The message context says whether it was SPOKEN or TYPED. SPOKEN + one confident match: confirm before moving — "<name>, <distance> <direction> — go?" — and call show_on_map only after they agree (their "yes" refers to your offer). TYPED: show it directly with the answer; typing a request is already deliberate.
- When you move the map, SAY so as part of the answer ("Taking you there — it's on the map now"), because a blind user cannot see the viewport change.`;

const SHOW_ON_MAP_SCHEMA = {
  name: "show_on_map",
  description:
    "Move the user's VISUAL map to a place and highlight it. Only for explicit go/show requests — see the system prompt. lat/lon must come from a find_place result this turn (or be the user's own location); pass the result's osm_id when present so the exact feature is highlighted.",
  input_schema: {
    type: "object",
    properties: {
      lat: { type: "number" },
      lon: { type: "number" },
      name: { type: "string", description: "The place's display name, for the map's records." },
      osm_id: { type: "string", description: "The osm_id from the find_place result, when it has one." },
    },
    required: ["lat", "lon", "name"],
  },
};

type Turn = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { reply: "", error: "The knowledge map isn't configured yet (no API key on the server)." },
      { status: 503 },
    );
  }

  let body: {
    message?: string; location?: { lat: number; lon: number; heading?: number };
    history?: Turn[]; memory?: unknown; canShowMap?: boolean; modality?: string;
  };
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
  const canShowMap = body.canShowMap === true;
  const modality = body.modality === "voice" ? "SPOKEN" : body.modality === "typed" ? "TYPED" : null;
  // The confirm-before-moving rule lives HERE, at the point of decision, not
  // only in the system prompt — buried there, the model moved the map on a
  // fresh spoken request without confirming (seen live on first deploy).
  const modalityNote = !canShowMap || !modality ? ""
    : modality === "SPOKEN"
    ? ` [This message was SPOKEN. Rule for show_on_map: if this message is itself the agreement to a move you offered (a "yes"), or explicitly says to go NOW, call it. Otherwise, for a fresh spoken request to go somewhere, do NOT call it yet — name the match with distance and direction and ask "— go?", and move only on their next yes.]`
    : ` [This message was TYPED. If they asked to go somewhere and you have the match, CALL the show_on_map tool now — no confirmation step — and only then say it's on the map. Words without the tool call leave the map unmoved.]`;
  const locNote = (loc
    ? `\n\n[The user is at latitude ${loc.lat}, longitude ${loc.lon}${facingNote}. Use this for "here"/"nearby"; for anywhere else, find_place first.]`
    : `\n\n[The user's current location is not available — ask them to name a place, or to enable location.]`) + modalityNote;

  const messages: Anthropic.Messages.MessageParam[] = [
    ...history.map((t) => ({ role: t.role, content: t.content })),
    { role: "user", content: message + locNote },
  ];

  // Trace only when this request proves it knows the server's secret. Any other request — every
  // real visitor — is neither traced nor logged.
  const tracing = TRACE_TOKEN.length > 0 && req.headers.get("x-trace-token") === TRACE_TOKEN;
  const trace: TraceEntry[] = [];
  if (tracing) console.log(`[knowledge-chat trace] request ${JSON.stringify({ message, loc, heading })}`);

  // The user's personal memory, sent by the client from THEIR device and handed back
  // (updated) for the client to persist. Never stored server-side.
  const memory = new MemoryStore(body.memory);
  const withMemory = (payload: Record<string, unknown>) =>
    NextResponse.json({
      ...payload,
      ...(memory.changed ? { memory: memory.items } : {}),
      ...(tracing ? { trace } : {}),
    });

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // Cache the (large, stable) system prompt + tools so every turn after the first is cheap.
  // The canShowMap variant appends the visual-map addendum — each variant caches on its own.
  const system: Anthropic.Messages.TextBlockParam[] = [
    { type: "text", text: canShowMap ? SYSTEM + SHOW_ON_MAP_PROMPT : SYSTEM, cache_control: { type: "ephemeral" } },
  ];
  // Map tools + the knowledge & transit tools. Cache the last entry so the whole tool block is cached.
  const allTools = [
    ...TOOL_SCHEMAS, PLACE_KNOWLEDGE_SCHEMA, TRANSIT_NEARBY_SCHEMA, ...MEMORY_TOOL_SCHEMAS,
    ...(canShowMap ? [SHOW_ON_MAP_SCHEMA] : []),
  ];
  const tools = allTools.map((t, i) =>
    i === allTools.length - 1 ? { ...t, cache_control: { type: "ephemeral" as const } } : t,
  ) as unknown as Anthropic.Messages.Tool[];

  // A tool may only be given a coordinate the map handed back, or the user's own. See coordGuard.
  const guard = new CoordGuard(loc ? { lat: loc.lat, lon: loc.lon } : undefined);

  // The model's decision to move the visual map, carried out CLIENT-side: the
  // last show_on_map call of the turn wins (they should never stack anyway).
  // A ref holder, not a bare let: the assignment happens inside the tool-loop
  // callback and TS's flow analysis would narrow a let to never at use sites.
  const mapAction: { current: { lat: number; lon: number; name?: string; osm_id?: string } | null } = { current: null };
  const withMap = (payload: Record<string, unknown>) =>
    withMemory({ ...payload, ...(mapAction.current ? { mapAction: mapAction.current } : {}) });

  // Detects a reply CLAIMING the map moved when show_on_map was never called
  // (seen live: "Taking you there — it's on the map now" with no tool call,
  // roughly one turn in three on Haiku despite the prompt). One repair round
  // sends the model back to make the call; the claim must never outrun the map.
  const CLAIMS_MOVE = /\b(?:on the map now|taking you (?:there|to)|now showing|map (?:is )?(?:now )?(?:showing|cent(?:re|er)ed|cent(?:re|er)ing)|moved the map)\b/i;
  let repairedOnce = false;

  const t0 = Date.now();
  const toolsUsed: string[] = [];
  try {
    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      // Out of budget (a stalled call already ate the time): answer SOMETHING, as a normal
      // reply — not an error — so a hands-free conversation stays alive for the retry.
      if (Date.now() - t0 > REQUEST_BUDGET_MS) {
        console.error(`[knowledge-chat] BUDGET ${Date.now() - t0}ms rounds=${round} tools=${toolsUsed.join(",") || "-"}`);
        return withMemory({ reply: "I'm sorry — that answer is taking too long right now. Please ask me again." });
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
            let toolError: string | undefined;
            const tCall = Date.now();
            // Checked BEFORE anything in this round runs, so a tool called at an invented point
            // alongside the find_place that would have resolved it is refused, not answered.
            const refusal = guard.check(tu.name, tu.input);
            if (refusal) console.warn(`[knowledge-chat] refused ${tu.name} at un-sourced coordinates`);
            try {
              if (refusal) {
                out = { error: refusal };
              } else if (tu.name === "show_on_map") {
                // No server work: record the action for the response; the
                // client moves the viewport and lands focus on the feature.
                const inp = tu.input as { lat: number; lon: number; name?: string; osm_id?: string };
                mapAction.current = {
                  lat: inp.lat, lon: inp.lon,
                  ...(inp.name ? { name: inp.name } : {}),
                  ...(inp.osm_id ? { osm_id: String(inp.osm_id) } : {}),
                };
                out = { ok: true, note: `The map is now showing ${inp.name ?? "that place"}.` };
              } else if (tu.name === "remember" || tu.name === "recall" || tu.name === "forget") {
                out = runMemoryTool(
                  memory, tu.name, tu.input as Record<string, unknown>,
                  loc ? { lat: loc.lat, lon: loc.lon } : undefined, heading,
                );
              } else {
                out = await withToolTimeout(
                  tu.name === "place_knowledge"
                    ? runPlaceKnowledge(
                        tu.input as { lat?: number; lon?: number },
                        loc ? { lat: loc.lat, lon: loc.lon } : undefined,
                      )
                    : tu.name === "transit_nearby"
                    ? runTransitNearby(
                        tu.input as { lat?: number; lon?: number; radius_m?: number },
                        loc ? { lat: loc.lat, lon: loc.lon } : undefined,
                      )
                    : runTool(
                        tu.name, tu.input as Record<string, unknown>, heading,
                        loc ? { lat: loc.lat, lon: loc.lon } : undefined,
                      ),
                  tu.name,
                );
              }
              // Whatever the map handed back is now a coordinate the model may legitimately use.
              if (!refusal) guard.learn(out);
            } catch (e) {
              toolError = (e as Error).message;
              out = { error: `tool ${tu.name} failed: ${toolError}` };
            }
            if (tracing) {
              // `input` is exactly what the MODEL asked for — the coordinates it chose, before the
              // route substitutes the user's location for a missing lat/lon. That is the question.
              const entry: TraceEntry = {
                round, tool: tu.name, input: tu.input, ms: Date.now() - tCall,
                ...(refusal ? { refused: true } : {}),
                ...(toolError ? { error: toolError } : {}),
                result: traceResult(out),
              };
              trace.push(entry);
              console.log(`[knowledge-chat trace] ${JSON.stringify(entry)}`);
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
      if (canShowMap && !mapAction.current && !repairedOnce && CLAIMS_MOVE.test(reply)) {
        repairedOnce = true;
        console.warn(`[knowledge-chat] repair: reply claims a map move but show_on_map was never called`);
        messages.push({ role: "assistant", content: resp.content });
        messages.push({
          role: "user",
          content:
            "[SYSTEM CHECK — not the user speaking: you told the user the map moved, but you did NOT call show_on_map, so it has not. Call show_on_map NOW with the lat/lon (and osm_id) from this turn's find_place result, then give the same answer. Do not apologise or mention this check.]",
        });
        continue;
      }
      console.log(`[knowledge-chat] ok ${Date.now() - t0}ms rounds=${round + 1} tools=${toolsUsed.join(",") || "-"}${mapAction.current ? " map=" + (mapAction.current.name ?? "point") : ""}`);
      if (!reply) {
        // The model sometimes calls show_on_map and then says nothing (seen
        // live on a spoken "yes"): the map moved, and "I'm not sure how to
        // answer that" would contradict a completed action. Narrate the move.
        if (mapAction.current) {
          return withMap({ reply: `Taking you to ${mapAction.current.name ?? "that place"} — it's on the map now.` });
        }
        return withMap({ reply: "I'm not sure how to answer that — try rephrasing?" });
      }
      // Lead every answer with the user's facing (the ONE compass point) when known — the anchor
      // that makes the clock directions in the reply meaningful, exactly like the Context Map.
      return withMap({ reply: facingWord ? `You're facing ${facingWord}. ${reply}` : reply });
    }
    console.error(`[knowledge-chat] ROUNDS-CAP ${Date.now() - t0}ms tools=${toolsUsed.join(",") || "-"}`);
    return withMemory({ reply: "That question took more steps than I can take in one go — try narrowing it down?" });
  } catch (e) {
    console.error(`[knowledge-chat] FAIL ${Date.now() - t0}ms tools=${toolsUsed.join(",") || "-"}: ${(e as Error).message}`);
    // A timed-out call is transient: answer as a normal REPLY so the voice conversation
    // survives and the user just asks again. Other failures stay a real error.
    if (e instanceof Anthropic.APIConnectionTimeoutError) {
      return withMemory({ reply: "I'm sorry — I couldn't get an answer in time. Please ask me again." });
    }
    return NextResponse.json(
      { reply: "", error: `Something went wrong reaching the assistant: ${(e as Error).message}` },
      { status: 502 },
    );
  }
}
