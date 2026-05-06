/* FilterBar — replaces the sidebar facets pattern.
 *
 * Active filters always render as removable chips at the top of the
 * results region, where every user can see them — including
 * screen-magnifier users zoomed in on the result column, who would
 * never reach a left sidebar. Inactive filter options live behind
 * a disclosure (closed by default) so they don't compete with the
 * results for attention.
 *
 * Toggle semantics mirror the existing facetHref convention:
 *   - clicking a chip's × removes that axis filter
 *   - clicking an inactive option in the disclosure adds it
 *   - clicking an active option in the disclosure removes it (it's
 *     also offered as a chip above; both removers work)
 *
 * Visual style: active filters reuse the .pill aria-pressed=true look
 * so the user's filter affordance and the cross-corpus toggle pills
 * share one vocabulary. */

import Link from "next/link";

export type FilterOption = {
  value: string;
  count: number;
  /** Optional display label; defaults to value. */
  label?: string;
};

export type FilterAxis = {
  /** URL search-param name. */
  name: string;
  /** Visible heading, e.g. "Domain". */
  label: string;
  /** Currently selected value, if any. */
  active?: string;
  /** All possible options for this axis, with counts. */
  options: FilterOption[];
};

type Props = {
  /** Page URL with all current params (q, filters, includes) preserved. */
  baseUrl: string;
  axes: FilterAxis[];
};

export function FilterBar({ baseUrl, axes }: Props) {
  const activeAxes = axes.filter((a) => a.active);
  const inactiveAxesWithOptions = axes
    .map((a) => ({
      ...a,
      // Don't list the active option again — it's a chip above.
      options: a.options.filter((o) => o.value !== a.active),
    }))
    .filter((a) => a.options.length > 0);

  if (activeAxes.length === 0 && inactiveAxesWithOptions.length === 0) {
    return null;
  }

  return (
    <div
      className="filter-bar stack"
      style={{ "--space": "var(--s-1)" } as React.CSSProperties}
    >
      {activeAxes.length > 0 && (
        <ul
          className="cluster"
          aria-label="Active filters"
          style={
            {
              "--space": "var(--s-2)",
              listStyle: "none",
              paddingInlineStart: 0,
              marginBlock: 0,
            } as React.CSSProperties
          }
        >
          {activeAxes.map((axis) => (
            <li key={axis.name}>
              <Link
                href={toggleFacet(baseUrl, axis.name, axis.active!, axis.active)}
                className="pill"
                aria-pressed="true"
                aria-label={`Remove filter: ${axis.label} ${labelOf(axis, axis.active!)}`}
              >
                {axis.label}: {labelOf(axis, axis.active!)}{" "}
                <span aria-hidden="true">×</span>
              </Link>
            </li>
          ))}
          {activeAxes.length > 1 && (
            <li>
              <Link href={clearAll(baseUrl, axes.map((a) => a.name))}>
                <small>Clear all filters</small>
              </Link>
            </li>
          )}
        </ul>
      )}

      {inactiveAxesWithOptions.length > 0 && (
        <details className="filter-disclosure">
          <summary>
            <span style={{ fontSize: "var(--s0)" }}>Filter</span>
          </summary>
          <div
            className="stack"
            style={
              {
                "--space": "var(--s0)",
                marginBlockStart: "var(--s-1)",
              } as React.CSSProperties
            }
          >
            {inactiveAxesWithOptions.map((axis) => (
              <section key={axis.name}>
                <h3 style={{ fontSize: "var(--s0)", marginBlock: 0 }}>
                  {axis.label}
                </h3>
                <ul
                  className="cluster"
                  style={
                    {
                      "--space": "var(--s-2)",
                      listStyle: "none",
                      paddingInlineStart: 0,
                      marginBlockStart: "var(--s-2)",
                    } as React.CSSProperties
                  }
                >
                  {axis.options.map((opt) => (
                    <li key={opt.value}>
                      <Link
                        href={toggleFacet(
                          baseUrl,
                          axis.name,
                          opt.value,
                          axis.active,
                        )}
                        className="pill"
                        aria-pressed="false"
                      >
                        {opt.label ?? opt.value}{" "}
                        <small style={{ opacity: 0.75 }}>({opt.count})</small>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

function labelOf(axis: FilterAxis, value: string): string {
  return axis.options.find((o) => o.value === value)?.label ?? value;
}

function toggleFacet(
  baseUrl: string,
  key: string,
  value: string,
  current: string | undefined,
): string {
  const url = new URL(baseUrl, "https://placeholder.example");
  if (current === value) {
    url.searchParams.delete(key);
  } else {
    url.searchParams.set(key, value);
  }
  url.searchParams.delete("page");
  return url.pathname + (url.search || "");
}

function clearAll(baseUrl: string, names: string[]): string {
  const url = new URL(baseUrl, "https://placeholder.example");
  for (const n of names) url.searchParams.delete(n);
  url.searchParams.delete("page");
  return url.pathname + (url.search || "");
}
