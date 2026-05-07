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
  type LangBuffers,
  type SourceFile,
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

/* Initial active-file picker for an example: the first file in the
 * language's array, or empty string if the language has no files. */
function firstFileName(files: SourceFile[]): string {
  return files[0]?.name ?? "";
}

export function PlaygroundClient() {
  const [buffers, setBuffers] = useState<LangBuffers>(DEFAULT_EXAMPLE.files);
  const [activeLang, setActiveLang] = useState<Lang>("html");
  const [activeFile, setActiveFile] = useState<Record<Lang, string>>({
    html: firstFileName(DEFAULT_EXAMPLE.files.html),
    javascript: firstFileName(DEFAULT_EXAMPLE.files.javascript),
    css: firstFileName(DEFAULT_EXAMPLE.files.css),
  });
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
        const r = analyse(buffers);
        setResult(r);
        setError(null);
      } catch (e) {
        setError((e as Error).message);
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [buffers]);

  /* Update the named file inside one language. If the file isn't in
   * the array (shouldn't happen normally), no-op. */
  const updateFileContent = (lang: Lang, name: string, content: string) => {
    setBuffers((prev) => ({
      ...prev,
      [lang]: prev[lang].map((f) => (f.name === name ? { ...f, content } : f)),
    }));
  };

  /* Track which file is currently being renamed. Only one file
   * across all languages can be in rename mode at a time. Format:
   * `${lang}::${currentName}` — null when no rename in flight. */
  const [renaming, setRenaming] = useState<string | null>(null);

  /* Add a new file in a language. Auto-name with the language's
   * extension; if the auto-name already exists, append a counter.
   * The new file is immediately placed in rename mode so the user
   * can name it without a separate gesture. */
  const addFile = (lang: Lang) => {
    const ext = lang === "html" ? "html" : lang === "javascript" ? "js" : "css";
    const base = lang === "html" ? "page" : lang === "javascript" ? "script" : "styles";
    setBuffers((prev) => {
      const existing = new Set(prev[lang].map((f) => f.name));
      let name = `${base}.${ext}`;
      let n = 1;
      while (existing.has(name)) {
        n += 1;
        name = `${base}-${n}.${ext}`;
      }
      const newFile: SourceFile = { name, content: "" };
      setActiveFile((af) => ({ ...af, [lang]: name }));
      setRenaming(`${lang}::${name}`);
      return { ...prev, [lang]: [...prev[lang], newFile] };
    });
  };

  /* Rename a file. Validation: name must be non-empty after trim
   * and must not collide with another file in the same language.
   * On rejection returns a human-readable reason that the rename
   * input renders as a live alert; on success returns null and the
   * caller closes rename mode. */
  const renameFile = (
    lang: Lang,
    oldName: string,
    newName: string,
  ): string | null => {
    const trimmed = newName.trim();
    if (!trimmed) return "Name is required.";
    if (trimmed === oldName) return null; // no-op, accept
    const collision = buffers[lang].some(
      (f) => f.name === trimmed && f.name !== oldName,
    );
    if (collision) return `A file named "${trimmed}" already exists.`;
    setBuffers((prev) => ({
      ...prev,
      [lang]: prev[lang].map((f) =>
        f.name === oldName ? { ...f, name: trimmed } : f,
      ),
    }));
    setActiveFile((af) =>
      af[lang] === oldName ? { ...af, [lang]: trimmed } : af,
    );
    return null;
  };

  /* Remove a file. If it was the active file, switch to the next
   * available; if no files remain in the language, active becomes
   * empty string and the editor disappears. */
  const removeFile = (lang: Lang, name: string) => {
    setBuffers((prev) => {
      const next = prev[lang].filter((f) => f.name !== name);
      setActiveFile((af) => {
        if (af[lang] !== name) return af;
        return { ...af, [lang]: next[0]?.name ?? "" };
      });
      return { ...prev, [lang]: next };
    });
  };

  const loadExample = (slug: string) => {
    const ex = findExample(slug);
    if (!ex) return;
    setBuffers(ex.files);
    setActiveFile({
      html: firstFileName(ex.files.html),
      javascript: firstFileName(ex.files.javascript),
      css: firstFileName(ex.files.css),
    });
    setExampleSlug(slug);
    setRenaming(null);
  };

  /* Reset is destructive (discards the user's edits), so it goes
   * through a confirmation modal styled to match the site rather
   * than the browser's native confirm — the native one ignores our
   * type tokens and renders in the OS default face/size. */
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const requestReset = () => {
    if (cleanExampleSlug === DEFAULT_EXAMPLE_SLUG) return; // already
    setResetConfirmOpen(true);
  };
  const confirmReset = () => {
    setResetConfirmOpen(false);
    loadExample(DEFAULT_EXAMPLE_SLUG);
    setActiveLang("html");
  };

  /* Append a fix's code to the named file. Match by file name across
   * all languages; if no match (e.g. the engine reports a generic
   * "script.js" but our buffer is "handlers.js"), fall back to
   * appending to the first file of the corresponding language. */
  const applyFixToFile = (filename: string, code: string) => {
    const append = (current: string) =>
      current.endsWith("\n") ? current + code : current + "\n\n" + code;
    setBuffers((prev) => {
      for (const lang of ["html", "javascript", "css"] as Lang[]) {
        const idx = prev[lang].findIndex((f) => f.name === filename);
        if (idx >= 0) {
          const next = [...prev[lang]];
          next[idx] = { ...next[idx], content: append(next[idx].content) };
          return { ...prev, [lang]: next };
        }
      }
      // Fallback: append to first file of inferred language by extension.
      const ext = filename.split(".").pop();
      const lang: Lang =
        ext === "html"
          ? "html"
          : ext === "css"
            ? "css"
            : "javascript";
      if (prev[lang][0]) {
        const next = [...prev[lang]];
        next[0] = { ...next[0], content: append(next[0].content) };
        return { ...prev, [lang]: next };
      }
      return prev;
    });
  };

  // The user is "on" an example only while their buffers match it
  // verbatim. Editing any pane clears the active marker so the picker
  // doesn't keep highlighting a button that no longer matches.
  const cleanExampleSlug = (() => {
    const ex = findExample(exampleSlug);
    if (!ex) return null;
    const eq = (a: SourceFile[], b: SourceFile[]) =>
      a.length === b.length &&
      a.every(
        (f, i) => f.name === b[i].name && f.content === b[i].content,
      );
    if (
      eq(ex.files.html, buffers.html) &&
      eq(ex.files.javascript, buffers.javascript) &&
      eq(ex.files.css, buffers.css)
    ) {
      return ex.slug;
    }
    return null;
  })();
  const currentExampleDescription =
    cleanExampleSlug && findExample(cleanExampleSlug)?.description;

  // Concatenated HTML for context detection in the result banner.
  const allHtml = buffers.html.map((f) => f.content).join("\n");

  return (
    <main id="main" className="site-main" data-zone="tools">
      {/* In-page skip link — invisible until focused, then jumps
       * keyboard / screen-reader users straight past the examples
       * picker, the editor tablists, and the filter row to the
       * Analysis section. The global skip link (in the page header)
       * lands on #main; this one moves further into the page to a
       * destination that only the Playground exposes. */}
      <a href="#playground-analysis-heading" className="skip-link">
        Skip to analysis results
      </a>
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
            buffers={buffers}
            activeLang={activeLang}
            setActiveLang={setActiveLang}
            activeFile={activeFile}
            setActiveFile={(lang, name) =>
              setActiveFile((af) => ({ ...af, [lang]: name }))
            }
            updateFileContent={updateFileContent}
            addFile={addFile}
            removeFile={removeFile}
            renaming={renaming}
            startRename={(lang, name) => setRenaming(`${lang}::${name}`)}
            commitRename={(lang, oldName, newName) => {
              const err = renameFile(lang, oldName, newName);
              if (!err) setRenaming(null);
              return err;
            }}
            cancelRename={() => setRenaming(null)}
            onReset={requestReset}
            canReset={cleanExampleSlug !== DEFAULT_EXAMPLE_SLUG}
          />

          {resetConfirmOpen && (
            <ConfirmDialog
              title="Reset the Playground?"
              message="Your current edits will be discarded and the default example will be loaded."
              confirmLabel="Reset"
              cancelLabel="Cancel"
              onConfirm={confirmReset}
              onCancel={() => setResetConfirmOpen(false)}
            />
          )}

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
            aria-labelledby="playground-analysis-heading"
          >
            <h2
              id="playground-analysis-heading"
              tabIndex={-1}
            >
              Analysis
            </h2>

            {/* Live region — assistive tech hears a single concise
             * summary every time the engine re-runs. The visible
             * panel below carries the full detail; this region
             * exists to give screen-reader users a usable
             * heads-up that something changed without flooding
             * them with the whole panel each keystroke. */}
            <p
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="visually-hidden"
            >
              {error
                ? `Engine error: ${error}`
                : !result
                  ? "Running analysers."
                  : result.issues.length === 0
                    ? `Analysis complete. ${result.ranAnalysers} analysers ran. No issues.`
                    : `Analysis complete. ${result.ranAnalysers} analysers ran. ${result.issues.length} ${result.issues.length === 1 ? "issue" : "issues"} reported.`}
            </p>

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
                html={allHtml}
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
      {/* Polite live region — when the user picks a different
       * example, the description below the buttons changes
       * silently for sighted users (visually clear, the buttons
       * also signal which is active via aria-pressed). Screen-
       * reader users only hear the button label they pressed; the
       * description that explains the example never reaches them
       * unless we announce it. aria-atomic so the whole new
       * description is read on each change rather than a diff. */}
      <p
        className="muted"
        aria-live="polite"
        aria-atomic="true"
      >
        {currentDescription ? <small>{currentDescription}</small> : ""}
      </p>
    </section>
  );
}

