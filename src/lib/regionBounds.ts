/* The bounding box of every indexed map region — the single test for "is a queried point
 * inside coverage, and which region." Generated from the tile pipeline's regions.json (the
 * source of truth); regenerate when a region is added:
 *
 *   node -e 'const r=require("regions.json").regions||require("regions.json");
 *            const a=Array.isArray(r)?r:Object.entries(r).map(([id,v])=>({id,...v}));
 *            console.log(JSON.stringify(a.filter(x=>x.bounds).map(x=>({id:x.id,
 *              n:x.bounds.north,s:x.bounds.south,e:x.bounds.east,w:x.bounds.west}))))'
 *
 * Used only for the aggregate coverage stats (which areas get queried, and where GPS lands
 * OUTSIDE all coverage — the signal for choosing new regions). Not used for search. */

export type RegionBox = { id: string; n: number; s: number; e: number; w: number };

export const REGION_BOXES: RegionBox[] = [
  { id: "toronto", n: 44, s: 43.39, e: -78.79, w: -79.83 },
  { id: "austin", n: 30.55, s: 30.1, e: -97.55, w: -98 },
  { id: "trent-lakes", n: 44.92, s: 44.41, e: -78.07, w: -78.66 },
  { id: "peterborough", n: 44.355, s: 44.26, e: -78.27, w: -78.37 },
  { id: "calgary", n: 51.21, s: 50.84, e: -113.86, w: -114.32 },
  { id: "burlington", n: 44, s: 43.03, e: -79.71, w: -80.4 },
  { id: "kitchener-waterloo", n: 44, s: 43.03, e: -80.4, w: -80.62 },
  { id: "niagara", n: 43.27, s: 42.95, e: -78.99, w: -79.71 },
  { id: "barrie", n: 44.43, s: 44.29, e: -79.58, w: -79.75 },
  { id: "quebec", n: 63, s: 44.9, e: -56, w: -79.9 },
  { id: "pei", n: 48.23, s: 45.72, e: -60.4, w: -64.8 },
  { id: "new-brunswick", n: 48.52, s: 43.77, e: -61.39, w: -69.23 },
  { id: "nova-scotia", n: 47.1, s: 43.3, e: -59.7, w: -66.5 },
  { id: "yukon", n: 69.75, s: 59.95, e: -123.5, w: -141.05 },
  { id: "newfoundland-and-labrador", n: 60.8, s: 46.4, e: -52.3, w: -67.85 },
  { id: "northwest-territories", n: 76, s: 59.95, e: -100.5, w: -138.05 },
  { id: "nunavut", n: 83.5, s: 51, e: -60, w: -122 },
  { id: "manitoba", n: 60.1, s: 48.95, e: -88, w: -102.1 },
  { id: "saskatchewan", n: 60.05, s: 48.95, e: -101, w: -110.05 },
  { id: "ontario", n: 56.95, s: 41.6, e: -74.3, w: -95.2 },
  { id: "alberta", n: 60.05, s: 48.99, e: -109.95, w: -120.05 },
  { id: "british-columbia", n: 60.05, s: 48.2, e: -113.95, w: -139.1 },
  { id: "silicon-valley", n: 37.48, s: 37.2, e: -121.75, w: -122.18 },
  { id: "zurich", n: 47.45, s: 47.31, e: 8.62, w: 8.45 },
  { id: "south-shields", n: 55.02, s: 54.95, e: -1.4, w: -1.49 },
  { id: "london", n: 51.7, s: 51.28, e: 0.34, w: -0.52 },
  { id: "new-york", n: 40.92, s: 40.48, e: -73.68, w: -74.28 },
  { id: "boston", n: 42.45, s: 42.22, e: -70.95, w: -71.25 },
  { id: "ireland", n: 55.45, s: 51.35, e: -5.3, w: -10.7 },
  { id: "ithaca", n: 42.49, s: 42.4, e: -76.44, w: -76.56 },
  { id: "buffalo", n: 43.02, s: 42.82, e: -78.75, w: -78.95 },
  { id: "rochester", n: 43.22, s: 43.05, e: -77.55, w: -77.72 },
  { id: "new-haven", n: 41.34, s: 41.28, e: -72.88, w: -72.97 },
  { id: "princeton", n: 40.38, s: 40.32, e: -74.62, w: -74.7 },
  { id: "redmond", n: 47.73, s: 47.58, e: -122.05, w: -122.22 },
  { id: "philadelphia", n: 40, s: 39.9, e: -75.1, w: -75.26 },
  { id: "providence", n: 41.86, s: 41.79, e: -71.38, w: -71.45 },
  { id: "hanover", n: 43.73, s: 43.68, e: -72.26, w: -72.32 },
];

// The region a point falls in, or null when it is outside ALL coverage (the "add a region
// here?" signal). First match wins; the boxes overlap slightly (province + city) but any
// match means "covered", which is all this needs.
export function regionAt(lat: number, lon: number): string | null {
  for (const b of REGION_BOXES) {
    if (lat <= b.n && lat >= b.s && lon >= b.w && lon <= b.e) return b.id;
  }
  return null;
}
