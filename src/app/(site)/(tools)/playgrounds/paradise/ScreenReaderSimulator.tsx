"use client";

/* ScreenReaderSimulator — wraps the VirtualScreenReader engine in
 * a UI that lets a sighted developer experience the page they're
 * authoring the way a screen-reader user would. Two panels: the
 * sandboxed preview iframe on one side, the SR transcript and
 * controls on the other.
 *
 * The transcript records every announcement the engine produces —
 * navigation results ("button, Save"), state changes (live region
 * updates), error messages, page-load summary. Optional speech
 * synthesis via the Web Speech API speaks announcements out loud.
 *
 * Keyboard navigation uses single-letter shortcuts that match the
 * conventions of NVDA, JAWS, and VoiceOver: H for next heading,
 * K for next link, B for next button, etc., with Shift for
 * "previous". Arrow keys walk every node; M toggles browse / focus
 * mode; Enter activates the current element.
 *
 * This is part of the simulator suite — Switch Access in phase 3,
 * Session Recorder + Replay in phase 4. */

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import type { LangBuffers } from "@/lib/paradise/examples";
import { VirtualScreenReader } from "@/lib/at-simulator/VirtualScreenReader";
import type {
  AccessibilityNode,
  NavigationMode,
  SRMessage,
} from "@/lib/at-simulator/types";
import { PlaygroundPreview } from "./PlaygroundPreview";

interface ScreenReaderSimulatorProps {
  buffers: LangBuffers;
  onClose: () => void;
}

const SPEECH_RATES = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3] as const;

const KEY_HELP: { keys: string; label: string }[] = [
  { keys: "↓ / ↑", label: "Next / previous element" },
  { keys: "H / Shift+H", label: "Next / previous heading" },
  { keys: "K / Shift+K", label: "Next / previous link" },
  { keys: "B / Shift+B", label: "Next / previous button" },
  { keys: "L", label: "Next landmark" },
  { keys: "R", label: "Next region" },
  { keys: "F", label: "Next form control" },
  { keys: "T / Shift+T", label: "Next / previous table" },
  { keys: "I / Shift+I", label: "Next / previous list" },
  { keys: "G / Shift+G", label: "Next / previous graphic" },
  { keys: "Tab", label: "Next focusable (in focus mode)" },
  { keys: "Enter", label: "Activate current element" },
  { keys: "M", label: "Toggle browse / focus mode" },
  { keys: "Esc", label: "Close simulator" },
];

