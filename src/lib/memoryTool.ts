/* Personal memory — "remember where I am", "remember that 135 bus", "keep a list of those
 * schools", and later "where's that spot?" with a live distance and direction.
 *
 * The store is the USER'S, and it lives on THEIR device (localStorage in the map client) —
 * personal places and notes are kept as close to the user as possible, even though, like
 * their location, they transit with each question so the model can answer from them. The
 * client sends its store with every chat request; these tools read and mutate the
 * in-request copy; the route hands the updated store back for the client to persist.
 * Nothing is ever written server-side, and the shared knowledge cache is a different thing
 * entirely — that one is everyone's and lives on the server; this one is yours and lives
 * with you.
 *
 * No expiry by design: for the users this is for, memory that quietly evaporates is worse
 * than none. The only deletion is an explicit "forget". A generous item cap bounds the
 * payload that rides along with each question.
 */

import { direction, metresBetween } from "./map-tools";

export type MemoryItem = {
  id: string;
  kind: "place" | "note";
  label: string;
  text?: string;
  lat?: number;
  lng?: number;
  created: string; // ISO date
};

const MAX_ITEMS = 200;
const MAX_LABEL = 80;
const MAX_TEXT = 600;

/* The in-request store. Built defensively from whatever the client sent (it's user-agent
 * data); `changed` tells the route whether to hand an updated store back. */
export class MemoryStore {
  items: MemoryItem[];
  changed = false;

  constructor(raw: unknown) {
    const arr = Array.isArray(raw) ? raw : [];
    this.items = arr
      .filter((x): x is Record<string, unknown> => !!x && typeof x === "object")
      .map((x) => ({
        id: String(x.id ?? "").slice(0, 40),
        kind: x.kind === "place" ? ("place" as const) : ("note" as const),
        label: String(x.label ?? "").slice(0, MAX_LABEL),
        ...(typeof x.text === "string" && x.text ? { text: x.text.slice(0, MAX_TEXT) } : {}),
        ...(typeof x.lat === "number" && typeof x.lng === "number" ? { lat: x.lat, lng: x.lng } : {}),
        created: String(x.created ?? "").slice(0, 30),
      }))
      .filter((x) => x.id && x.label)
      .slice(0, MAX_ITEMS);
  }
}

export const MEMORY_TOOL_SCHEMAS = [
  {
    name: "remember",
    description:
      "Save something to the user's PERSONAL memory — kept on their own device, private, no expiry. Two kinds. kind 'place': a location to find again later — pass a label plus lat/lon ('remember where I am' = their CURRENT coordinates; a place you just found = its coordinates). If they gave no name, label it by the street or place you would describe them at, and offer that they can name it. kind 'note': information worth keeping — pass a label plus `text`, and put the SUBSTANCE of what you just told them in `text` (route numbers, times, names, the actual list), not just a title, so you can read it back later without fresh lookups. Saving with an existing label OVERWRITES that item (updating is natural). Confirm briefly what was saved.",
    input_schema: {
      type: "object",
      properties: {
        kind: { type: "string", enum: ["place", "note"], description: "'place' = a location to find again; 'note' = information/lists to keep." },
        label: { type: "string", description: "Short name to recall it by — the user's own words when they gave any ('the cottage dock', 'the 135 bus')." },
        text: { type: "string", description: "For notes: the substance, written out. Optional context for places." },
        lat: { type: "number", description: "For places: latitude." },
        lon: { type: "number", description: "For places: longitude." },
      },
      required: ["kind", "label"],
    },
  },
  {
    name: "recall",
    description:
      "Read the user's personal memory. Use when they ask what's remembered ('what do I have saved?', 'read me my notes'), AND whenever they reference a personally-named place or thing that isn't on the map ('the cottage dock', 'my spot', 'that bus you saved') — try recall before saying you can't find something. Optional `query` filters by words in the label or text. Saved PLACES come back with live distance and direction from the user's current location — give the clock direction as usual. Never invent memory: if nothing matches, say so.",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Optional filter — words from the label or content. Omit to list everything." },
      },
    },
  },
  {
    name: "forget",
    description:
      "Remove items from the user's personal memory — ONLY when they ask. Pass `label` (or part of one) to remove matching items, or all=true to erase everything. Tell them what was removed.",
    input_schema: {
      type: "object",
      properties: {
        label: { type: "string", description: "The item to forget, by (partial) label." },
        all: { type: "boolean", description: "true = erase the entire memory." },
      },
    },
  },
];

