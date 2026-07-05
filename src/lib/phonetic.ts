import { doubleMetaphone } from "double-metaphone";

/* Phonetic keys for a place/street name — Double-Metaphone primary+secondary codes of its
 * DISTINCTIVE words, deduped. Computed the SAME way on both sides (indexing via upsert-map, and
 * querying in find_place) so the keys line up. This is the accent/Deaf-voice layer: "Gerrard",
 * "Girard", "Gerard", "Gérard" all key to KRRT/JRRT, while "Garrett"/"Jarrett" stay distinct — so
 * it collapses the intended variants without becoming a noise cannon. It's used as a BOOSTED
 * candidate source and always scoped by geo context, never as a filter. */

// Street-type + direction + filler words carry no distinguishing sound — keying them would make
// every "… Street" collide. Key only the real name words.
const STOP = new Set([
  "st", "street", "ave", "avenue", "rd", "road", "dr", "drive", "blvd", "boulevard",
  "ln", "lane", "cres", "crescent", "crt", "court", "ct", "way", "trail", "terrace", "terr",
  "pl", "place", "cir", "circle", "hwy", "highway", "pkwy", "parkway", "sq", "square",
  "gardens", "gdns", "close", "walk", "row", "line", "the", "of", "and",
  "east", "west", "north", "south", "e", "w", "n", "s", "ne", "nw", "se", "sw",
]);

export function phoneticKeys(text?: string | null): string[] {
  if (!text) return [];
  const keys = new Set<string>();
  for (const w of text.toLowerCase().split(/[^a-z]+/)) {
    if (w.length < 3 || STOP.has(w)) continue;
    for (const k of doubleMetaphone(w)) if (k) keys.add(k);
  }
  return [...keys];
}
