import { useId } from "react";

/* PTDTaskTree — inline SVG rendering of the canonical Polymorphic
 * Task Decomposition example: "Delete File" realised as two
 * polymorphs, each with its own task ordering and leaf-level
 * modality affordances.
 *
 * AT contract (WAI-ARIA Graphics module + always-on fallback):
 * - Root <svg role="img"> with aria-labelledby + aria-describedby
 *   pointing at <title> and <desc>. This is the always-supported
 *   summary every AT engine announces, regardless of Graphics
 *   module support.
 * - Internal structural groups carry role="graphics-object" with
 *   aria-label. Leaf modality icons carry role="graphics-symbol"
 *   with aria-label. Engines that recognise the Graphics module
 *   (VoiceOver, recent NVDA) expose these for in-diagram navigation;
 *   engines that don't (older JAWS) silently ignore them and the
 *   title/desc still carries the diagram.
 * - Edges and "before" labels are aria-hidden; the temporal
 *   relationships they encode are spelled out inside each sub-task
 *   node's aria-label ("performed after X" / "first in sequence").
 *
 * Styling notes (see ptd-task-tree.css):
 * - Strokes and text use currentColor; the CSS sets `color` to
 *   var(--ink) so the diagram inherits the page's zone tint and
 *   adapts to forced-colors mode automatically through CSS system
 *   colour resolution.
 * - Node fills use var(--surface-1) via class so boxes are
 *   distinguishable from the page background.
 * - Font-family inherits from the page. */

