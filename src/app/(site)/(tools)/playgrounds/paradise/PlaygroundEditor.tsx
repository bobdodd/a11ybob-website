"use client";

/* PlaygroundEditor — CodeMirror 6 editor for the analyser
 * Playground. The whole site uses CodeMirror 6 across both code-
 * editing surfaces (this and the Action Language playground at
 * /playgrounds/action-language); the colophon explains the choice.
 *
 * The component is parented by an aria-labelled wrapper from
 * PlaygroundClient. Each (language, file) pair gets its own
 * PlaygroundEditor instance via React's key prop — that way
 * mounting handles the initial-value sync and there's no
 * separate value-prop reconciliation to maintain. */

import { useEffect, useRef } from "react";
import { EditorState, type Extension } from "@codemirror/state";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { css } from "@codemirror/lang-css";
import { monochromeSyntaxHighlighting } from "@/lib/codemirror/highlight";

type Lang = "html" | "javascript" | "css";

interface PlaygroundEditorProps {
  language: Lang;
  initialValue: string;
  onChange: (value: string) => void;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}

const langExt = (language: Lang): Extension => {
  if (language === "html") return html();
  if (language === "javascript") return javascript();
  return css();
};

export function PlaygroundEditor({
  language,
  initialValue,
  onChange,
  ariaLabelledBy,
  ariaDescribedBy,
}: PlaygroundEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);

  /* Keep a stable ref to the latest onChange so the
   * updateListener installed at mount can call the current
   * function without being torn down on every parent re-render. */
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const view = new EditorView({
      state: EditorState.create({
        doc: initialValue,
        extensions: [
          lineNumbers(),
          history(),
          /* defaultKeymap binds Tab to indentMore — but only when
           * a selection is non-empty. With an empty cursor, Tab
           * falls through to the browser, which moves focus out
           * of the editor. That is the WCAG-compliant default
           * (no keyboard trap) and the behaviour CodeMirror 6
           * ships out of the box. */
          keymap.of([...defaultKeymap, ...historyKeymap]),
          langExt(language),
          monochromeSyntaxHighlighting,
          EditorView.lineWrapping,
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              onChangeRef.current(update.state.doc.toString());
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

    return () => view.destroy();
    // initialValue and language are mount-time inputs. The
    // PlaygroundClient passes a unique React key per (lang, file)
    // tuple, so a change in either remounts the editor and
    // re-runs this effect with the new values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className="playground-cm-editor"
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
    />
  );
}
