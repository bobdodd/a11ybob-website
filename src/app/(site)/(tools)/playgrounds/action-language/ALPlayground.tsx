"use client";

/* ALPlayground — the four-pane working surface for an Action
 * Language example. The XML editor (CodeMirror 6) is on the left;
 * the AST, trace, and output panes are on the right. Pressing Run
 * parses the XML, executes it via the in-browser engine, and
 * populates the three result panes. Reset restores the canonical
 * source the example shipped with.
 *
 * The engine source lives in src/lib/action-language/. The UI is
 * intentionally thin — most of the interesting logic is in the
 * engine; the UI is presentation. */

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { xml } from "@codemirror/lang-xml";
import { monochromeSyntaxHighlighting } from "@/lib/codemirror/highlight";

import {
  parseActionLanguage,
  runActionLanguage,
  type ExecutionResult,
} from "@/lib/action-language";
import { Action } from "@/lib/action-language";

interface ALPlaygroundProps {
  /** The canonical XML source for this example. */
  initialSource: string;
}

export function ALPlayground({ initialSource }: ALPlaygroundProps) {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorViewRef = useRef<EditorView | null>(null);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [astRoot, setAstRoot] = useState<Action | null>(null);
  const [astError, setAstError] = useState<string | null>(null);

  const editorLabelId = useId();

  /* Mount CodeMirror once. The editor's contents become the
   * source of truth for what gets executed; we never hold the
   * source in React state to avoid double-rendering on every
   * keystroke. */
  useEffect(() => {
    const container = editorContainerRef.current;
    if (!container) return;

    const view = new EditorView({
      state: EditorState.create({
        doc: initialSource,
        extensions: [
          lineNumbers(),
          history(),
          keymap.of([...defaultKeymap, ...historyKeymap]),
          xml(),
          monochromeSyntaxHighlighting,
          // Parse on every change so the AST pane updates live.
          // The engine isn't run on every change — that needs
          // Run pressed explicitly.
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              parseAndShow(view.state.doc.toString());
            }
          }),
          EditorView.theme({
            "&": { height: "100%" },
            ".cm-scroller": { fontFamily: "var(--font-mono)" },
          }),
        ],
      }),
      parent: container,
    });
    editorViewRef.current = view;
    parseAndShow(initialSource);

    return () => {
      view.destroy();
      editorViewRef.current = null;
    };
    // initialSource is intentionally a mount-time-only input.
    // Reset replaces the editor's contents directly via dispatch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const parseAndShow = useCallback((source: string) => {
    try {
      const { root } = parseActionLanguage(source);
      setAstRoot(root);
      setAstError(null);
    } catch (err) {
      setAstRoot(null);
      setAstError(err instanceof Error ? err.message : String(err));
    }
  }, []);

  const run = () => {
    const view = editorViewRef.current;
    if (!view) return;
    const source = view.state.doc.toString();
    const r = runActionLanguage(source);
    setResult(r);
  };

  const reset = () => {
    const view = editorViewRef.current;
    if (!view) return;
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: initialSource },
    });
    setResult(null);
    parseAndShow(initialSource);
  };

  return (
    <div
      className="al-playground stack"
      style={{ "--space": "var(--s0)" } as CSSProperties}
    >
      <div
        className="cluster"
        style={
          {
            "--space": "var(--s-2)",
            "--justify": "flex-end",
          } as CSSProperties
        }
      >
        <button type="button" className="pill" onClick={run}>
          Run
        </button>
        <button type="button" className="pill" onClick={reset}>
          Reset
        </button>
      </div>

      <div
        className="al-grid"
        role="group"
        aria-label="Action Language playground"
      >
        <section className="al-pane stack" style={{ "--space": "var(--s-2)" } as CSSProperties}>
          <h4 className="search-results-heading" id={editorLabelId}>
            XML source
          </h4>
          <div
            ref={editorContainerRef}
            className="al-editor"
            aria-labelledby={editorLabelId}
          />
        </section>

        <section className="al-pane stack" style={{ "--space": "var(--s-2)" } as CSSProperties}>
          <h4 className="search-results-heading">Action tree</h4>
          {astError ? (
            <p role="alert" className="muted">
              <small>Parse error: {astError}</small>
            </p>
          ) : astRoot ? (
            <ASTRenderer root={astRoot} />
          ) : (
            <p className="muted">
              <small>Edit the XML to see the action tree.</small>
            </p>
          )}
        </section>

        <section className="al-pane stack" style={{ "--space": "var(--s-2)" } as CSSProperties}>
          <h4 className="search-results-heading">Execution trace</h4>
          {result === null ? (
            <p className="muted">
              <small>Press Run to execute the program.</small>
            </p>
          ) : (
            <TraceRenderer result={result} />
          )}
        </section>

        <section className="al-pane stack" style={{ "--space": "var(--s-2)" } as CSSProperties}>
          <h4 className="search-results-heading">Output</h4>
          {result === null ? (
            <p className="muted">
              <small>Press Run to execute the program.</small>
            </p>
          ) : (
            <OutputRenderer result={result} />
          )}
        </section>
      </div>
    </div>
  );
}