export function PTDTaskTree() {
  const ids = useId();
  const titleId = `${ids}-title`;
  const descId = `${ids}-desc`;
  const arrowId = `${ids}-arrow`;

  return (
    <svg
      viewBox="0 0 1600 900"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="ptd-task-tree"
    >
      <title id={titleId}>
        Polymorphic Task Decomposition: the Delete File example
      </title>
      <desc id={descId}>
        The canonical PTD example. The same underlying intention &mdash;
        Delete File &mdash; realised as two polymorphs: Direct
        Manipulation and Modal Dialogue, each with its own task
        ordering and its own leaf-level modality affordances. The
        capability model selects between polymorphs at runtime based
        on user, device, and operating context.
      </desc>

      <defs>
        <marker
          id={arrowId}
          markerWidth="12"
          markerHeight="12"
          refX="10"
          refY="4"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,8 L10,4 z" fill="currentColor" />
        </marker>
      </defs>

      {/* ===== Edges (decorative; relationships spelled out in node labels) ===== */}
      <g aria-hidden="true" className="ptd-task-tree__edges">
        {/* Root to polymorphs */}
        <line x1="800" y1="120" x2="440" y2="200" />
        <line x1="800" y1="120" x2="1160" y2="200" />
        {/* Direct Manipulation to its sub-tasks */}
        <line x1="440" y1="280" x2="300" y2="380" />
        <line x1="440" y1="280" x2="580" y2="380" />
        {/* Modal Dialogue to its sub-tasks */}
        <line x1="1160" y1="280" x2="910" y2="380" />
        <line x1="1160" y1="280" x2="1150" y2="380" />
        <line x1="1160" y1="280" x2="1390" y2="380" />
        {/* Polymorph nodes down to their modality boxes (dashed) */}
        <line
          x1="440"
          y1="280"
          x2="440"
          y2="540"
          strokeDasharray="6 6"
        />
        <line
          x1="1160"
          y1="280"
          x2="1160"
          y2="540"
          strokeDasharray="6 6"
        />
      </g>

      {/* ===== ROOT ===== */}
      <g role="graphics-object" aria-label="Root task: Delete File">
        <rect
          x="680"
          y="40"
          width="240"
          height="80"
          className="ptd-task-tree__node-box"
        />
        <text
          x="800"
          y="80"
          textAnchor="middle"
          dominantBaseline="central"
        >
          Delete File
        </text>
      </g>

      {/* ===== POLYMORPH 1: DIRECT MANIPULATION ===== */}
      <g
        role="graphics-object"
        aria-label="First polymorph of Delete File: Direct Manipulation"
      >
        <rect
          x="300"
          y="200"
          width="280"
          height="80"
          className="ptd-task-tree__node-box"
        />
        <text
          x="440"
          y="240"
          textAnchor="middle"
          dominantBaseline="central"
        >
          Direct Manipulation
        </text>
      </g>

      {/* DM sub-tasks */}
      <g
        role="graphics-object"
        aria-label="Direct Manipulation sub-task: Select File, performed before Select Delete"
      >
        <rect
          x="180"
          y="380"
          width="240"
          height="80"
          className="ptd-task-tree__node-box"
        />
        <text
          x="300"
          y="420"
          textAnchor="middle"
          dominantBaseline="central"
        >
          Select File
        </text>
      </g>
      <g
        role="graphics-object"
        aria-label="Direct Manipulation sub-task: Select Delete, performed after Select File"
      >
        <rect
          x="460"
          y="380"
          width="240"
          height="80"
          className="ptd-task-tree__node-box"
        />
        <text
          x="580"
          y="420"
          textAnchor="middle"
          dominantBaseline="central"
        >
          Select Delete
        </text>
      </g>

      {/* DM "before" arrow */}
      <g aria-hidden="true" className="ptd-task-tree__edges">
        <line
          x1="424"
          y1="420"
          x2="456"
          y2="420"
          markerEnd={`url(#${arrowId})`}
        />
        <text x="440" y="400" textAnchor="middle" fontSize="22">
          before
        </text>
      </g>

      {/* DM modality affordances */}
      <g
        role="graphics-object"
        aria-label="Direct Manipulation modality affordances: scanning input and visual output"
      >
        <rect
          x="200"
          y="540"
          width="480"
          height="280"
          className="ptd-task-tree__modality-box"
        />

        {/* Scanning icon: 2x2 grid with top-left filled = current scan cell */}
        <g role="graphics-symbol" aria-label="Scanning modality">
          <rect x="300" y="590" width="40" height="40" fill="currentColor" />
          <rect x="345" y="590" width="40" height="40" fill="none" />
          <rect x="300" y="635" width="40" height="40" fill="none" />
          <rect x="345" y="635" width="40" height="40" fill="none" />
          <text x="343" y="720" textAnchor="middle" fontSize="26">
            scanning
          </text>
        </g>

        {/* Visual icon: stylised monitor with stand */}
        <g role="graphics-symbol" aria-label="Visual modality">
          <rect x="500" y="590" width="120" height="80" fill="none" />
          <line x1="560" y1="670" x2="560" y2="695" />
          <line x1="535" y1="695" x2="585" y2="695" />
          <text x="560" y="740" textAnchor="middle" fontSize="26">
            visual
          </text>
        </g>
      </g>

      {/* ===== POLYMORPH 2: MODAL DIALOGUE ===== */}
      <g
        role="graphics-object"
        aria-label="Second polymorph of Delete File: Modal Dialogue"
      >
        <rect
          x="1020"
          y="200"
          width="280"
          height="80"
          className="ptd-task-tree__node-box"
        />
        <text
          x="1160"
          y="240"
          textAnchor="middle"
          dominantBaseline="central"
        >
          Modal Dialogue
        </text>
      </g>

      {/* MD sub-tasks */}
      <g
        role="graphics-object"
        aria-label="Modal Dialogue sub-task: Select Delete, first in sequence"
      >
        <rect
          x="820"
          y="380"
          width="180"
          height="80"
          className="ptd-task-tree__node-box"
        />
        <text
          x="910"
          y="420"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="26"
        >
          Select Delete
        </text>
      </g>
      <g
        role="graphics-object"
        aria-label="Modal Dialogue sub-task: Select File, performed after Select Delete"
      >
        <rect
          x="1060"
          y="380"
          width="180"
          height="80"
          className="ptd-task-tree__node-box"
        />
        <text
          x="1150"
          y="420"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="26"
        >
          Select File
        </text>
      </g>
      <g
        role="graphics-object"
        aria-label="Modal Dialogue sub-task: Confirm Delete, performed after Select File"
      >
        <rect
          x="1300"
          y="380"
          width="180"
          height="80"
          className="ptd-task-tree__node-box"
        />
        <text
          x="1390"
          y="420"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="26"
        >
          Confirm Delete
        </text>
      </g>

      {/* MD "before" arrows */}
      <g aria-hidden="true" className="ptd-task-tree__edges">
        <line
          x1="1004"
          y1="420"
          x2="1056"
          y2="420"
          markerEnd={`url(#${arrowId})`}
        />
        <text x="1030" y="400" textAnchor="middle" fontSize="22">
          before
        </text>
        <line
          x1="1244"
          y1="420"
          x2="1296"
          y2="420"
          markerEnd={`url(#${arrowId})`}
        />
        <text x="1270" y="400" textAnchor="middle" fontSize="22">
          before
        </text>
      </g>

      {/* MD modality affordances */}
      <g
        role="graphics-object"
        aria-label="Modal Dialogue modality affordances: visual output and non-visual button input"
      >
        <rect
          x="900"
          y="540"
          width="520"
          height="280"
          className="ptd-task-tree__modality-box"
        />

        {/* Visual icon */}
        <g role="graphics-symbol" aria-label="Visual modality">
          <rect x="980" y="590" width="120" height="80" fill="none" />
          <line x1="1040" y1="670" x2="1040" y2="695" />
          <line x1="1015" y1="695" x2="1065" y2="695" />
          <text x="1040" y="740" textAnchor="middle" fontSize="26">
            visual
          </text>
        </g>

        {/* Non-visual button icon: rounded rect button with three tactile dots */}
        <g role="graphics-symbol" aria-label="Non-visual button modality">
          <rect
            x="1240"
            y="600"
            width="160"
            height="70"
            rx="22"
            fill="none"
          />
          <circle cx="1290" cy="635" r="6" fill="currentColor" />
          <circle cx="1320" cy="635" r="6" fill="currentColor" />
          <circle cx="1350" cy="635" r="6" fill="currentColor" />
          <text x="1320" y="720" textAnchor="middle" fontSize="26">
            non-visual button
          </text>
        </g>
      </g>
    </svg>
  );
}
