"use client";

/* ImageFigure — a captioned image with a native-<dialog> zoom modal.
 *
 * AT contract:
 * - Trigger is a real <button> wrapping the image. Accessible name:
 *   "View larger: {caption}". Visible "View larger" badge in the
 *   corner satisfies SC 2.5.3 Label in Name (visible text matches
 *   the start of the accessible name).
 * - Modal uses native <dialog>.showModal(): focus-trap, ESC-to-close,
 *   inert background, and focus-return to the trigger are all
 *   browser-native. Close button is the first focusable inside, so
 *   SR users hear "Close, button" immediately on open.
 * - Backdrop click closes (event.target === dialog).
 * - Dialog has aria-label set to the caption text, so SR users
 *   hear the figure's caption as the dialog's name on open.
 * - Caption renders both under the thumbnail and inside the dialog,
 *   so dialog content is self-sufficient without page context.
 *
 * Voice control: the visible "View larger" text is part of the
 * trigger's visible label, so users can say "View larger". For pages
 * with multiple ImageFigures, the engine's numbered-overlay mode
 * disambiguates; the accessible name carries the caption for
 * engines that resolve by name. */

import {
  useId,
  useRef,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";

interface ImageFigureProps {
  /* Image source. Required when `content` is not supplied. */
  src?: string;
  /* Image alt text. Required when `content` is not supplied. */
  alt?: string;
  /* Optional ReactNode replacement for the inner <img>. When supplied,
   * this content is rendered in both the trigger frame and the
   * dialog frame in place of the <img>. Use for inline SVG diagrams
   * that need to inherit the page's CSS custom properties (zone
   * tokens, forced-colors mode) and carry their own ARIA structure.
   * The component instances rendered in trigger and dialog are
   * separate React subtrees, so any useId() inside the content
   * generates distinct IDs in each location. */
  content?: ReactNode;
  /* Visible caption — may contain inline elements like <Link>. */
  caption: ReactNode;
  /* Plain-text version of the caption, used for the trigger's
   * accessible name and the dialog's aria-label. Must be supplied
   * because aria-label only accepts strings. */
  captionText: string;
  frameN: number;
  frameD: number;
  /* Letterbox instead of crop. Use for diagrams. */
  contain?: boolean;
  /* Add .sidebar class — for use as a child of .with-sidebar. */
  sidebar?: boolean;
}

export function ImageFigure({
  src,
  alt,
  content,
  caption,
  captionText,
  frameN,
  frameD,
  contain = false,
  sidebar = false,
}: ImageFigureProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogCaptionId = useId();

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  /* Native <dialog> exposes the backdrop as the dialog element's
   * own click target when the click lands outside .image-figure__dialog-body.
   * Comparing event.target to the dialog node distinguishes
   * backdrop clicks from body clicks. */
  const handleDialogClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) {
      close();
    }
  };

  const figureClass = ["image-figure", "stack", sidebar ? "sidebar" : null]
    .filter(Boolean)
    .join(" ");

  const triggerFrameClass = [
    "frame",
    "image-figure__trigger",
    contain ? "frame--contain" : null,
  ]
    .filter(Boolean)
    .join(" ");

  const dialogFrameClass = [
    "image-figure__dialog-frame",
    contain ? "image-figure__dialog-frame--contain" : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <figure
      className={figureClass}
      style={{ "--space": "var(--s-1)" } as CSSProperties}
    >
      <button
        type="button"
        className={triggerFrameClass}
        style={
          {
            "--frame-n": String(frameN),
            "--frame-d": String(frameD),
          } as CSSProperties
        }
        onClick={open}
        aria-label={`View larger: ${captionText}`}
      >
        {content ?? <img src={src} alt={alt} />}
        <span className="image-figure__badge" aria-hidden="true">
          View larger
        </span>
      </button>

      <figcaption>{caption}</figcaption>

      <dialog
        ref={dialogRef}
        className="image-figure__dialog"
        aria-labelledby={dialogCaptionId}
        onClick={handleDialogClick}
      >
        <div className="image-figure__dialog-body">
          <button
            type="button"
            className="image-figure__close"
            onClick={close}
          >
            Close
          </button>
          <div className={dialogFrameClass}>
            {content ?? <img src={src} alt={alt} />}
          </div>
          <p
            id={dialogCaptionId}
            className="image-figure__dialog-caption"
          >
            {caption}
          </p>
        </div>
      </dialog>
    </figure>
  );
}
