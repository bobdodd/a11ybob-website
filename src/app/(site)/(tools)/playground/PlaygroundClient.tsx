"use client";

/* Phase 3: Monaco editor with debounced re-analysis on every
 * keystroke. Three language buffers (HTML / JavaScript / CSS) live
 * in component state; a tab interface (WAI-ARIA tabs pattern)
 * surfaces one at a time. Each edit triggers a 250ms-debounced
 * re-run of the Paradise engine.
 *
 * Monaco is loaded via dynamic import with ssr:false because it
 * relies on web-only APIs. The page falls back to a plain textarea
 * if Monaco fails to load (offline, restricted CSP, etc.) — the
 * Playground works without the editor's polish, just less prettily. */

import Link from "next/link";
import dynamic from "next/dynamic";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import {
  analyse,
  confidenceScore,
  CONFIDENCES,
  SEVERITIES,
  type DocumentContext,
  type IssueWithSlug,
} from "@/lib/paradise/analyse";
import { findAnalyser } from "@/lib/analysers";
import {
  EXAMPLES,
  DEFAULT_EXAMPLE_SLUG,
  findExample,
} from "@/lib/paradise/examples";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="muted">
      <small>Loading editor…</small>
    </div>
  ),
});

const DEFAULT_EXAMPLE = findExample(DEFAULT_EXAMPLE_SLUG)!;

type Lang = "html" | "javascript" | "css";

const TABS: { lang: Lang; label: string; monaco: string }[] = [
  { lang: "html", label: "HTML", monaco: "html" },
  { lang: "javascript", label: "JavaScript", monaco: "javascript" },
  { lang: "css", label: "CSS", monaco: "css" },
];

const DEBOUNCE_MS = 250;