export function runMemoryTool(
  store: MemoryStore,
  name: string,
  input: Record<string, unknown>,
  userLoc?: { lat: number; lon: number },
  heading?: number,
): unknown {
  if (name === "remember") {
    const kind = input.kind === "place" ? "place" : "note";
    const label = String(input.label ?? "").trim().slice(0, MAX_LABEL);
    if (!label) return { error: "a label is needed — ask the user what to call it" };
    const text = typeof input.text === "string" ? input.text.trim().slice(0, MAX_TEXT) : "";
    let lat = typeof input.lat === "number" ? input.lat : undefined;
    let lon = typeof input.lon === "number" ? input.lon : undefined;
    if (kind === "place" && (lat === undefined || lon === undefined)) {
      // "Remember where I am" with the coordinates left off — fall back to where they are.
      if (userLoc) { lat = userLoc.lat; lon = userLoc.lon; }
      else return { error: "a place needs coordinates and the user's location is not available" };
    }
    const existing = store.items.findIndex((i) => i.label.toLowerCase() === label.toLowerCase());
    if (existing === -1 && store.items.length >= MAX_ITEMS) {
      return { error: `memory is full (${MAX_ITEMS} items) — ask the user if there is something to forget first` };
    }
    const item: MemoryItem = {
      id: `m${Date.now().toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`,
      kind,
      label,
      ...(text ? { text } : {}),
      ...(kind === "place" ? { lat: Number(lat!.toFixed(6)), lng: Number(lon!.toFixed(6)) } : {}),
      created: new Date().toISOString().slice(0, 10),
    };
    if (existing >= 0) store.items[existing] = item;
    else store.items.push(item);
    store.changed = true;
    return { saved: { kind: item.kind, label: item.label, ...(item.text ? { text: item.text } : {}) }, updated: existing >= 0, total: store.items.length };
  }

  if (name === "recall") {
    const q = String(input.query ?? "").trim().toLowerCase();
    const match = q
      ? store.items.filter((i) => i.label.toLowerCase().includes(q) || (i.text ?? "").toLowerCase().includes(q))
      : store.items;
    const items = match.map((i) => ({
      kind: i.kind,
      label: i.label,
      ...(i.text ? { text: i.text } : {}),
      saved_on: i.created,
      // A saved place is answered RELATIVE to where the user stands now — live distance and
      // direction (clock when their facing is known), same vocabulary as every map answer.
      ...(i.kind === "place" && i.lat !== undefined && i.lng !== undefined && userLoc
        ? {
            distance_m: Math.round(metresBetween(userLoc.lat, userLoc.lon, i.lat, i.lng)),
            ...direction(userLoc.lat, userLoc.lon, i.lat, i.lng, heading),
            lat: i.lat, lng: i.lng,
          }
        : i.kind === "place" ? { lat: i.lat, lng: i.lng } : {}),
    }));
    if (!items.length) return { items: [], note: q ? `nothing remembered matches "${q}"` : "nothing remembered yet" };
    return { items, total: store.items.length };
  }

  if (name === "forget") {
    if (input.all === true) {
      const n = store.items.length;
      store.items = [];
      store.changed = true;
      return { forgot: n, note: "entire memory erased" };
    }
    const q = String(input.label ?? "").trim().toLowerCase();
    if (!q) return { error: "say what to forget — a label, or all" };
    const going = store.items.filter((i) => i.label.toLowerCase().includes(q));
    if (!going.length) return { forgot: 0, note: `nothing remembered matches "${q}"` };
    store.items = store.items.filter((i) => !going.includes(i));
    store.changed = true;
    return { forgot: going.length, labels: going.map((i) => i.label) };
  }

  return { error: `unknown memory tool ${name}` };
}
