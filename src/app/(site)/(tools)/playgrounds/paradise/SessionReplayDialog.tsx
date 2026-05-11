"use client";

/* SessionReplayDialog — plays back a recorded screen-reader
 * session in a fresh sandboxed iframe. The session carries the
 * HTML / JavaScript / CSS the recording walked, so the iframe
 * rebuilds an exact copy of the document and the recorded
 * element-selectors resolve.
 *
 * Playback controls: play / pause, step backward / forward,
 * seek-to-event scrubber, playback speed (0.5×–3×). Each replayed
 * event lands in the transcript exactly as it did during the
 * original recording, with element highlights synced. */

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import type { LangBuffers } from "@/lib/paradise/examples";
import { SessionReplay } from "@/lib/at-simulator/SessionReplay";
import type {
  ReplayState,
} from "@/lib/at-simulator/SessionReplay";
import type {
  Session,
  SessionEvent,
} from "@/lib/at-simulator/SessionRecorder";
import { PlaygroundPreview } from "./PlaygroundPreview";

interface SessionReplayDialogProps {
  session: Session;
  onClose: () => void;
}

interface ReplayLogEntry {
  index: number;
  event: SessionEvent;
}

const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.5, 2, 3] as const;

export function SessionReplayDialog({
  session,
  onClose,
}: SessionReplayDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const replayRef = useRef<SessionReplay | null>(null);
  const transcriptRef = useRef<HTMLOListElement>(null);

  const [state, setState] = useState<ReplayState>("idle");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [highlightedElement, setHighlightedElement] =
    useState<HTMLElement | null>(null);
  const [played, setPlayed] = useState<ReplayLogEntry[]>([]);
  const [speed, setSpeed] = useState(1);

  const titleId = useId();
  const speedId = useId();
  const seekId = useId();

  /* Convert the session's concatenated buffers into the
   * multi-file LangBuffers shape that PlaygroundPreview expects.
   * The replay iframe renders exactly what the recording walked. */
  const replayBuffers: LangBuffers = useMemo(
    () => ({
      html: [
        {
          name: "recorded.html",
          content: session.htmlContent,
        },
      ],
      javascript: session.jsContent
        ? [{ name: "recorded.js", content: session.jsContent }]
        : [],
      css: session.cssContent
        ? [{ name: "recorded.css", content: session.cssContent }]
        : [],
    }),
    [session.htmlContent, session.jsContent, session.cssContent],
  );

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  useEffect(() => {
    const replay = new SessionReplay(
      (s) => setState(s),
      (event, index) => {
        setCurrentIndex(index);
        setPlayed((prev) => {
          // Allow rebuild when seeking backward; only append if
          // the index is the next one in sequence.
          if (prev.length > 0 && prev[prev.length - 1].index >= index) {
            return prev.filter((e) => e.index < index).concat({
              index,
              event,
            });
          }
          return [...prev, { index, event }];
        });
        setTimeout(() => {
          if (transcriptRef.current) {
            transcriptRef.current.scrollTop =
              transcriptRef.current.scrollHeight;
          }
        }, 0);
      },
      (p) => setProgress(p),
      (element) => setHighlightedElement(element),
    );
    replay.loadSession(session);
    replayRef.current = replay;

    return () => {
      replay.destroy();
      replayRef.current = null;
    };
  }, [session]);

  useEffect(() => {
    replayRef.current?.setPlaybackSpeed(speed);
  }, [speed]);

  const handleDomReady = useCallback((iframeDoc: Document) => {
    replayRef.current?.setIframeDocument(iframeDoc);
  }, []);

  const togglePlay = () => {
    const r = replayRef.current;
    if (!r) return;
    if (state === "playing") r.pause();
    else r.play();
  };

  const stepBack = () => {
    replayRef.current?.stepBackward();
  };

  const stepForward = () => {
    replayRef.current?.stepForward();
  };

  const onSeek = (value: number) => {
    replayRef.current?.seekToEvent(value);
  };

  const total = session.events.length;
  const playPauseLabel =
    state === "playing"
      ? "Pause"
      : state === "finished"
        ? "Replay"
        : "Play";

  return (
    <dialog
      ref={dialogRef}
      className="playground-dialog playground-dialog--wide"
      onClose={onClose}
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
              Replay screen-reader session
            </h3>
            <p className="muted flush">
              <small>
                Recorded{" "}
                {new Date(session.startTime).toLocaleString()} ·{" "}
                {total} {total === 1 ? "event" : "events"} ·{" "}
                {session.metadata.elementsVisited} elements visited
              </small>
            </p>
          </div>
          <button type="button" className="pill" onClick={onClose}>
            Close
          </button>
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
            aria-label="Recorded preview"
          >
            <h4 className="search-results-heading">Recorded page</h4>
            <PlaygroundPreview
              buffers={replayBuffers}
              onDomReady={handleDomReady}
              highlightedElement={highlightedElement}
              highlightMode="screen-reader"
            />
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s-1)" } as CSSProperties}
            aria-label="Replay controls and transcript"
          >
            <h4 className="search-results-heading">Playback</h4>

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
                className="pill"
                onClick={stepBack}
                disabled={currentIndex <= 0}
              >
                ⏮ Back
              </button>
              <button
                type="button"
                className="pill"
                onClick={togglePlay}
              >
                {state === "playing" ? "⏸ " : "▶ "}
                {playPauseLabel}
              </button>
              <button
                type="button"
                className="pill"
                onClick={stepForward}
                disabled={currentIndex >= total - 1}
              >
                Forward ⏭
              </button>
            </div>

            <div className="stack" style={{ "--space": "var(--s-2)" } as CSSProperties}>
              <label htmlFor={seekId}>
                Position:{" "}
                <strong>
                  {currentIndex + 1} / {total}
                </strong>{" "}
                <small className="muted">
                  ({Math.round(progress)}% through)
                </small>
              </label>
              <input
                id={seekId}
                type="range"
                min={0}
                max={Math.max(0, total - 1)}
                step={1}
                value={currentIndex}
                onChange={(e) => onSeek(Number(e.target.value))}
                className="switch-speed"
              />
            </div>

            <div
              className="cluster"
              style={
                {
                  "--space": "var(--s-2)",
                  "--justify": "space-between",
                } as CSSProperties
              }
            >
              <label htmlFor={speedId}>
                Playback speed
              </label>
              <select
                id={speedId}
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="sr-rate"
              >
                {PLAYBACK_SPEEDS.map((s) => (
                  <option key={s} value={s}>
                    {s}×
                  </option>
                ))}
              </select>
            </div>

            <ol
              ref={transcriptRef}
              className="sr-transcript"
              aria-label="Replayed announcement transcript"
            >
              {played.length === 0 ? (
                <li className="sr-transcript-empty">
                  <small className="muted">
                    Press <strong>Play</strong> to start replay.
                  </small>
                </li>
              ) : (
                played.map((entry) => (
                  <li
                    key={entry.index}
                    data-type={mapEventType(entry.event.type)}
                    className="sr-transcript-entry"
                  >
                    <p className="flush">
                      {describeEvent(entry.event)}
                    </p>
                    <p className="flush">
                      <small className="muted">
                        {new Date(entry.event.timestamp).toLocaleTimeString()}{" "}
                        · {entry.event.type.replace("-", " ")}
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

/* Map a SessionEvent type onto one of the SR transcript data-type
 * values so the same border-band styling applies. */
function mapEventType(type: SessionEvent["type"]): string {
  switch (type) {
    case "announcement":
      return "announcement";
    case "navigation":
      return "navigation";
    case "mode-change":
      return "state-change";
    case "activation":
      return "page-load";
    case "speech-toggle":
    case "rate-change":
      return "state-change";
    default:
      return "navigation";
  }
}

function describeEvent(event: SessionEvent): string {
  if (event.data.message?.content) return event.data.message.content;
  if (event.type === "navigation" && event.data.nodeName) {
    return `${event.data.nodeRole ?? "element"}, ${event.data.nodeName}`;
  }
  if (event.type === "mode-change" && event.data.mode) {
    return `Mode changed to ${event.data.mode}`;
  }
  if (event.type === "activation" && event.data.nodeName) {
    return `Activated: ${event.data.nodeName}`;
  }
  if (event.type === "speech-toggle") {
    return `Speech ${event.data.speechEnabled ? "enabled" : "disabled"}`;
  }
  if (event.type === "rate-change" && event.data.speechRate) {
    return `Speech rate changed to ${event.data.speechRate}×`;
  }
  return event.type;
}
