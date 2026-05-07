import Link from "next/link";

/* Pagination — server-rendered, URL-driven. Keeps the current
   searchParams intact and only mutates the page parameter, so filters
   and search query persist as the user pages. */

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
    // The single-page count sits outside any .pagination nav, so it
    // can't rely on the .pagination > p selector. Use the muted +
    // flush utilities instead.
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
  const items: (number | "gap")[] = [];
  let prev = 0;
  for (const n of sorted) {
    if (prev && n - prev > 1) items.push("gap");
    items.push(n);
    prev = n;
  }

  return (
    <nav
      aria-label={`Pagination, ${position} of results`}
      className="pagination"
    >
      <p>
        <small>
          Results {firstShown.toLocaleString()}–{lastShown.toLocaleString()} of{" "}
          {total.toLocaleString()}
        </small>
      </p>
      <ul
        className="cluster nav-list"
        style={{ "--space": "var(--s-1)" } as React.CSSProperties}
      >
        {page > 1 && (
          <li>
            <Link href={buildHref(page - 1)} rel="prev">
              ← Previous
            </Link>
          </li>
        )}
        {items.map((it, i) =>
          it === "gap" ? (
            <li key={`gap-${i}`} aria-hidden="true">
              …
            </li>
          ) : it === page ? (
            <li key={it}>
              <span aria-current="page">{it}</span>
            </li>
          ) : (
            <li key={it}>
              <Link href={buildHref(it)} aria-label={`Page ${it}`}>
                {it}
              </Link>
            </li>
          ),
        )}
        {page < totalPages && (
          <li>
            <Link href={buildHref(page + 1)} rel="next">
              Next →
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