/* Editor panel — two levels of WAI-ARIA tabs. The outer tablist
 * picks the language (HTML / JavaScript / CSS), each language tab
 * showing its file count in parentheses. The inner tablist picks
 * the active file within the current language; each file tab has a
 * remove button (×) when the language has more than one file. An
 * "+ Add file" button at the end of the inner tablist creates a new
 * empty file in the current language.
 *
 * Roving-tabindex on each tablist for arrow-key navigation. */
function EditorPanel({
  tabs,
  buffers,
  activeLang,
  setActiveLang,
  activeFile,
  setActiveFile,
  updateFileContent,
  addFile,
  removeFile,
  renaming,
  startRename,
  commitRename,
  cancelRename,
  onReset,
  canReset,
}: {
  tabs: { lang: Lang; label: string; monaco: string }[];
  buffers: LangBuffers;
  activeLang: Lang;
  setActiveLang: (l: Lang) => void;
  activeFile: Record<Lang, string>;
  setActiveFile: (lang: Lang, name: string) => void;
  updateFileContent: (lang: Lang, name: string, content: string) => void;
  addFile: (lang: Lang) => void;
  removeFile: (lang: Lang, name: string) => void;
  renaming: string | null;
  startRename: (lang: Lang, name: string) => void;
  commitRename: (lang: Lang, oldName: string, newName: string) => string | null;
  cancelRename: () => void;
  onReset: () => void;
  canReset: boolean;
}) {
  const tablistId = useId();

  const handleLangKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const idx = tabs.findIndex((t) => t.lang === activeLang);
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setActiveLang(tabs[(idx + 1) % tabs.length].lang);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActiveLang(tabs[(idx - 1 + tabs.length) % tabs.length].lang);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveLang(tabs[0].lang);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveLang(tabs[tabs.length - 1].lang);
    }
  };

  const langFiles = buffers[activeLang];
  const currentFile = langFiles.find(
    (f) => f.name === activeFile[activeLang],
  );

  const monacoLang = tabs.find((t) => t.lang === activeLang)?.monaco ?? "plaintext";

  return (
    <section
      className="stack"
      style={{ "--space": "var(--s0)" } as CSSProperties}
    >
      <h2 className="visually-hidden">Source editors</h2>

      {/* Outer tablist row: language selection on the left, Reset
       * action on the right. The tablist itself stays a single
       * element for ARIA correctness; the Reset button is a sibling
       * inside an outer cluster set to space-between. */}
      <div
        className="cluster"
        style={
          {
            "--space": "var(--s0)",
            "--justify": "space-between",
            "--align": "flex-end",
          } as CSSProperties
        }
      >
        <div
          role="tablist"
          aria-label="Source language"
          id={tablistId}
          className="cluster playground-tablist"
          style={{ "--space": "var(--s-2)" } as CSSProperties}
        >
          {tabs.map((tab) => {
            const selected = tab.lang === activeLang;
            const count = buffers[tab.lang].length;
            return (
              <button
                key={tab.lang}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={`${tablistId}-panel-${tab.lang}`}
                id={`${tablistId}-tab-${tab.lang}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveLang(tab.lang)}
                onKeyDown={handleLangKey}
                className="playground-tab"
              >
                {tab.label} ({count})
              </button>
            );
          })}
        </div>
        <button
          type="button"
          className="pill"
          onClick={onReset}
          disabled={!canReset}
        >
          Reset
        </button>
      </div>

      {/* Tabpanel for each language. The inner file-tablist + editor
       * are visible only for the active language. */}
      {tabs.map((tab) => {
        const selected = tab.lang === activeLang;
        return (
          <div
            key={tab.lang}
            role="tabpanel"
            id={`${tablistId}-panel-${tab.lang}`}
            aria-labelledby={`${tablistId}-tab-${tab.lang}`}
            hidden={!selected}
          >
            {selected && (
              <FilePanel
                lang={tab.lang}
                files={buffers[tab.lang]}
                activeFile={activeFile[tab.lang]}
                setActiveFile={(name) => setActiveFile(tab.lang, name)}
                addFile={() => addFile(tab.lang)}
                removeFile={(name) => removeFile(tab.lang, name)}
                renaming={renaming}
                startRename={(name) => startRename(tab.lang, name)}
                commitRename={(oldName, newName) =>
                  commitRename(tab.lang, oldName, newName)
                }
                cancelRename={cancelRename}
              />
            )}
          </div>
        );
      })}

      {/* The Monaco editor itself, rendered once and re-bound to
       * whichever (lang, file) is active. Mounting Monaco once
       * avoids the heavy bundle being instantiated three times. */}
      {currentFile ? (
        <>
          {/* Keyboard hint — Monaco binds Tab to indent by default,
           * which traps keyboard-only users inside the editor. The
           * platform-native escape is Ctrl+M (Cmd+M on Mac), which
           * toggles Tab between "indent" and "move focus". Stating
           * it explicitly is more reliable than burying the hint
           * inside Monaco's accessibility-help dialog (Alt+F1). */}
          <p
            id={`${tablistId}-editor-hint`}
            className="muted"
          >
            <small>
              Press <kbd>Ctrl</kbd>+<kbd>M</kbd> (
              <kbd>Cmd</kbd>+<kbd>M</kbd> on macOS) to toggle whether
              <kbd>Tab</kbd> indents inside the editor or moves focus
              out of it.
            </small>
          </p>
          <div
            className="playground-editor"
            aria-describedby={`${tablistId}-editor-hint`}
          >
            <MonacoEditor
              key={`${activeLang}::${currentFile.name}`}
              height="320px"
              language={monacoLang}
              value={currentFile.content}
              onChange={(v) =>
                updateFileContent(activeLang, currentFile.name, v ?? "")
              }
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: "on",
                automaticLayout: true,
                scrollBeyondLastLine: false,
                // Force the screen-reader-friendly rendering path
                // rather than letting Monaco probe the environment
                // and disable AT support if no SR is detected.
                accessibilitySupport: "on",
              }}
            />
          </div>
        </>
      ) : (
        <p className="muted">
          <small>
            No {tabs.find((t) => t.lang === activeLang)?.label} files in
            this example. Press <strong>+ Add file</strong> above to
            create one.
          </small>
        </p>
      )}
    </section>
  );
}

/* File sub-tablist for one language. Each file gets a tab with
 * filename, a Rename button (pencil), and a Remove button (×) when
 * the language has more than one file. The trailing "+ Add file"
 * button creates a new empty file in rename mode. Newly-added or
 * pencil-clicked files swap their label for an inline text input
 * (Enter / blur commits, Escape cancels). */
function FilePanel({
  lang,
  files,
  activeFile,
  setActiveFile,
  addFile,
  removeFile,
  renaming,
  startRename,
  commitRename,
  cancelRename,
}: {
  lang: Lang;
  files: SourceFile[];
  activeFile: string;
  setActiveFile: (name: string) => void;
  addFile: () => void;
  removeFile: (name: string) => void;
  renaming: string | null;
  startRename: (name: string) => void;
  commitRename: (oldName: string, newName: string) => string | null;
  cancelRename: () => void;
}) {
  const handleFileKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (files.length === 0) return;
    const idx = files.findIndex((f) => f.name === activeFile);
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setActiveFile(files[(idx + 1) % files.length].name);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActiveFile(files[(idx - 1 + files.length) % files.length].name);
    } else if (e.key === "F2") {
      e.preventDefault();
      startRename(activeFile);
    }
  };

  return (
    <div
      role="tablist"
      aria-label={`${lang} files`}
      className="cluster playground-file-tablist"
      style={{ "--space": "var(--s-2)" } as CSSProperties}
    >
      {files.map((f) => {
        const selected = f.name === activeFile;
        const isRenaming = renaming === `${lang}::${f.name}`;
        return (
          <span
            key={f.name}
            className="playground-file-tab"
            data-selected={selected}
          >
            {isRenaming ? (
              <RenameInput
                initialValue={f.name}
                onCommit={(v) => commitRename(f.name, v)}
                onCancel={cancelRename}
              />
            ) : (
              <button
                role="tab"
                type="button"
                aria-selected={selected}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveFile(f.name)}
                onKeyDown={handleFileKey}
                className="playground-file-tab-label"
              >
                {f.name}
              </button>
            )}
            {!isRenaming && (
              <>
                <button
                  type="button"
                  aria-label={`Rename ${f.name}`}
                  className="playground-file-tab-rename"
                  onClick={() => startRename(f.name)}
                >
                  <span aria-hidden="true">✎</span>
                </button>
                {files.length > 1 && (
                  <button
                    type="button"
                    aria-label={`Remove ${f.name}`}
                    className="playground-file-tab-remove"
                    onClick={() => removeFile(f.name)}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                )}
              </>
            )}
          </span>
        );
      })}
      <button
        type="button"
        className="playground-file-tab-add"
        onClick={addFile}
      >
        + Add file
      </button>
    </div>
  );
}

/* Inline rename input. Mounts focused with the existing filename
 * pre-selected so the user can type or edit. Enter commits, Escape
 * cancels, blur commits. If commit fails (collision / empty), the
 * input refocuses with current text so the user can correct. */
function RenameInput({
  initialValue,
  onCommit,
  onCancel,
}: {
  initialValue: string;
  onCommit: (newName: string) => string | null;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement>(null);
  const errorId = useId();

  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);

  const commit = () => {
    const err = onCommit(value);
    if (err) {
      setError(err);
      ref.current?.focus();
      ref.current?.select();
    }
  };

  return (
    <>
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          if (error) setError(null);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
          } else if (e.key === "Escape") {
            e.preventDefault();
            onCancel();
          }
        }}
        onBlur={commit}
        aria-label="Rename file"
        aria-invalid={error !== null}
        aria-describedby={error ? errorId : undefined}
        className="playground-file-tab-input"
        // Width tracks content so the input doesn't bloat the tab.
        size={Math.max(8, value.length + 2)}
      />
      {/* Live error region — collision / empty rejection lands here
       * with role=alert so screen readers hear the reason rather
       * than only seeing the aria-invalid outline shift. The empty
       * region is still in the DOM so the announcement fires
       * reliably on first error. */}
      <span
        id={errorId}
        role="alert"
        className="playground-file-tab-error"
      >
        {error ?? ""}
      </span>
    </>
  );
}

type ConfidenceFilter = "all" | "HIGH" | "MEDIUM" | "LOW";

/* Total number of distinct checks the engine performs across all
 * analysers when given a complete document. Sourced from the
 * upstream Paradise repo's ISSUE_TYPES_REFERENCE.md. Not exposed by
 * the engine API itself; tracked here so the banner can show "N
 * issues from M checks" the way the upstream playground does. */
const TOTAL_CHECKS = 119;

function detectContext(html: string): DocumentContext {
  const lower = html.toLowerCase();
  const hasHtml = /<html[\s>]/.test(lower);
  const hasHead = /<head[\s>]/.test(lower);
  const hasBody = /<body[\s>]/.test(lower);
  if (hasHtml && hasHead && hasBody) return "full";
  if (hasBody) return "body";
  return "fragment";
}

type AnalyseReturn = ReturnType<typeof analyse>;
type AnalyseReturnTyped = Omit<AnalyseReturn, "issues"> & {
  issues: IssueWithSlug[];
};

function ResultPanel({
  result,
  html,
  onApplyFix,
}: {
  result: AnalyseReturnTyped;
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
        <h3 className="issue-card-title cluster-grow">
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
        </h3>
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
          <div className="cluster-grow">
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
            className="search-results-heading cluster-grow"
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

/* ConfirmDialog — generic confirm modal styled to match the rest of
 * the Playground. Uses the same native <dialog> + showModal() pattern
 * as Help / Fix so focus trap, Escape-to-close, and ARIA semantics
 * come from the platform. The confirm button auto-focuses on mount
 * so keyboard users can press Enter to proceed. */
function ConfirmDialog({
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    ref.current?.showModal();
    confirmRef.current?.focus();
  }, []);

  return (
    <dialog
      ref={ref}
      className="playground-dialog"
      onClose={onCancel}
      aria-labelledby={titleId}
    >
      <div className="playground-dialog-body">
        <h3 id={titleId} className="search-results-heading">
          {title}
        </h3>
        <p className="flush">{message}</p>
        <div
          className="cluster"
          style={{ "--space": "var(--s-1)" } as CSSProperties}
        >
          <button
            ref={confirmRef}
            type="button"
            className="pill"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
          <button type="button" className="pill" onClick={onCancel}>
            {cancelLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
