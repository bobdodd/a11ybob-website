import { placeKnowledge } from "./placeKnowledge";

/* place_knowledge — the Knowledge Map's extra tool (v2).
 *
 * Wraps the traffic-warmed Wikipedia cache in @/lib/placeKnowledge as a tool the chat loop
 * can call for a place's IDENTITY — what it is known for, its history and character — as
 * opposed to the spatial "what's around me" the map tools answer. It lives HERE, not in
 * map-tools.ts, so it is added ONLY to the Knowledge Map's chat route and the Conversational
 * Map stays exactly as it was.
 *
 * The model narrates the returned extracts and always states `source` + `freshness` (never
 * invents). `freshness` is computed here so the model never has to do date maths. */

export const PLACE_KNOWLEDGE_SCHEMA = {
  name: "place_knowledge",
  description:
    "Cited knowledge about a place and what is notable around a point, from two open sources (served via a cache): WIKIPEDIA (facts about places, landmarks and features) and WIKIVOYAGE (the travel-guide character of a district or area — what it's like, what it's known for). Use it for a place's IDENTITY — history, character, notable nearby features — NOT for 'where am I' or 'nearest X' spatial questions (the map tools answer those). Give it the user's current coordinates for 'here', or a find_place result's coordinates for a place they name. Returns entries grouped by source, each entry with a title, extract, URL and distance, and each source with how fresh the cache is. Some entries also include structured `facts` (from Wikidata: what it is, when built/opened, architect, heritage designation, operator, website, height, population) — OFFER these rather than reciting them, and only elaborate if the user says yes. Narrate faithfully; never invent; always state WHICH source each fact came from and its freshness.",
  input_schema: {
    type: "object",
    properties: {
      lat: { type: "number", description: "Latitude of the place to describe." },
      lon: { type: "number", description: "Longitude of the place to describe." },
    },
    required: ["lat", "lon"],
  },
};

function freshnessLabel(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const day = 24 * 60 * 60 * 1000;
  if (ms < 5 * 60 * 1000) return "fetched just now";
  if (ms < day) return "cached earlier today";
  const days = Math.round(ms / day);
  return `cached ${days} ${days === 1 ? "day" : "days"} ago`;
}

export async function runPlaceKnowledge(
  input: { lat?: number; lon?: number },
  userLoc?: { lat: number; lon: number },
): Promise<unknown> {
  const lat = typeof input.lat === "number" ? input.lat : userLoc?.lat;
  const lon = typeof input.lon === "number" ? input.lon : userLoc?.lon;
  if (typeof lat !== "number" || typeof lon !== "number") {
    return { error: "No coordinates. Use the user's location for 'here', or find_place first for a named place." };
  }
  const k = await placeKnowledge(lat, lon);
  return {
    sources: k.sources.map((s) => ({
      source: s.label, // "Wikipedia" | "Wikivoyage"
      freshness: freshnessLabel(s.fetchedAt),
      count: s.articles.length,
      articles: s.articles.slice(0, 6).map((a) => ({
        title: a.title,
        extract: a.extract,
        url: a.url,
        distance_m: a.distance_m,
        facts: a.facts, // curated Wikidata facts — OFFER ("want more?"), don't auto-recite
      })),
    })),
  };
}