export function PlaygroundClient() {
  const [html, setHtml] = useState(DEFAULT_EXAMPLE.html);
  const [js, setJs] = useState(DEFAULT_EXAMPLE.javascript);
  const [css, setCss] = useState(DEFAULT_EXAMPLE.css);
  const [active, setActive] = useState<Lang>("html");
  const [exampleSlug, setExampleSlug] = useState<string>(
    DEFAULT_EXAMPLE.slug,
  );
  const [result, setResult] = useState<ReturnType<typeof analyse> | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  // Re-run analysis whenever any buffer changes, debounced.
  const runId = useRef(0);
  useEffect(() => {
    const myId = ++runId.current;
    const handle = setTimeout(() => {
      if (myId !== runId.current) return;
      try {
        const r = analyse({ html, javascript: js, css });
        setResult(r);
        setError(null);
      } catch (e) {
        setError((e as Error).message);
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [html, js, css]);

  const editorValueFor = (lang: Lang) =>
    lang === "html" ? html : lang === "javascript" ? js : css;
  const setEditorValueFor = (lang: Lang, v: string | undefined) => {
    const next = v ?? "";
    if (lang === "html") setHtml(next);
    else if (lang === "javascript") setJs(next);
    else setCss(next);
  };

  const loadExample = (slug: string) => {
    const ex = findExample(slug);
    if (!ex) return;
    setHtml(ex.html);
    setJs(ex.javascript);
    setCss(ex.css);
    setExampleSlug(slug);
  };

  /* Append a fix's code to the buffer named in the issue's fix
   * location. Honest scope: the engine doesn't tell us whether the
   * fix should be inserted, replaced, or appended — only the code
   * to apply. Appending lands the fix somewhere safe for the user
   * to refine; the modal prose names this limitation explicitly. */
  const applyFixToFile = (filename: string, code: string) => {
    const append = (current: string) =>
      current.endsWith("\n") ? current + code : current + "\n\n" + code;
    if (filename === "index.html") setHtml((h) => append(h));
    else if (filename === "script.js") setJs((j) => append(j));
    else if (filename === "styles.css") setCss((c) => append(c));
  };

  // The user is "on" an example only while their buffers match it
  // verbatim. Editing any pane clears the active marker so the picker
  // doesn't keep highlighting a button that no longer matches.
  const cleanExampleSlug = (() => {
    const ex = findExample(exampleSlug);
    if (!ex) return null;
    if (ex.html === html && ex.javascript === js && ex.css === css) {
      return ex.slug;
    }
    return null;
  })();
  const currentExampleDescription =
    cleanExampleSlug && findExample(cleanExampleSlug)?.description;

  return (
    <main id="main" className="site-main" data-zone="tools">
      <div className="center">
        <div
          className="stack"
          style={{ "--space": "var(--s2)" } as CSSProperties}
        >
          <header
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h1>Playground</h1>
            <p className="lede">
              In-browser{" "}
              <Link href="/paradise">Paradise</Link> analysers running
              over the HTML, JavaScript, and CSS you edit. Source-level
              cross-file analysis as you type — no server roundtrip,
              no rendered DOM. The starting sample carries two
              deliberate bugs across three files, each in a different
              language, each invisible to single-file linters.
              Editing any pane re-runs the engine after a short
              debounce.
            </p>
          </header>

          <ExamplePicker
            activeSlug={cleanExampleSlug}
            onPick={loadExample}
            currentDescription={currentExampleDescription || undefined}
          />

          <EditorPanel
            tabs={TABS}
            active={active}
            setActive={setActive}
            getValue={editorValueFor}
            setValue={setEditorValueFor}
          />

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Analysis</h2>
            {error && (
              <p role="alert" className="muted">
                Engine error: {error}
              </p>
            )}
            {!result && !error && (
              <p className="muted">Running analysers…</p>
            )}
            {result && (
              <ResultPanel
                result={result}
                html={html}
                onApplyFix={applyFixToFile}
              />
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

/* Examples picker — a row of buttons that load curated input
 * examples into all three editors. The active example (when the
 * buffers still match it verbatim) is announced via aria-pressed
 * on its button, so screen readers report which example is loaded.
 *
 * Editing any editor pane breaks the match and clears the active
 * indicator — the picker stops claiming the buffers represent that
 * example once the user has changed them. */
function ExamplePicker({
  activeSlug,
  onPick,
  currentDescription,
}: {
  activeSlug: string | null;
  onPick: (slug: string) => void;
  currentDescription?: string;
}) {
  return (
    <section
      className="stack"
      style={{ "--space": "var(--s-1)" } as CSSProperties}
      aria-labelledby="playground-examples-heading"
    >
      <h2
        id="playground-examples-heading"
        className="search-results-heading"
      >
        Examples
      </h2>
      <ul
        className="list-flat cluster"
        style={{ "--space": "var(--s-1)" } as CSSProperties}
      >
        {EXAMPLES.map((ex) => (
          <li key={ex.slug}>
            <button
              type="button"
              className="pill"
              aria-pressed={activeSlug === ex.slug}
              onClick={() => onPick(ex.slug)}
            >
              {ex.label}
            </button>
          </li>
        ))}
      </ul>
      {currentDescription && (
        <p className="muted">
          <small>{currentDescription}</small>
        </p>
      )}
    </section>
  );
}

/* WAI-ARIA tabs pattern. Each tab is a button with role="tab"; the
 * active tab carries aria-selected="true" and tabindex=0, the others
 * are tabindex=-1. Arrow keys move focus through the tablist with
 * roving-tabindex. Selecting a tab swaps the visible tabpanel. */
function EditorPanel({
  tabs,
  active,
  setActive,
  getValue,
  setValue,
}: {
  tabs: { lang: Lang; label: string; monaco: string }[];
  active: Lang;
  setActive: (l: Lang) => void;
  getValue: (l: Lang) => string;
  setValue: (l: Lang, v: string | undefined) => void;
}) {
  const tablistId = useId();

  // Keyboard nav between tabs.
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const idx = tabs.findIndex((t) => t.lang === active);
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setActive(tabs[(idx + 1) % tabs.length].lang);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActive(tabs[(idx - 1 + tabs.length) % tabs.length].lang);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(tabs[0].lang);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(tabs[tabs.length - 1].lang);
    }
  };

  return (
    <section
      className="stack"
      style={{ "--space": "var(--s0)" } as CSSProperties}
    >
      <h2 className="visually-hidden">Source editors</h2>

      <div
        role="tablist"
        aria-label="Source language"
        id={tablistId}
        className="cluster playground-tablist"
        style={{ "--space": "var(--s-2)" } as CSSProperties}
      >
        {tabs.map((tab) => {
          const selected = tab.lang === active;
          return (
            <button
              key={tab.lang}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`${tablistId}-panel-${tab.lang}`}
              id={`${tablistId}-tab-${tab.lang}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(tab.lang)}
              onKeyDown={handleKeyDown}
              className="playground-tab"
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {tabs.map((tab) => {
        const selected = tab.lang === active;
        return (
          <div
            key={tab.lang}
            role="tabpanel"
            id={`${tablistId}-panel-${tab.lang}`}
            aria-labelledby={`${tablistId}-tab-${tab.lang}`}
            hidden={!selected}
            className="playground-editor"
          >
            <MonacoEditor
              height="320px"
              language={tab.monaco}
              value={getValue(tab.lang)}
              onChange={(v) => setValue(tab.lang, v)}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: "on",
                automaticLayout: true,
                scrollBeyondLastLine: false,
              }}
            />
          </div>
        );
      })}
    </section>
  );
}

type ConfidenceFilter = "all" | "HIGH" | "MEDIUM" | "LOW";

/* Total number of distinct checks the engine performs across all
 * analysers when given a complete document. Sourced from the
 * upstream Paradise repo's ISSUE_TYPES_REFERENCE.md. Not exposed by
 * the engine API itself; tracked here so the banner can show "N
 * issues from M checks" the way the upstream playground does. */
const TOTAL_CHECKS = 119;

type DocumentContext = "full" | "body" | "fragment";

function detectContext(html: string): DocumentContext {
  const lower = html.toLowerCase();
  const hasHtml = /<html[\s>]/.test(lower);
  const hasHead = /<head[\s>]/.test(lower);
  const hasBody = /<body[\s>]/.test(lower);
  if (hasHtml && hasHead && hasBody) return "full";
  if (hasBody) return "body";
  return "fragment";
}

function ResultPanel({
  result,
  html,
  onApplyFix,
}: {
  result: ReturnType<typeof analyse>;
  html: string;
  onApplyFix: (filename: string, code: string) => void;
}) {
  const [filter, setFilter] = useState<ConfidenceFilter>("all");

  // Counts by severity and confidence for the banner.
  const bySeverity = SEVERITIES.map((s) => ({
    s,
    n: result.issues.filter((i) => i.severity === s).length,
  })).filter(({ n }) => n > 0);
  const byConfidence = CONFIDENCES.map((c) => ({
    c,
    n: result.issues.filter((i) => i.confidence?.level === c).length,
  }));

  const context = detectContext(html);

  const visible =
    filter === "all"
      ? result.issues
      : result.issues.filter((i) => i.confidence?.level === filter);

  return (
    <div
      className="stack"
      style={{ "--space": "var(--s0)" } as CSSProperties}
    >
      <DocumentContextBanner
        context={context}
        ranAnalysers={result.ranAnalysers}
        issueCount={result.issues.length}
        bySeverity={bySeverity}
        byConfidence={byConfidence}
      />

      <ConfidenceFilterControls
        filter={filter}
        setFilter={setFilter}
        counts={byConfidence}
        total={result.issues.length}
      />

      {visible.length === 0 ? (
        <p className="muted">
          {result.issues.length === 0
            ? "Paradise ran every analyser and reported no issues."
            : "No issues at this confidence level. Switch the filter above to see issues at other confidence levels."}
        </p>
      ) : (
        <ul
          className="list-flat stack"
          style={{ "--space": "var(--s1)" } as CSSProperties}
        >
          {visible.map((issue, i) => (
            <li key={i}>
              <IssueCard
                issue={issue}
                context={context}
                onApplyFix={onApplyFix}
              />
            </li>
          ))}
        </ul>
      )}

      {result.errors.length > 0 && (
        <details>
          <summary>
            <small className="muted">
              {result.errors.length}{" "}
              {result.errors.length === 1 ? "analyser" : "analysers"}{" "}
              threw during the run (engine bugs, not your code)
            </small>
          </summary>
          <ul>
            {result.errors.map((e, i) => (
              <li key={i}>
                <code>{e.analyser}</code>: {e.message}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

/* DocumentContextBanner — header callout naming the kind of input
 * the user has provided (full document, body-only, fragment) and
 * the confidence implications of that. For fragments and body-only
 * inputs the banner shows actionable recommendations for raising
 * confidence ("add <body>", "add <head>"). The visual treatment
 * uses surface tokens — meaning lives in the title and the
 * recommendations, not in colour alone. */
function DocumentContextBanner({
  context,
  ranAnalysers,
  issueCount,
  bySeverity,
  byConfidence,
}: {
  context: DocumentContext;
  ranAnalysers: number;
  issueCount: number;
  bySeverity: { s: string; n: number }[];
  byConfidence: { c: string; n: number }[];
}) {
  const titles: Record<DocumentContext, string> = {
    full: "Analysing complete HTML document",
    body: "Analysing partial page (body only)",
    fragment: "Analysing code fragment",
  };
  const descriptions: Record<DocumentContext, string> = {
    full: "All checks running with full confidence.",
    body: "Most checks running with high confidence.",
    fragment:
      "Some checks have reduced confidence (missing document context).",
  };

  return (
    <section
      className="playground-banner stack"
      data-context={context}
      aria-labelledby="playground-banner-title"
      style={{ "--space": "var(--s-1)" } as CSSProperties}
    >
      <h3 id="playground-banner-title" className="search-results-heading">
        {titles[context]}
      </h3>
      <p className="flush">{descriptions[context]}</p>

      <p className="flush">
        <strong>{issueCount}</strong>{" "}
        {issueCount === 1 ? "issue" : "issues"} detected from{" "}
        <strong>{TOTAL_CHECKS}</strong> checks. Paradise ran{" "}
        <strong>{ranAnalysers}</strong> analysers.
      </p>

      {bySeverity.length > 0 && (
        <p className="flush">
          <small className="muted">
            By severity:{" "}
            {bySeverity.map(({ s, n }, i) => (
              <span key={s}>
                {i > 0 && " · "}
                {n} {s}
              </span>
            ))}
            . By confidence:{" "}
            {byConfidence
              .filter(({ n }) => n > 0)
              .map(({ c, n }, i) => (
                <span key={c}>
                  {i > 0 && " · "}
                  {n} {c.toLowerCase()}
                </span>
              ))}
            .
          </small>
        </p>
      )}

      {context !== "full" && (
        <details>
          <summary>
            <strong>Improve confidence</strong>
          </summary>
          <ul>
            {context === "fragment" && (
              <>
                <li>
                  Wrap the markup in <code>&lt;body&gt;</code> tags for
                  ~85% confidence on all checks.
                </li>
                <li>
                  Use a full HTML document with{" "}
                  <code>&lt;html&gt;</code>, <code>&lt;head&gt;</code>,
                  and <code>&lt;body&gt;</code> for 100% confidence.
                </li>
              </>
            )}
            {context === "body" && (
              <li>
                Add a <code>&lt;head&gt;</code> section for full
                confidence on CSS-and-meta checks.
              </li>
            )}
          </ul>
        </details>
      )}
    </section>
  );
}

/* Confidence filter — pill toggles for each level (All / High /
 * Medium / Low). aria-pressed indicates the active one; counts go in
 * each label so the user can see issue volume at a glance. */
function ConfidenceFilterControls({
  filter,
  setFilter,
  counts,
  total,
}: {
  filter: ConfidenceFilter;
  setFilter: (f: ConfidenceFilter) => void;
  counts: { c: (typeof CONFIDENCES)[number]; n: number }[];
  total: number;
}) {
  return (
    <div
      role="group"
      aria-labelledby="playground-filter-label"
      className="cluster"
      style={{ "--space": "var(--s-1)" } as CSSProperties}
    >
      <span id="playground-filter-label" className="muted">
        <strong>Filter by confidence:</strong>
      </span>
      <button
        type="button"
        className="pill"
        aria-pressed={filter === "all"}
        onClick={() => setFilter("all")}
      >
        All ({total})
      </button>
      {CONFIDENCES.map((c) => {
        const n = counts.find((x) => x.c === c)?.n ?? 0;
        return (
          <button
            key={c}
            type="button"
            className="pill"
            aria-pressed={filter === c}
            onClick={() => setFilter(c)}
            disabled={n === 0}
          >
            {c.charAt(0) + c.slice(1).toLowerCase()} ({n})
          </button>
        );
      })}
    </div>
  );
}

/* Issue card — title row, message, metadata, and the action buttons
 * (Help, Fix). Help opens a modal with the issue's documentation
 * (description, WCAG criteria, link to the full analyser page). Fix
 * opens a modal showing the engine's proposed code change with a
 * "best-effort apply" button — best-effort because the engine doesn't
 * tell us whether to insert / replace / append the fix code. */
function IssueCard({
  issue,
  context,
  onApplyFix,
}: {
  issue: IssueWithSlug;
  context: DocumentContext;
  onApplyFix: (filename: string, code: string) => void;
}) {
  const [helpOpen, setHelpOpen] = useState(false);
  const [fixOpen, setFixOpen] = useState(false);

  const loc = issue.location as
    | { file: string; line?: number; column?: number; length?: number }
    | undefined;
  const conf = issue.confidence;
  const score = confidenceScore(conf?.level, context);
  const fix = (issue as IssueWithSlug & {
    fix?: { description: string; code: string; location?: { file: string } };
  }).fix;

  return (
    <article
      className="issue-card stack"
      data-severity={issue.severity}
      style={{ "--space": "var(--s-1)" } as CSSProperties}
    >
      <div
        className="cluster"
        style={{ "--space": "var(--s-1)" } as CSSProperties}
      >
        <p className="flush" style={{ flex: "1 1 20ch" } as CSSProperties}>
          <span className={`severity-badge severity-${issue.severity}`}>
            {issue.severity}
          </span>{" "}
          <Link href={`/paradise/analysers/${issue.analyserSlug}`}>
            {issue.type}
          </Link>{" "}
          {loc && (
            <small className="muted">
              {loc.file}
              {loc.line ? `:${loc.line}` : ""}
            </small>
          )}
        </p>
        <div
          className="cluster"
          style={{ "--space": "var(--s-2)" } as CSSProperties}
        >
          {fix && (
            <button
              type="button"
              className="pill"
              onClick={() => setFixOpen(true)}
            >
              Fix
            </button>
          )}
          <button
            type="button"
            className="pill"
            onClick={() => setHelpOpen(true)}
          >
            Help
          </button>
        </div>
      </div>

      <p className="flush">{issue.message}</p>

      <p className="flush">
        <small className="muted">
          {issue.wcagCriteria && issue.wcagCriteria.length > 0 && (
            <>WCAG {issue.wcagCriteria.join(" · ")}</>
          )}
          {issue.wcagCriteria &&
            issue.wcagCriteria.length > 0 &&
            conf &&
            " · "}
          {conf && (
            <>
              {conf.level.toLowerCase()} confidence
              {score !== undefined ? ` (${score}%)` : ""}
              {conf.reason ? `: ${conf.reason}` : ""}
            </>
          )}
        </small>
      </p>

      {helpOpen && (
        <HelpDialog issue={issue} onClose={() => setHelpOpen(false)} />
      )}
      {fix && fixOpen && (
        <FixDialog
          issue={issue}
          fix={fix}
          onClose={() => setFixOpen(false)}
          onApply={() => {
            onApplyFix(fix.location?.file ?? "script.js", fix.code);
            setFixOpen(false);
          }}
        />
      )}
    </article>
  );
}

/* HelpDialog — a native <dialog> showing the issue, the analyser
 * behind it, and per-WCAG-criterion titles and links. Pulls from the
 * /paradise/analysers metadata so the modal carries the same content
 * that's on the analyser page (description, WCAG mappings, example).
 *
 * Native <dialog> with showModal() handles focus trapping,
 * escape-to-close, and aria semantics for free. */
function HelpDialog({
  issue,
  onClose,
}: {
  issue: IssueWithSlug;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);

  const analyser = findAnalyser(issue.analyserSlug);
  const loc = issue.location as
    | { file: string; line?: number }
    | undefined;

  return (
    <dialog
      ref={ref}
      className="playground-dialog"
      onClose={onClose}
      aria-labelledby={`help-${issue.analyserSlug}-title`}
    >
      <div className="playground-dialog-body">
        <header
          className="cluster"
          style={{ "--space": "var(--s0)" } as CSSProperties}
        >
          <div style={{ flex: "1 1 20ch" } as CSSProperties}>
            <h3
              id={`help-${issue.analyserSlug}-title`}
              className="search-results-heading"
            >
              {issue.type}
            </h3>
            <p className="flush muted">
              <small>
                <span className={`severity-badge severity-${issue.severity}`}>
                  {issue.severity}
                </span>{" "}
                {analyser && <>{analyser.name}</>}
                {loc && (
                  <>
                    {" · "}
                    {loc.file}
                    {loc.line ? `:${loc.line}` : ""}
                  </>
                )}
              </small>
            </p>
          </div>
          <button type="button" className="pill" onClick={onClose}>
            Close
          </button>
        </header>

        <section
          className="stack"
          style={{ "--space": "var(--s-1)" } as CSSProperties}
        >
          <h4 className="search-results-heading">What Paradise reported</h4>
          <p className="flush">{issue.message}</p>
        </section>

        {analyser && (
          <section
            className="stack"
            style={{ "--space": "var(--s-1)" } as CSSProperties}
          >
            <h4 className="search-results-heading">
              About this analyser
            </h4>
            <p className="flush">{analyser.description}</p>
          </section>
        )}

        {analyser && analyser.wcag.length > 0 && (
          <section
            className="stack"
            style={{ "--space": "var(--s-1)" } as CSSProperties}
          >
            <h4 className="search-results-heading">
              WCAG criteria engaged
            </h4>
            <ul>
              {analyser.wcag.map((c) => (
                <li key={c.criterion}>
                  <strong>{c.criterion}</strong> — {c.title}
                </li>
              ))}
            </ul>
          </section>
        )}

        {analyser?.example && (
          <section
            className="stack"
            style={{ "--space": "var(--s-1)" } as CSSProperties}
          >
            <h4 className="search-results-heading">
              Example: typical occurrence
            </h4>
            <pre>
              <code>{analyser.example.code}</code>
            </pre>
            <p className="flush">
              <strong>Paradise reports:</strong>{" "}
              {analyser.example.report}
            </p>
          </section>
        )}

        <p className="flush">
          <Link href={`/paradise/analysers/${issue.analyserSlug}`}>
            Read the full analyser page →
          </Link>
        </p>
      </div>
    </dialog>
  );
}

/* FixDialog — a native <dialog> previewing the engine's proposed
 * fix code with two actions: apply (best-effort, appends to the
 * named buffer) and copy (to clipboard). The prose explicitly names
 * the limitation: the engine doesn't tell us whether to insert,
 * replace, or append, so apply lands the code somewhere safe and
 * the user refines from there. */
function FixDialog({
  issue,
  fix,
  onClose,
  onApply,
}: {
  issue: IssueWithSlug;
  fix: { description: string; code: string; location?: { file: string } };
  onClose: () => void;
  onApply: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fix.code);
    } catch {
      // Silent fallback — the user can still select-and-copy from
      // the visible <pre> if the clipboard API is denied.
    }
  };

  return (
    <dialog
      ref={ref}
      className="playground-dialog"
      onClose={onClose}
      aria-labelledby={`fix-${issue.analyserSlug}-title`}
    >
      <div className="playground-dialog-body">
        <header
          className="cluster"
          style={{ "--space": "var(--s0)" } as CSSProperties}
        >
          <h3
            id={`fix-${issue.analyserSlug}-title`}
            className="search-results-heading"
            style={{ flex: "1 1 20ch" } as CSSProperties}
          >
            Fix: {issue.type}
          </h3>
          <button type="button" className="pill" onClick={onClose}>
            Close
          </button>
        </header>

        <p className="flush">{fix.description}</p>

        <pre>
          <code>{fix.code}</code>
        </pre>

        <p className="muted">
          <small>
            Apply lands this code at the end of{" "}
            <code>{fix.location?.file ?? "the relevant file"}</code>.
            The engine doesn&rsquo;t indicate insert / replace /
            append, so the placement is best-effort — refine
            position by hand if needed.
          </small>
        </p>

        <div
          className="cluster"
          style={{ "--space": "var(--s-1)" } as CSSProperties}
        >
          <button
            type="button"
            className="pill"
            aria-pressed="false"
            onClick={onApply}
          >
            Apply to editor
          </button>
          <button type="button" className="pill" onClick={copy}>
            Copy code
          </button>
        </div>
      </div>
    </dialog>
  );
}
