/* SearchForm — server-rendered GET form. The submit button is real;
   no JS required. The form action targets the same URL so existing
   search params (filters) on the page are preserved through hidden
   inputs. */

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
};

export function SearchForm({
  q = "",
  action,
  preserve = {},
  placeholder = "Search…",
  label = "Search this page",
}: Props) {
  const passthrough = Object.entries(preserve).filter(
    ([k, v]) => v && k !== "q" && k !== "page",
  );

  return (
    <form
      role="search"
      action={action}
      method="get"
      className="search-form cluster"
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
    </form>
  );
}
