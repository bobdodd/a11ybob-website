/* Coordinates a tool is given must have COME from somewhere.
 *
 * Traced live 2026-07-09: asked for the nearest 504 stop to 121 King West, the model issued
 * transit_nearby at {43.6426, -79.3871} — a point it invented — in the SAME round as the
 * find_place that would have told it the real answer (43.6473, -79.383046), 616 m away. The
 * tool answered faithfully for the invented point, and the user was told, with confident
 * specifics, about stops near somewhere they never asked about. Distances that are real but
 * measured from the wrong place are the worst kind of wrong for someone who cannot glance at
 * a map: nothing about the answer looks like an error.
 *
 * So make it structurally impossible rather than merely forbidden. Every coordinate a tool
 * RETURNS is remembered, along with the user's own location. A tool that CONSUMES a coordinate
 * may only be given one of those. Anything else never came from the map, and the call is
 * refused with an error the model can act on — it resolves the place properly and retries, and
 * the user sees nothing but the right answer.
 *
 * Scope is one turn. The chat replays prior TEXT turns only, never prior tool traffic, so a
 * coordinate from an earlier turn is not something the model can legitimately still hold — it
 * would be recalling a number it saw, which is exactly the failure this guards. find_place is
 * deliberately NOT guarded: its `near` only biases ranking, and it is the very tool the model
 * must be able to call to LEARN a coordinate. */

export type LatLon = { lat: number; lon: number };

// Generous enough for a model that rounds a returned -79.383046 to -79.3830 (~4 m), tight
// enough that the 616 m invention is nowhere near it.
const TOLERANCE_M = 30;

// Tools that act AT a point. find_place is absent by design (see above).
export const COORD_CONSUMING = new Set([
  "whats_nearby",
  "area_summary",
  "nearest_intersections",
  "path_between",
  "transit_nearby",
  "place_knowledge",
  // Moving the user's visual map to an invented point would be worse than a
  // wrong answer — it silently relocates their whole context.
  "show_on_map",
]);

function metresBetween(a: LatLon, b: LatLon): number {
  const R = 6371000, rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLon = (b.lon - a.lon) * rad * Math.cos(((a.lat + b.lat) / 2) * rad);
  return R * Math.sqrt(dLat * dLat + dLon * dLon);
}

function isFiniteNum(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

// A point can be spelled {lat,lon} or {lat,lng} — tools return lng, the schemas ask for lon.
function pointOf(o: Record<string, unknown>): LatLon | null {
  const lat = o.lat;
  const lon = o.lon ?? o.lng;
  return isFiniteNum(lat) && isFiniteNum(lon) ? { lat, lon } : null;
}

/** Every point anywhere inside a value — tool results nest them in arrays and sub-objects. */
export function harvestPoints(value: unknown, out: LatLon[] = [], depth = 0): LatLon[] {
  if (depth > 6 || value === null || typeof value !== "object") return out;
  if (Array.isArray(value)) {
    for (const v of value) harvestPoints(v, out, depth + 1);
    return out;
  }
  const o = value as Record<string, unknown>;
  const p = pointOf(o);
  if (p) out.push(p);
  for (const v of Object.values(o)) harvestPoints(v, out, depth + 1);
  return out;
}

/** The points a tool call is asking to act AT — the top level, and path_between's from/to. */
export function pointsRequested(input: unknown): LatLon[] {
  if (input === null || typeof input !== "object") return [];
  const o = input as Record<string, unknown>;
  const out: LatLon[] = [];
  const top = pointOf(o);
  if (top) out.push(top);
  for (const key of ["from", "to"]) {
    const sub = o[key];
    if (sub && typeof sub === "object") {
      const p = pointOf(sub as Record<string, unknown>);
      if (p) out.push(p);
    }
  }
  return out;
}

export class CoordGuard {
  private known: LatLon[] = [];

  constructor(userLocation?: LatLon) {
    if (userLocation) this.known.push(userLocation);
  }

  /** Remember every coordinate a tool handed back; those are the legitimate ones. */
  learn(toolResult: unknown): void {
    for (const p of harvestPoints(toolResult)) this.known.push(p);
  }

  isKnown(p: LatLon): boolean {
    return this.known.some((k) => metresBetween(k, p) <= TOLERANCE_M);
  }

  /**
   * null when the call may proceed; otherwise the error to hand back to the model, phrased so
   * it does the right thing next round rather than apologising to the user.
   */
  check(tool: string, input: unknown): string | null {
    if (!COORD_CONSUMING.has(tool)) return null;
    for (const p of pointsRequested(input)) {
      if (!this.isKnown(p)) {
        return (
          `Refused: latitude ${p.lat}, longitude ${p.lon} was not returned by any tool this turn, ` +
          `and is not the user's location. Never use coordinates you have not been given. ` +
          `Call find_place for the place first, then call ${tool} with the lat/lng from its result.`
        );
      }
    }
    return null;
  }
}
