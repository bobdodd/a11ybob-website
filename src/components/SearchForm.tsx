/* SearchForm — server-rendered GET form. The submit button is real;
   no JS required. The form action targets the same URL so existing
   search params (filters) on the page are preserved through hidden
   inputs.

   The optional `includes` prop renders pill-shaped checkboxes below
   the search row, used to opt other corpora into the current search.
   Submitting the form passes them as query params. */

type Include = {
  /** Query-param name, e.g. "reviews". Submitted as "?<name>=1". */
  name: string;
  /** Visible label, e.g. "+ Reviews". */
  label: string;
  /** Whether the box is currently checked (derived from URL state). */
  checked: boolean;
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
  placeholder?: string;
  label?: string;
  /** Pill checkboxes rendered beneath the search row. */
  includes?: Include[];
};

export function SearchForm({
  q = "",
  action,
  preserve = {},
  placeholder = "Search…",
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
        <label
          htmlFor="search-input"
          style={{
            position: "absolute",
            width: "1px",
            height: "1px",
            overflow: "hidden",
            clip: "rect(0 0 0 0)",
          }}
        >
          {label}
        </label>
        <input
          id="search-input"
          type="search"
          name="q"
          defaultValue={q}
          placeholder={placeholder}
          autoComplete="off"
          style={{
            padding: "var(--s-1) var(--s0)",
            border: "var(--border-thin) solid var(--rule)",
            background: "var(--surface-1)",
            color: "var(--ink)",
            flex: "1 1 20ch",
            minInlineSize: "16ch",
            fontSize: "var(--s0)",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "var(--s-1) var(--s1)",
            border: "var(--border-thin) solid var(--rule)",
            background: "var(--ink)",
            color: "var(--surface-1)",
            fontSize: "var(--s0)",
          }}
        >
          Search
        </button>
        {passthrough.map(([k, v]) => (
          <input key={k} type="hidden" name={k} value={String(v)} />
        ))}
      </div>

      {includes.length > 0 && (
        <fieldset
          style={{ border: 0, padding: 0, margin: 0 }}
          className="cluster"
        >
          <legend
            style={{
              fontSize: "var(--s-1)",
              color: "var(--ink-muted)",
              padding: 0,
              marginInlineEnd: "var(--s-1)",
            }}
          >
            Also search:
          </legend>
          {includes.map((inc) => (
            <label
              key={inc.name}
              className="pill-toggle"
            >
              <input
                type="checkbox"
                name={inc.name}
                value="1"
                defaultChecked={inc.checked}
              />
              <span>{inc.label}</span>
            </label>
          ))}
        </fieldset>
      )}
    </form>
  );
}
