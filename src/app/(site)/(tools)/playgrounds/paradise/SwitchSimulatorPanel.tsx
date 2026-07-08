"use client";

/* SwitchSimulatorPanel — wraps the SwitchSimulator engine in a UI
 * that lets a developer experience their page the way a switch-
 * access user would. Switch-access users navigate by pressing one
 * or two switches; the system scans through actionable elements
 * automatically (or on each step press) and the user "presses the
 * switch" when the scanner reaches the element they want.
 *
 * Two modes:
 * - Single switch (auto-scan): the system automatically advances
 *   through actionable elements at a configurable rate. The user
 *   presses the switch (here, Space) to activate the currently-
 *   highlighted element.
 * - Dual switch (step-scan): the user presses switch 1 (Space) to
 *   step to the next element, switch 2 (Enter) to activate.
 *
 * The point of the simulator is for sighted developers to feel
 * how slow the interaction is — and to see what happens when
 * they've put a switch user 30 stops away from the action they
 * want to take. */

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
import {
  SwitchSimulator,
  type ActionableElement,
  type ScanState,
  type SwitchMode,
} from "@/lib/at-simulator/SwitchSimulator";
import { PlaygroundPreview } from "./PlaygroundPreview";

interface SwitchSimulatorPanelProps {
  buffers: LangBuffers;
  onClose: () => void;
}

interface LogEntry {
  id: number;
  timestamp: number;
  type: "info" | "action";
  message: string;
}

const SCAN_SPEED_MIN = 500;
const SCAN_SPEED_MAX = 3000;
const SCAN_SPEED_DEFAULT = 1500;