export function ScreenReaderSimulator({
  buffers,
  onClose,
}: ScreenReaderSimulatorProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const transcriptRef = useRef<HTMLOListElement>(null);
  const srRef = useRef<VirtualScreenReader | null>(null);
  const iframeDocRef = useRef<Document | null>(null);

  const [output, setOutput] = useState<SRMessage[]>([]);
  const [currentNode, setCurrentNode] =
    useState<AccessibilityNode | null>(null);
  const [highlightedElement, setHighlightedElement] =
    useState<HTMLElement | null>(null);
  const [mode, setMode] = useState<NavigationMode>("browse");
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.5);
  const [isRecording, setIsRecording] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  const titleId = useId();
  const speechRateId = useId();

  /* Mount the dialog as modal so the platform handles focus trap,
   * Escape-to-close, and backdrop. */
  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  /* Build the screen reader engine on mount, tear down on
   * unmount. The two callbacks bridge engine events to React
   * state: announcements append to the transcript; position
   * changes update the highlighted element + cursor display. */
  useEffect(() => {
    const sr = new VirtualScreenReader(
      (message) => {
        setOutput((prev) => [...prev, message]);
        // Autoscroll the transcript to the latest entry. Defer
        // a tick so React has rendered the new message.
        setTimeout(() => {
          if (transcriptRef.current) {
            transcriptRef.current.scrollTop =
              transcriptRef.current.scrollHeight;
          }
        }, 0);
      },
      (node, element) => {
        setCurrentNode(node);
        setHighlightedElement(element);
      },
    );
    srRef.current = sr;

    return () => {
      sr.destroy();
      srRef.current = null;
    };
  }, []);

  /* Keep speech and rate in sync with engine state. Toggling
   * speech on the engine controls whether announcements get
   * spoken out loud (via Web Speech API). */
  useEffect(() => {
    const sr = srRef.current;
    if (!sr) return;
    const engine = sr.getSpeechEngine();
    if (engine) {
      engine.updateSettings({ rate: speechRate });
    }
  }, [speechRate]);

  /* When the iframe finishes building its document, hand it to
   * the SR engine. The engine builds an accessibility tree from
   * the DOM, observes live regions, and announces the page-load
   * summary. */
  const handleDomReady = useCallback((iframeDoc: Document) => {
    iframeDocRef.current = iframeDoc;
    if (srRef.current) {
      srRef.current.loadDocument(iframeDoc);
    }
  }, []);

  /* Keyboard handler — the screen reader's whole point. Single
   * letters (H, K, B, L, R, F, T, I, G), arrow keys, M, Enter,
   * Tab in focus mode. Match the keystrokes of real screen
   * readers so the muscle memory is portable. */
  const handleKey = (e: ReactKeyboardEvent<HTMLDialogElement>) => {
    const sr = srRef.current;
    if (!sr) return;

    /* If the user is typing in a form control inside the modal
     * (the speech rate selector), don't intercept its input. */
    const target = e.target as HTMLElement;
    if (
      target.tagName === "INPUT" ||
      target.tagName === "SELECT" ||
      target.tagName === "TEXTAREA"
    ) {
      return;
    }

    if (e.key === "Escape") {
      // Native dialog handles this; the onClose handler runs
      // when the dialog dispatches its close event.
      return;
    }

    if (e.key === "Tab" && mode === "focus") {
      e.preventDefault();
      if (e.shiftKey) sr.previousElement();
      else sr.nextElement();
      return;
    }

    const SHORTCUT_KEYS = [
      "ArrowDown",
      "ArrowUp",
      "Enter",
      "h",
      "H",
      "k",
      "K",
      "b",
      "B",
      "l",
      "L",
      "f",
      "F",
      "m",
      "M",
      "t",
      "T",
      "i",
      "I",
      "g",
      "G",
      "r",
      "R",
    ];
    if (!SHORTCUT_KEYS.includes(e.key)) return;
    e.preventDefault();

    switch (e.key) {
      case "ArrowDown":
        sr.nextElement();
        break;
      case "ArrowUp":
        sr.previousElement();
        break;
      case "h":
      case "H":
        if (e.shiftKey) sr.previousHeading();
        else sr.nextHeading();
        break;
      case "k":
      case "K":
        if (e.shiftKey) sr.previousLink();
        else sr.nextLink();
        break;
      case "b":
      case "B":
        if (e.shiftKey) sr.previousButton();
        else sr.nextButton();
        break;
      case "l":
      case "L":
        sr.nextLandmark();
        break;
      case "r":
      case "R":
        sr.nextRegion();
        break;
      case "f":
      case "F":
        sr.nextFormControl();
        break;
      case "t":
      case "T":
        if (e.shiftKey) sr.previousTable();
        else sr.nextTable();
        break;
      case "i":
      case "I":
        if (e.shiftKey) sr.previousList();
        else sr.nextList();
        break;
      case "g":
      case "G":
        if (e.shiftKey) sr.previousGraphic();
        else sr.nextGraphic();
        break;
      case "m":
      case "M":
        sr.toggleMode();
        setMode(sr.getMode());
        break;
      case "Enter":
        sr.activateElement();
        break;
    }
  };

  const toggleSpeech = () => {
    const sr = srRef.current;
    if (!sr) return;
    const next = sr.toggleSpeech();
    setSpeechEnabled(next);
  };

  const refresh = () => {
    setOutput([]);
    setCurrentNode(null);
    setHighlightedElement(null);
    if (iframeDocRef.current && srRef.current) {
      srRef.current.loadDocument(iframeDocRef.current);
    }
  };

  /* Recording — captures every navigation, announcement, mode
   * change, activation, speech toggle, and rate change into a
   * Session that can be downloaded as JSON for replay later
   * (phase 4 replay surface). The buffers are snapshotted at
   * startRecording time so the replay can rebuild the same
   * iframe document the recording walked. */
  const toggleRecording = () => {
    const sr = srRef.current;
    if (!sr) return;
    if (isRecording) {
      const session = sr.stopRecording();
      setIsRecording(false);
      if (session) {
        setHasSession(true);
        const recorder = sr.getSessionRecorder();
        recorder.downloadSession(session);
      }
    } else {
      const html = buffers.html.map((f) => f.content).join("\n");
      const js = buffers.javascript.map((f) => f.content).join("\n\n");
      const css = buffers.css.map((f) => f.content).join("\n\n");
      sr.startRecording(html, css, js);
      setIsRecording(true);
      setHasSession(false);
    }
  };

  const exportSession = () => {
    const sr = srRef.current;
    if (!sr) return;
    const session = sr.getCurrentSession();
    if (session) {
      sr.getSessionRecorder().downloadSession(session);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="playground-dialog playground-dialog--wide"
      onClose={onClose}
      onKeyDown={handleKey}
      aria-labelledby={titleId}
    >
      <div className="playground-dialog-body">
        <header
          className="cluster"
          style={
            {
              "--space": "var(--s0)",
              "--justify": "space-between",
            } as CSSProperties
          }
        >
          <div className="cluster-grow">
            <h3 id={titleId} className="search-results-heading">
              Virtual screen reader
            </h3>
            <p className="muted flush">
              <small>
                Walk the page the way a screen-reader user would.
                Use arrow keys to step through every element, or
                single-letter shortcuts to jump by type. The
                announcements below are what NVDA, JAWS, and
                VoiceOver would speak.
              </small>
            </p>
          </div>
          <div
            className="cluster"
            style={{ "--space": "var(--s-2)" } as CSSProperties}
          >
            <button
              type="button"
              className={isRecording ? "pill pill--danger" : "pill"}
              aria-pressed={isRecording}
              onClick={toggleRecording}
              aria-label={
                isRecording
                  ? "Stop recording and download the session"
                  : "Start recording this screen reader session"
              }
            >
              {isRecording ? "Stop & save" : "Record"}
            </button>
            {hasSession && !isRecording && (
              <button
                type="button"
                className="pill"
                onClick={exportSession}
                aria-label="Download the most recent session again"
              >
                Re-download
              </button>
            )}
            <button
              type="button"
              className="pill"
              onClick={refresh}
              aria-label="Refresh — rebuild the accessibility tree from the current code"
            >
              Refresh
            </button>
            <button type="button" className="pill" onClick={onClose}>
              Close
            </button>
          </div>
        </header>

        <div
          className="switcher"
          style={
            {
              "--threshold": "60ch",
              "--space": "var(--s0)",
            } as CSSProperties
          }
        >
          <section
            className="stack"
            style={{ "--space": "var(--s-1)" } as CSSProperties}
            aria-label="Rendered preview"
          >
            <h4 className="search-results-heading">Preview</h4>
            <PlaygroundPreview
              buffers={buffers}
              onDomReady={handleDomReady}
              highlightedElement={highlightedElement}
              highlightMode="screen-reader"
            />
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s-1)" } as CSSProperties}
            aria-label="Screen reader output"
          >
            <h4 className="search-results-heading">
              Screen reader output
            </h4>

            <div
              className="sr-cursor"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              <p className="flush">
                <small className="muted">Cursor position</small>
              </p>
              <p className="flush">
                <strong>
                  {currentNode
                    ? currentNode.name || currentNode.role
                    : "Not positioned"}
                </strong>
              </p>
              {currentNode && (
                <p className="flush">
                  <small className="muted">
                    Role: {currentNode.role}
                    {currentNode.properties.level
                      ? ` · Level ${currentNode.properties.level}`
                      : ""}
                  </small>
                </p>
              )}
            </div>

            <div
              className="cluster"
              style={{ "--space": "var(--s-2)" } as CSSProperties}
            >
              <button
                type="button"
                className={
                  speechEnabled ? "pill pill--danger" : "pill"
                }
                aria-pressed={speechEnabled}
                onClick={toggleSpeech}
              >
                {speechEnabled ? "Speech on" : "Speech off"}
              </button>
              <label htmlFor={speechRateId} className="muted">
                <small>Rate</small>
              </label>
              <select
                id={speechRateId}
                value={speechRate}
                onChange={(e) => setSpeechRate(Number(e.target.value))}
                disabled={!speechEnabled}
                className="sr-rate"
              >
                {SPEECH_RATES.map((r) => (
                  <option key={r} value={r}>
                    {r}×
                  </option>
                ))}
              </select>
            </div>

            <ol
              ref={transcriptRef}
              className="sr-transcript"
              aria-label="Announcement transcript"
            >
              {output.length === 0 ? (
                <li className="sr-transcript-empty">
                  <small className="muted">
                    No announcements yet. Move focus to the preview
                    pane, then use arrow keys.
                  </small>
                </li>
              ) : (
                output.map((message) => (
                  <li
                    key={message.id}
                    data-type={message.type}
                    className="sr-transcript-entry"
                  >
                    <p className="flush">{message.content}</p>
                    <p className="flush">
                      <small className="muted">
                        {new Date(message.timestamp).toLocaleTimeString()}{" "}
                        · {message.type.replace("-", " ")}
                      </small>
                    </p>
                  </li>
                ))
              )}
            </ol>

            <div
              className="cluster"
              style={
                {
                  "--space": "var(--s-2)",
                  "--justify": "space-between",
                } as CSSProperties
              }
            >
              <span className="muted">
                <small>Mode:</small>
              </span>
              <div
                className="cluster"
                style={{ "--space": "var(--s-2)" } as CSSProperties}
              >
                <button
                  type="button"
                  className="pill"
                  aria-pressed={mode === "browse"}
                  onClick={() => {
                    if (srRef.current && srRef.current.getMode() !== "browse") {
                      srRef.current.toggleMode();
                      setMode(srRef.current.getMode());
                    }
                  }}
                >
                  Browse
                </button>
                <button
                  type="button"
                  className="pill"
                  aria-pressed={mode === "focus"}
                  onClick={() => {
                    if (srRef.current && srRef.current.getMode() !== "focus") {
                      srRef.current.toggleMode();
                      setMode(srRef.current.getMode());
                    }
                  }}
                >
                  Focus
                </button>
              </div>
            </div>
          </section>
        </div>

        <details className="sr-keyhelp">
          <summary>
            <strong>Keyboard shortcuts</strong>
          </summary>
          <ul className="sr-keyhelp-list">
            {KEY_HELP.map((k) => (
              <li key={k.keys}>
                <kbd>{k.keys}</kbd> {k.label}
              </li>
            ))}
          </ul>
        </details>
      </div>
    </dialog>
  );
}
