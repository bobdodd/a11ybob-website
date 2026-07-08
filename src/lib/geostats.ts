/* Aggregate "where is the map queried" stats — WHERE, never WHO.
 *
 * Purpose (Bob, 2026-07-08): know which areas of which regions get used, and — the useful
 * part — where a user's GPS lands OUTSIDE all coverage, as the signal for choosing new
 * regions. Explicitly NOT interested in who made a request, only where was asked about.
 *
 * Privacy by construction, matching the site's aggregate-only analytics ethic:
 *   • Recorded on EVERY location the maps look up — whichever demo, whichever question, every
 *     time the app sends the user's position to the server. What keeps this from being
 *     tracking-like is the aggregation below, not withholding data: a coarse cell with no
 *     identity attached cannot follow anyone.
 *   • Binned to a COARSE ~5 km cell (0.05°). No IP, no session, no per-request row, no
 *     fine timestamp — just a running per-cell tally. Nothing per-request is stored, so
 *     there is nothing to tie back to a person.
 *   • `activeDays` (distinct days with any activity) is the honest interest metric; `count`
 *     is raw request volume (a single walk inflates it), kept only as secondary colour.
 *
 * Fire-and-forget: callers do NOT await this and it swallows its own errors — recording a
 * stat must never slow or break a user's answer.
 */

import { getDb } from "./mongo";
import { opensearch } from "./opensearch";
import { regionAt } from "./regionBounds";

const COLLECTION = "query_geostats";
const CELL_DEG = 0.05; // ~5.5 km at these latitudes — clearly aggregate, still area-meaningful
const COVERAGE_RADIUS_M = 5000; // "is this area actually in the index" test radius

// Is there real map data near this point? This — not a region bounding box — is the honest
// coverage test: the region boxes are rectangles over irregular shapes (Ontario's box reaches
// over the Great Lakes into the US Midwest), so a genuinely-uncovered point can sit inside one.
// A follow-me user with no data within a few km got nothing useful, wherever a box says they
// are — which is exactly the "add a region here?" signal.
async function isCovered(lat: number, lon: number): Promise<boolean> {
  try {
    const res = await opensearch.count({
      index: "map-features",
      body: { query: { geo_distance: { distance: `${COVERAGE_RADIUS_M}m`, location: { lat, lon } } } },
    });
    return ((res.body as { count?: number }).count ?? 0) > 0;
  } catch {
    return true; // on error, assume covered — never let a stat misfire flag a false gap
  }
}

function cell(lat: number, lon: number) {
  const li = Math.floor(lat / CELL_DEG);
  const oi = Math.floor(lon / CELL_DEG);
  return {
    key: `${li}_${oi}`,
    clat: Number(((li + 0.5) * CELL_DEG).toFixed(4)),
    clon: Number(((oi + 0.5) * CELL_DEG).toFixed(4)),
  };
}

/** Record one queried location — every location the maps look up. Fire-and-forget. */
export function recordQueryLocation(lat: number, lon: number): void {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return;

  const { key, clat, clon } = cell(lat, lon);
  const day = new Date().toISOString().slice(0, 10);

  void (async () => {
    try {
      const covered = await isCovered(lat, lon);
      const region = covered ? regionAt(lat, lon) : null; // bbox is only a LABEL for covered points
      const db = await getDb();
      // Atomic upsert via an aggregation-pipeline update: activeDays increments only when
      // this is the first activity of a new day (compares the PRE-update lastDay), so a long
      // Follow Me walk in one cell counts as one active day, not hundreds of requests.
      await db.collection<{ _id: string }>(COLLECTION).updateOne(
        { _id: key },
        [
          {
            $set: {
              region,
              out: !covered,
              clat,
              clon,
              firstDay: { $ifNull: ["$firstDay", day] },
              activeDays: {
                $add: [
                  { $ifNull: ["$activeDays", 0] },
                  { $cond: [{ $eq: ["$lastDay", day] }, 0, 1] },
                ],
              },
              lastDay: day,
              count: { $add: [{ $ifNull: ["$count", 0] }, 1] },
            },
          },
        ],
        { upsert: true },
      );
    } catch {
      /* stats are best-effort — never surface an error to the caller */
    }
  })();
}
