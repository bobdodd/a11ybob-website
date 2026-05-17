import Link from "next/link";

/* Pagination — server-rendered, URL-driven. Keeps the current
   searchParams intact and only mutates the page parameter, so filters
   and search query persist as the user pages.

   Layout: count line and page-link row render as a single horizontal
   cluster so the component reads as one self-contained widget at any
   zoom level. The current page is a real link to itself (per W3C
   pattern) with aria-current="page" and a visible outlined-box +
   bold treatment — a self-contained cue that doesn't rely on
   typographic-weight comparison to neighbouring cells (relevant for
   screen-magnifier users who may see only one cell at a time). */

type Props = {
  page: number;
  totalPages: number;
  total: number;
  perPage: number;
  /** A URL with the current search params already serialised, e.g.
   *  "/writing/reviews?q=accessible&year=2024". The page param will
   *  be replaced (or appended). */
  baseUrl: string;
  /** Whether this instance sits above or below the result list.
   *  Used to disambiguate the aria-label when both are rendered, so
   *  a screen reader's landmark navigation can tell them apart. */
  position?: "top" | "bottom";
};

type Item =
  | { type: "page"; n: number }
  | { type: "gap"; from: number; to: number };

export function Pagination({
  page,
  totalPages,
  total,
  perPage,
  baseUrl,
  position = "bottom",
}: Props) {
  if (totalPages <= 1) {
    // No pagination needed. The top instance is suppressed (the live
    // region already announces the count); the bottom keeps a small
    // count line so sighted readers see a tally after the list.
    if (position === "top") return null;
    return (
      <p className="muted flush">
        <small>{total === 1 ? "1 result" : `${total.toLocaleString()} results`}.</small>
      </p>
    );
  }

  const buildHref = (p: number) => {
    const url = new URL(baseUrl, "https://placeholder.example");
    url.searchParams.set("page", String(p));
    return url.pathname + url.search;
  };

  const firstShown = (page - 1) * perPage + 1;
  const lastShown = Math.min(page * perPage, total);

  // Compact page-number window: first, last, current ±2.
  const windowed = new Set<number>([1, totalPages, page]);
  for (let p = Math.max(1, page - 2); p <= Math.min(totalPages, page + 2); p++) {
    windowed.add(p);
  }
  const sorted = [...windowed].sort((a, b) => a - b);
  const items: Item[] = [];
  let prev = 0;
  for (const n of sorted) {
    if (prev && n - prev > 1) {
      items.push({ type: "gap", from: prev + 1, to: n - 1 });
    }
    items.push({ type: "page", n });
    prev = n;
  }

  return (
    <nav
      aria-label={`Pagination, ${position} of results`}
      className="pagination cluster"
    >
      <p className="pagination__count">
        <small>
          Results {firstShown.toLocaleString()}–{lastShown.toLocaleString()} of{" "}
          {total.toLocaleString()}
        </small>
      </p>
      <ul className="cluster pagination__items">
        {page > 1 && (
          <li>
            <Link
              href={buildHref(page - 1)}
              rel="prev"
              aria-label={`Previous, page ${page - 1}`}
            >
              ← Previous
            </Link>
          </li>
        )}
        {items.map((it, i) =>
          it.type === "gap" ? (
            <li key={`gap-${i}`}>
              <span aria-hidden="true">…</span>
              <span className="visually-hidden">
                {it.from === it.to
                  ? `skipping page ${it.from}`
                  : `skipping pages ${it.from} to ${it.to}`}
              </span>
            </li>
          ) : it.n === page ? (
            <li key={it.n}>
              <Link
                href={buildHref(it.n)}
                aria-current="page"
                aria-label={`Current page, page ${it.n}`}
                className="pagination__current"
              >
                {it.n}
              </Link>
            </li>
          ) : (
            <li key={it.n}>
              <Link href={buildHref(it.n)} aria-label={`Page ${it.n}`}>
                {it.n}
              </Link>
            </li>
          ),
        )}
        {page < totalPages && (
          <li>
            <Link
              href={buildHref(page + 1)}
              rel="next"
              aria-label={`Next, page ${page + 1}`}
            >
              Next →
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