/* AST renderer — recursive, indented by depth. Uses <ul>/<li> so
 * screen-reader users hear the tree structure semantically. */
function ASTRenderer({ root }: { root: Action }) {
  return (
    <ul className="al-tree" aria-label="Parsed action tree">
      <ASTNode action={root} />
    </ul>
  );
}

function ASTNode({ action }: { action: Action }) {
  const kids = action.children();
  return (
    <li>
      <code>{action.name}</code>
      {describeAction(action)}
      {kids.length > 0 && (
        <ul>
          {kids.map((child, i) => (
            <ASTNode key={i} action={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

/* Surface a few action-specific attributes alongside the type
 * name — names of variables and constants, literal values, etc.
 * The AST view is for orientation, not for byte-perfect inspection. */
function describeAction(action: Action): string | null {
  const a = action as unknown as {
    name: string;
    funcName?: string;
    varName?: string;
    constName?: string;
    literalType?: string;
    literalValue?: unknown;
    params?: { name: string }[];
  };
  if (a.name === "FUNCTION" && a.funcName) {
    const params = a.params?.map((p) => p.name).join(", ") ?? "";
    return ` ${a.funcName}(${params})`;
  }
  if (a.name === "CALL" && a.funcName) return ` ${a.funcName}`;
  if (a.name === "DECLARE_VAR" && a.varName) return ` ${a.varName}`;
  if (a.name === "ASSIGN" && a.varName) return ` ${a.varName}`;
  if (a.name === "READ_VAR" && a.varName) return ` ${a.varName}`;
  if (a.name === "READ_CONST" && a.constName) return ` ${a.constName}`;
  if (a.name === "LITERAL" && a.literalValue !== undefined) {
    return ` ${a.literalType}=${String(a.literalValue)}`;
  }
  return null;
}

/* Trace renderer — flat list, one entry per event, indented by
 * the depth field so the structural enter/exit pairs make the
 * scope visible. Reuses the SR transcript styling. */
function TraceRenderer({ result }: { result: ExecutionResult }) {
  if (!result.ok) {
    return (
      <p role="alert" className="muted">
        <small>Engine error: {result.error}</small>
      </p>
    );
  }
  return (
    <ol className="al-trace" aria-label="Execution trace">
      {result.trace.map((event, i) => (
        <li
          key={i}
          className="al-trace-entry"
          data-kind={event.kind}
          style={{ "--depth": event.depth } as CSSProperties}
        >
          <code>{describeTrace(event)}</code>
        </li>
      ))}
    </ol>
  );
}

function describeTrace(event: import("@/lib/action-language").TraceEvent): string {
  switch (event.kind) {
    case "enter":
      return `→ ${event.action}${event.detail ? ` (${event.detail})` : ""}`;
    case "exit":
      return `← ${event.action}`;
    case "evaluate":
      return `${event.action} = ${formatValue(event.value)}`;
    case "assign":
      return `${event.name} := ${formatValue(event.value)}`;
    case "print":
      return `print ${formatValue(event.value)}`;
    case "stack": {
      const v = event.variables
        .map((x) => `${x.name}=${formatValue(x.value)}`)
        .join(", ");
      return `stack: ${v}`;
    }
  }
}

function OutputRenderer({ result }: { result: ExecutionResult }) {
  if (!result.ok) {
    return (
      <p className="muted">
        <small>(execution did not complete &mdash; see trace for error)</small>
      </p>
    );
  }
  if (result.output.length === 0 && result.returnValue === null) {
    return (
      <p className="muted">
        <small>(program produced no output and no return value)</small>
      </p>
    );
  }
  return (
    <div className="stack" style={{ "--space": "var(--s-2)" } as CSSProperties}>
      {result.output.length > 0 && (
        <ul className="al-output">
          {result.output.map((v, i) => (
            <li key={i}>
              <code>{formatValue(v)}</code>
            </li>
          ))}
        </ul>
      )}
      {result.returnValue !== null && (
        <p className="flush">
          <small className="muted">Return value:</small>{" "}
          <code>{formatValue(result.returnValue)}</code>
        </p>
      )}
    </div>
  );
}

function formatValue(v: unknown): string {
  if (v === null || v === undefined) return "null";
  if (typeof v === "string") return JSON.stringify(v);
  return String(v);
}
