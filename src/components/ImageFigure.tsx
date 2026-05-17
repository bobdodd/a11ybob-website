"use client";

/* ImageFigure — a captioned image (or inline SVG) with a
 * native-<dialog> zoom modal.
 *
 * AT contract:
 * - Trigger is a real <button> with accessible name
 *   "View larger: {triggerLabel}". Visible "View larger" text in the
 *   button matches the start of the accessible name (SC 2.5.3 Label
 *   in Name).
 * - Raster images render *inside* the trigger button: click-anywhere
 *   on the image opens the dialog (a convenience for sighted users),
 *   and the raster has no internal AT structure to expose anyway.
 * - Inline SVG content (the `content` prop) renders *outside* the
 *   trigger as a sibling, so the SVG's WAI-ARIA Graphics roles
 *   (graphics-object, graphics-symbol) remain navigable to AT users
 *   instead of being hidden inside an interactive button. The
 *   trigger is a small overlay button positioned absolutely in the
 *   image-frame's bottom-right corner — visually identical to the
 *   raster badge, structurally a separate node.
 * - Modal uses native <dialog>.showModal(): focus-trap,
 *   ESC-to-close, inert background, and focus-return to the trigger
 *   are all browser-native. Close button is the first focusable
 *   inside, so SR users hear "Close, button" immediately on open.
 * - Backdrop click closes (event.target === dialog).
 * - Dialog uses aria-label={triggerLabel} for a short accessible
 *   name (so the dialog announces its identity in a few words on
 *   open) and aria-describedby pointing at the in-dialog caption
 *   for the longer description, so SR users hear the figure's
 *   caption as the dialog's *description* rather than its *name*.
 * - Caption renders both under the thumbnail and inside the dialog;
 *   the dialog is self-sufficient without page context.
 *
 * Voice control: the visible "View larger" text is part of the
 * trigger's visible label, so users can say "View larger". For
 * pages with multiple ImageFigures, the engine's numbered-overlay
 * mode disambiguates; the accessible name carries the triggerLabel
 * for engines that resolve by name. */

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
   * this content is rendered as a SIBLING of the trigger button
   * rather than wrapped inside it, so any internal AT structure
   * (WAI-ARIA Graphics roles in inline SVG) remains navigable.
   * The trigger and dialog render the content as separate React
   * subtrees, so any useId() inside the content generates distinct
   * IDs in each location. */
  content?: ReactNode;
  /* Visible caption — may contain inline elements like <Link>. */
  caption: ReactNode;
  /* Plain-text version of the caption. Rendered as the dialog's
   * description via aria-describedby, so SR users hear it as the
   * dialog's description rather than its name. Should be the full
   * descriptive text. */
  captionText: string;
  /* Short identifier for the trigger and dialog accessible names —
   * e.g. "the PTD task tree", "the Ascotel Crystal terminal".
   * Used in:
   *   - trigger aria-label: "View larger: {triggerLabel}"
   *   - dialog aria-label: "{triggerLabel}"
   * If omitted, falls back to captionText (verbose but never
   * leaves a control unlabelled). New call sites should always
   * supply this. */
  triggerLabel?: string;
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
  triggerLabel,
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
   * own click target when the click lands outside the dialog body.
   * Comparing event.target to the dialog node distinguishes
   * backdrop clicks from body clicks. */
  const handleDialogClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) {
      close();
    }
  };

  /* Short name used for trigger and dialog accessible names. Falls
   * back to the full caption text if no triggerLabel was supplied
   * (preserves the contract while flagging the call site for
   * authorship attention). */
  const accessibleName = triggerLabel ?? captionText;

  const figureClass = ["image-figure", "stack", sidebar ? "sidebar" : null]
    .filter(Boolean)
    .join(" ");

  /* For raster images the trigger button IS the frame: wrapping the
   * image lets click-anywhere open the dialog. For content (inline
   * SVG) the frame is a plain <div> and the trigger is an overlay
   * sibling — keeps the SVG's AT structure reachable. */
  const triggerFrameClass = [
    "frame",
    "image-figure__trigger",
    contain ? "frame--contain" : null,
  ]
    .filter(Boolean)
    .join(" ");

  const contentFrameClass = [
    "frame",
    "image-figure__content-frame",
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

  const frameStyle = {
    "--frame-n": String(frameN),
    "--frame-d": String(frameD),
  } as CSSProperties;

  return (
    <figure
      className={figureClass}
      style={{ "--space": "var(--s-1)" } as CSSProperties}
    >
      {content ? (
        /* Content mode: SVG (or any rich-AT-content node) renders
         * as the frame's child; the trigger button is an overlay
         * sibling, not the SVG's parent. AT navigation into the
         * content's internal structure is unblocked. */
        <div className={contentFrameClass} style={frameStyle}>
          {content}
          <button
            type="button"
            className="image-figure__overlay-trigger"
            onClick={open}
            aria-label={`View larger: ${accessibleName}`}
          >
            View larger
          </button>
        </div>
      ) : (
        /* Raster mode: the trigger button wraps the image. Click-
         * anywhere on the image opens the dialog. The image is
         * opaque to AT (alt only), so there's no internal structure
         * being hidden by the wrapping button. */
        <button
          type="button"
          className={triggerFrameClass}
          style={frameStyle}
          onClick={open}
          aria-label={`View larger: ${accessibleName}`}
        >
          <img src={src} alt={alt} />
          <span className="image-figure__badge" aria-hidden="true">
            View larger
          </span>
        </button>
      )}

      <figcaption>{caption}</figcaption>

      <dialog
        ref={dialogRef}
        className="image-figure__dialog"
        aria-label={accessibleName}
        aria-describedby={dialogCaptionId}
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
