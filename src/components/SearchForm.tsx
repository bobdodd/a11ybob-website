/* SearchForm — server-rendered GET form. The submit button is real;
   no JS required. The form action targets the same URL so existing
   search params (filters) on the page are preserved through hidden
   inputs.

   The optional `includes` prop renders pill-shaped checkboxes below
   the search row, used to opt other corpora into the current search.
   Submitting the form passes them as query params.

   Once a search has run (an `href` is provided per include), the
   pill is rendered as a next/link Link so the toggle navigates
   client-side. That keeps the result-status live region in the DOM
   across the navigation, allowing the screen reader to announce the
   updated count as a real change rather than as fresh page load
   content (which is unreliably announced). */

import Link from "next/link";
import { SearchSuggest } from "./SearchSuggest";

type Include = {
  /** Query-param name, e.g. "reviews". Submitted as "?<name>=1". */
  name: string;
  /** Visible label, e.g. "+ Reviews". */
  label: string;
  /** Whether the toggle is currently on (derived from URL state). */
  checked: boolean;
  /** When provided, the pill is rendered as a link to this URL — used
   *  once results are showing, so toggling re-runs the search
   *  immediately rather than waiting for the Search button. The URL
   *  must already represent the *toggled* state. */
  href?: string;
};

type Props = {
  /** Current search query, to prefill the input. */
  q?: string;
  /** Form action URL — usually the current path. */
  action: string;
  /** Other current search params to pass through as hidden inputs
   *  so that submitting the form preserves filters. The "q" and
   *  "page" params are excluded automatically. */
  preserve?: Record<string, string | undefined>;
  /** Visible hint rendered as <small> beneath the input. Replaces
   *  placeholder text, which fails AAA contrast in every browser's
   *  default styling. */
  hint?: string;
  label?: string;
  /** Pill checkboxes rendered beneath the search row. */
  includes?: Include[];
};

export function SearchForm({
  q = "",
  action,
  preserve = {},
  hint,
  label = "Search this page",
  includes = [],
}: Props) {
  // Don't pass through anything that's also a controlled include —
  // the checkbox itself is the source of truth for those names.
  const includeNames = new Set(includes.map((i) => i.name));
  const passthrough = Object.entries(preserve).filter(
    ([k, v]) => v && k !== "q" && k !== "page" && !includeNames.has(k),
  );

  return (
    <form
      role="search"
      action={action}
      method="get"
      className="stack"
      style={{ "--space": "var(--s-1)" } as React.CSSProperties}
    >
      <div
        className="cluster"
        style={{ "--space": "var(--s-1)" } as React.CSSProperties}
      >
        <SearchSuggest
          id="search-input"
          name="q"
          defaultValue={q}
          hintId={hint ? "search-hint" : undefined}
          ariaLabel={label}
        />
        <button type="submit" className="search-form-button">
          Search
        </button>
        {passthrough.map(([k, v]) => (
          <input key={k} type="hidden" name={k} value={String(v)} />
        ))}
      </div>

      {hint && (
        // Body size (not <small>) so hints stay at the same legibility
        // floor as body text — the fluid root font keeps body
        // comfortable; <small> can drop under the practical minimum on
        // narrow viewports.
        <span id="search-hint" className="muted">
          {hint}
        </span>
      )}

      {includes.length > 0 && (
        <fieldset className="search-form-includes cluster">
          <legend className="visually-hidden">
            Also search:
          </legend>
          {includes.map((inc) =>
            inc.href ? (
              <Link
                key={inc.name}
                href={inc.href}
                className="pill"
                aria-pressed={inc.checked}
              >
                {inc.label}
              </Link>
            ) : (
              <label key={inc.name} className="pill-toggle">
                <input
                  type="checkbox"
                  name={inc.name}
                  value="1"
                  defaultChecked={inc.checked}
                />
                <span className="pill">{inc.label}</span>
              </label>
            ),
          )}
        </fieldset>
      )}
    </form>
  );
}