export function SwitchSimulatorPanel({
  buffers,
  onClose,
}: SwitchSimulatorPanelProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const logRef = useRef<HTMLOListElement>(null);
  const simRef = useRef<SwitchSimulator | null>(null);
  const iframeDocRef = useRef<Document | null>(null);
  const logCounterRef = useRef(0);

  const [mode, setMode] = useState<SwitchMode>("single");
  const [scanSpeed, setScanSpeed] = useState(SCAN_SPEED_DEFAULT);
  const [autoRestart, setAutoRestart] = useState(true);
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [current, setCurrent] = useState<ActionableElement | null>(null);
  const [highlightedElement, setHighlightedElement] =
    useState<HTMLElement | null>(null);
  const [totalElements, setTotalElements] = useState(0);
  const [log, setLog] = useState<LogEntry[]>([]);

  const titleId = useId();
  const speedId = useId();

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  /* Build the simulator on mount, tear it down on unmount. The
   * three callbacks bridge engine events to React state:
   * highlight changes update the currently-scanned element,
   * activations update the "last activated" entry in the log,
   * and engine messages append to the log. */
  useEffect(() => {
    const sim = new SwitchSimulator(
      {
        mode: "single",
        scanSpeed: SCAN_SPEED_DEFAULT,
        autoRestart: true,
        highlightColor: "#d62828",
      },
      (element) => {
        setCurrent(element);
        setHighlightedElement(element ? element.domElement : null);
        // Refresh the scan state from the engine so the UI
        // reflects start/stop transitions the engine itself made.
        const sim = simRef.current;
        if (sim) {
          const state = sim.getState();
          setScanState(state.scanState);
        }
      },
      (element) => {
        // The activation callback fires AFTER the engine has
        // dispatched the click/Enter/Space synthesis to the
        // actual DOM element inside the iframe. The user's
        // JavaScript handler will already have run by this point.
        const id = ++logCounterRef.current;
        setLog((prev) => [
          ...prev,
          {
            id,
            timestamp: Date.now(),
            type: "action",
            message: `Activated: ${element.actionDescription}`,
          },
        ]);
      },
      (message, type) => {
        const id = ++logCounterRef.current;
        setLog((prev) => [...prev, { id, timestamp: Date.now(), type, message }]);
      },
    );
    simRef.current = sim;

    return () => {
      sim.stopScan();
      simRef.current = null;
    };
  }, []);

  /* Push live setting changes through to the engine. */
  useEffect(() => {
    const sim = simRef.current;
    if (!sim) return;
    sim.updateSettings({ mode, scanSpeed, autoRestart });
  }, [mode, scanSpeed, autoRestart]);

  /* Autoscroll the log when new entries land. */
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [log.length]);

  /* When the iframe finishes building its document, hand it to
   * the engine so it can index actionable elements. */
  const handleDomReady = useCallback((iframeDoc: Document) => {
    iframeDocRef.current = iframeDoc;
    const sim = simRef.current;
    if (sim) {
      sim.loadDocument(iframeDoc);
      const state = sim.getState();
      setTotalElements(state.totalElements);
      setScanState(state.scanState);
    }
  }, []);

  /* Keyboard switch presses. Space = switch 1, Enter = switch 2.
   * The choice of keys mirrors how a real two-switch user would
   * be configured: thumb / index for switch 1 (more frequent),
   * other hand / foot for switch 2 (less frequent). */
  const handleKey = (e: ReactKeyboardEvent<HTMLDialogElement>) => {
    const sim = simRef.current;
    if (!sim) return;

    const target = e.target as HTMLElement;
    if (
      target.tagName === "INPUT" ||
      target.tagName === "SELECT" ||
      target.tagName === "TEXTAREA"
    ) {
      return;
    }

    if (e.key === " " || e.code === "Space") {
      e.preventDefault();
      sim.handleSwitchPress(1);
    } else if (e.key === "Enter" && mode === "dual") {
      e.preventDefault();
      sim.handleSwitchPress(2);
    }
  };

  const startStop = () => {
    const sim = simRef.current;
    if (!sim) return;
    if (scanState === "scanning") {
      sim.stopScan();
    } else {
      sim.startScan();
    }
    setScanState(sim.getState().scanState);
  };

  const refresh = () => {
    setLog([]);
    setCurrent(null);
    setHighlightedElement(null);
    if (iframeDocRef.current && simRef.current) {
      simRef.current.stopScan();
      simRef.current.loadDocument(iframeDocRef.current);
      const state = simRef.current.getState();
      setTotalElements(state.totalElements);
      setScanState(state.scanState);
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
              Switch access simulator
            </h3>
            <p className="muted flush">
              <small>
                Experience your page the way a switch-access user
                would. The scanner steps through actionable elements;
                you &ldquo;press the switch&rdquo; (Space, or Enter
                in dual-switch mode) to activate the highlighted
                target. The cost of every wasted scan stop is real.
              </small>
            </p>
          </div>
          <div
            className="cluster"
            style={{ "--space": "var(--s-2)" } as CSSProperties}
          >
            <button
              type="button"
              className="pill"
              onClick={refresh}
              aria-label="Refresh — rebuild the actionable element list from the current code"
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
              highlightMode="switch"
            />
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s-1)" } as CSSProperties}
            aria-label="Switch controls"
          >
            <h4 className="search-results-heading">Switch panel</h4>

            <div
              className="sr-cursor"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              <p className="flush">
                <small className="muted">Scanner</small>
              </p>
              <p className="flush">
                <strong>
                  {current ? current.name || current.role : "Idle"}
                </strong>
              </p>
              <p className="flush">
                <small className="muted">
                  {totalElements > 0
                    ? `${totalElements} actionable element${totalElements === 1 ? "" : "s"} on the page · `
                    : "No actionable elements yet · "}
                  state: {scanState}
                </small>
              </p>
            </div>

            <fieldset
              className="stack switch-fieldset"
              style={{ "--space": "var(--s-2)" } as CSSProperties}
            >
              <legend>
                <strong>Settings</strong>
              </legend>

              <div
                className="cluster"
                style={
                  {
                    "--space": "var(--s-2)",
                    "--justify": "space-between",
                  } as CSSProperties
                }
              >
                <span>Mode</span>
                <div
                  className="cluster"
                  style={{ "--space": "var(--s-2)" } as CSSProperties}
                >
                  <button
                    type="button"
                    className="pill"
                    aria-pressed={mode === "single"}
                    onClick={() => setMode("single")}
                  >
                    Single switch
                  </button>
                  <button
                    type="button"
                    className="pill"
                    aria-pressed={mode === "dual"}
                    onClick={() => setMode("dual")}
                  >
                    Dual switch
                  </button>
                </div>
              </div>

              <div className="stack" style={{ "--space": "var(--s-2)" } as CSSProperties}>
                <label htmlFor={speedId}>
                  Scan speed: <strong>{scanSpeed} ms</strong>{" "}per step
                </label>
                <input
                  id={speedId}
                  type="range"
                  min={SCAN_SPEED_MIN}
                  max={SCAN_SPEED_MAX}
                  step={100}
                  value={scanSpeed}
                  onChange={(e) => setScanSpeed(Number(e.target.value))}
                  className="switch-speed"
                  disabled={mode === "dual"}
                  aria-describedby={mode === "dual" ? `${speedId}-hint` : undefined}
                />
                {mode === "dual" && (
                  <p id={`${speedId}-hint`} className="muted flush">
                    <small>
                      Scan speed only applies in single-switch mode;
                      dual-switch mode steps on each switch-1 press.
                    </small>
                  </p>
                )}
              </div>

              <div
                className="cluster"
                style={{ "--space": "var(--s-2)" } as CSSProperties}
              >
                <input
                  id={`${speedId}-restart`}
                  type="checkbox"
                  checked={autoRestart}
                  onChange={(e) => setAutoRestart(e.target.checked)}
                />
                <label htmlFor={`${speedId}-restart`}>
                  Auto-restart at end of list
                </label>
              </div>
            </fieldset>

            <div
              className="cluster"
              style={
                {
                  "--space": "var(--s-2)",
                  "--justify": "center",
                } as CSSProperties
              }
            >
              <button
                type="button"
                className={
                  scanState === "scanning"
                    ? "pill pill--danger"
                    : "pill"
                }
                onClick={startStop}
              >
                {scanState === "scanning"
                  ? "Stop scanning"
                  : "Start scanning"}
              </button>
            </div>

            <p className="muted flush">
              <small>
                Press <kbd>Space</kbd>{" "}to activate{" "}
                {mode === "dual"
                  ? "the highlighted element (switch 2: Enter to activate after stepping with Space)"
                  : "the highlighted element (single switch)"}
                .
              </small>
            </p>

            <ol
              ref={logRef}
              className="sr-transcript switch-log"
              aria-label="Switch action log"
            >
              {log.length === 0 ? (
                <li className="sr-transcript-empty">
                  <small className="muted">
                    Press <strong>Start scanning</strong>{" "}to begin.
                  </small>
                </li>
              ) : (
                log.map((entry) => (
                  <li
                    key={entry.id}
                    data-type={entry.type === "action" ? "announcement" : "navigation"}
                    className="sr-transcript-entry"
                  >
                    <p className="flush">{entry.message}</p>
                    <p className="flush">
                      <small className="muted">
                        {new Date(entry.timestamp).toLocaleTimeString()}{" "}
                        · {entry.type}
                      </small>
                    </p>
                  </li>
                ))
              )}
            </ol>
          </section>
        </div>
      </div>
    </dialog>
  );
}
