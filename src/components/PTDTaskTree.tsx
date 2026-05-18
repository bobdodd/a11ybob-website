import { useId } from "react";

/* PTDTaskTree — inline SVG rendering of the canonical Polymorphic
 * Task Decomposition example: "Delete File" realised as two
 * polymorphs, each with its own task ordering and leaf-level
 * modality affordances.
 *
 * AT contract (current — see /colophon for the rationale and the
 * history of how we got here):
 * - Root <svg role="img"> with aria-labelledby + aria-describedby
 *   pointing at <title> and <desc>. AT engines treat the SVG as a
 *   single labelled image with a descriptive description. Every
 *   engine handles this correctly.
 * - The internal structural roles below (graphics-object on each
 *   <g>, graphics-symbol on each leaf modality icon, each with its
 *   own aria-label) are PRESERVED in the markup as a working
 *   example of the WAI-ARIA Graphics module pattern, but are
 *   currently overridden by role="img" on the root. Real-world AT
 *   support for the Graphics module is too uneven — TalkBack on
 *   Android walks SVG elements individually regardless of roles,
 *   JAWS largely doesn't implement the module, NVDA support varies
 *   by browser. When that catches up, the role="img" override can
 *   come off in one line and the inner structure becomes
 *   navigable.
 * - Edges and "before" labels are aria-hidden; the temporal
 *   relationships they encode are spelled out inside each
 *   sub-task's aria-label.
 *
 * Layout (viewBox 0 0 2000 1125, 16:9):
 *
 *   Row 0 root           y=40-140   (h=100)
 *   Row 1 polymorphs     y=240-340  (h=100)
 *   Row 2 sub-tasks      y=440-540  (h=100)
 *   Row 3 modality boxes y=620-1080 (h=460)
 *
 * The viewBox is sized so the bounding box of all content fills
 * roughly 90% of the frame at 16:9; rendered text resolves to body-
 * text size on a typical desktop column, rather than the half-size
 * the earlier 2400x1350 viewBox produced.
 *
 * Stroke widths are deliberately heavy (node boxes 4 units, edges
 * 3 units) so lines read as deliberate rules rather than the
 * hairlines that 2-unit strokes produced at the rendered scale.
 *
 * Styling: strokes and text use currentColor; the wrapping CSS
 * pins color to var(--ink) and overrides for forced-colors mode,
 * so the diagram inherits the page's zone tint and adapts to
 * Windows High Contrast automatically. */

export function PTDTaskTree() {
  const ids = useId();
  const titleId = `${ids}-title`;
  const descId = `${ids}-desc`;
  const arrowId = `${ids}-arrow`;

  return (
    <svg
      viewBox="0 0 2000 1125"
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
        Hierarchical task tree with root &ldquo;Delete File&rdquo;
        branching into two polymorphs. Direct Manipulation contains
        sub-tasks &ldquo;Select File&rdquo; before &ldquo;Select
        Delete,&rdquo; with leaf modality affordances for scanning
        and visual interaction. Modal Dialogue contains sub-tasks
        &ldquo;Select Delete&rdquo; before &ldquo;Select File&rdquo;
        before &ldquo;Confirm Delete,&rdquo; with leaf affordances
        for visual and non-visual listbox interaction.
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
        <line x1="937" y1="140" x2="430" y2="240" />
        <line x1="937" y1="140" x2="1443" y2="240" />
        {/* Direct Manipulation to its sub-tasks */}
        <line x1="430" y1="340" x2="250" y2="440" />
        <line x1="430" y1="340" x2="610" y2="440" />
        {/* Modal Dialogue to its sub-tasks */}
        <line x1="1443" y1="340" x2="1100" y2="440" />
        <line x1="1443" y1="340" x2="1440" y2="440" />
        <line x1="1443" y1="340" x2="1790" y2="440" />
      </g>

      {/* ===== ROOT ===== */}
      <g role="graphics-object" aria-label="Root task: Delete File">
        <rect
          x="807"
          y="40"
          width="260"
          height="100"
          className="ptd-task-tree__node-box"
        />
        <text
          x="937"
          y="90"
          textAnchor="middle"
          dominantBaseline="central"
          className="ptd-task-tree__root-text"
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
          x="230"
          y="240"
          width="400"
          height="100"
          className="ptd-task-tree__node-box"
        />
        <text
          x="430"
          y="290"
          textAnchor="middle"
          dominantBaseline="central"
          className="ptd-task-tree__polymorph-text"
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
          x="120"
          y="440"
          width="260"
          height="100"
          className="ptd-task-tree__node-box"
        />
        <text
          x="250"
          y="490"
          textAnchor="middle"
          dominantBaseline="central"
          className="ptd-task-tree__subtask-text"
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
          y="440"
          width="300"
          height="100"
          className="ptd-task-tree__node-box"
        />
        <text
          x="610"
          y="490"
          textAnchor="middle"
          dominantBaseline="central"
          className="ptd-task-tree__subtask-text"
        >
          Select Delete
        </text>
      </g>

      {/* DM "before" arrow + label */}
      <g aria-hidden="true" className="ptd-task-tree__edges">
        <line
          x1="380"
          y1="490"
          x2="460"
          y2="490"
          markerEnd={`url(#${arrowId})`}
        />
        <text
          x="420"
          y="420"
          textAnchor="middle"
          dominantBaseline="central"
          className="ptd-task-tree__edge-label"
        >
          before
        </text>
      </g>

      {/* DM modality affordances */}
      <g
        role="graphics-object"
        aria-label="Direct Manipulation modality affordances: scanning input and visual output"
      >
        <rect
          x="130"
          y="620"
          width="600"
          height="460"
          className="ptd-task-tree__modality-box"
        />

        {/* Scanning icon: 2x2 grid of 60x60 cells, top-left filled */}
        <g role="graphics-symbol" aria-label="Scanning modality">
          <rect x="230" y="760" width="60" height="60" fill="currentColor" />
          <rect x="290" y="760" width="60" height="60" fill="none" />
          <rect x="230" y="820" width="60" height="60" fill="none" />
          <rect x="290" y="820" width="60" height="60" fill="none" />
          <text
            x="290"
            y="970"
            textAnchor="middle"
            dominantBaseline="central"
            className="ptd-task-tree__modality-label"
          >
            scanning
          </text>
        </g>

        {/* Visual icon: stylised monitor with stand */}
        <g role="graphics-symbol" aria-label="Visual modality">
          <rect x="470" y="760" width="180" height="120" fill="none" />
          <line x1="560" y1="880" x2="560" y2="915" />
          <line x1="515" y1="915" x2="605" y2="915" />
          <text
            x="560"
            y="970"
            textAnchor="middle"
            dominantBaseline="central"
            className="ptd-task-tree__modality-label"
          >
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
          x="1293"
          y="240"
          width="300"
          height="100"
          className="ptd-task-tree__node-box"
        />
        <text
          x="1443"
          y="290"
          textAnchor="middle"
          dominantBaseline="central"
          className="ptd-task-tree__polymorph-text"
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
          x="960"
          y="440"
          width="280"
          height="100"
          className="ptd-task-tree__node-box"
        />
        <text
          x="1100"
          y="490"
          textAnchor="middle"
          dominantBaseline="central"
          className="ptd-task-tree__subtask-text"
        >
          Select Delete
        </text>
      </g>
      <g
        role="graphics-object"
        aria-label="Modal Dialogue sub-task: Select File, performed after Select Delete"
      >
        <rect
          x="1320"
          y="440"
          width="240"
          height="100"
          className="ptd-task-tree__node-box"
        />
        <text
          x="1440"
          y="490"
          textAnchor="middle"
          dominantBaseline="central"
          className="ptd-task-tree__subtask-text"
        >
          Select File
        </text>
      </g>
      <g
        role="graphics-object"
        aria-label="Modal Dialogue sub-task: Confirm Delete, performed after Select File"
      >
        <rect
          x="1640"
          y="440"
          width="300"
          height="100"
          className="ptd-task-tree__node-box"
        />
        <text
          x="1790"
          y="490"
          textAnchor="middle"
          dominantBaseline="central"
          className="ptd-task-tree__subtask-text"
        >
          Confirm Delete
        </text>
      </g>

      {/* MD "before" arrows + labels */}
      <g aria-hidden="true" className="ptd-task-tree__edges">
        <line
          x1="1240"
          y1="490"
          x2="1320"
          y2="490"
          markerEnd={`url(#${arrowId})`}
        />
        <text
          x="1280"
          y="420"
          textAnchor="middle"
          dominantBaseline="central"
          className="ptd-task-tree__edge-label"
        >
          before
        </text>
        <line
          x1="1560"
          y1="490"
          x2="1640"
          y2="490"
          markerEnd={`url(#${arrowId})`}
        />
        <text
          x="1600"
          y="420"
          textAnchor="middle"
          dominantBaseline="central"
          className="ptd-task-tree__edge-label"
        >
          before
        </text>
      </g>

      {/* MD modality affordances */}
      <g
        role="graphics-object"
        aria-label="Modal Dialogue modality affordances: visual output and non-visual listbox input"
      >
        <rect
          x="1140"
          y="620"
          width="620"
          height="460"
          className="ptd-task-tree__modality-box"
        />

        {/* Visual icon */}
        <g role="graphics-symbol" aria-label="Visual modality">
          <rect x="1210" y="760" width="180" height="120" fill="none" />
          <line x1="1300" y1="880" x2="1300" y2="915" />
          <line x1="1255" y1="915" x2="1345" y2="915" />
          <text
            x="1300"
            y="970"
            textAnchor="middle"
            dominantBaseline="central"
            className="ptd-task-tree__modality-label"
          >
            visual
          </text>
        </g>

        {/* Non-visual listbox icon: container with three stacked
         * items; the middle one is filled to indicate the currently-
         * selected option. */}
        <g role="graphics-symbol" aria-label="Non-visual listbox modality">
          <rect x="1530" y="760" width="180" height="130" fill="none" />
          <line x1="1555" y1="790" x2="1685" y2="790" />
          <rect
            x="1550"
            y="810"
            width="140"
            height="30"
            fill="currentColor"
          />
          <line x1="1555" y1="860" x2="1685" y2="860" />
          <text
            x="1620"
            y="970"
            textAnchor="middle"
            dominantBaseline="central"
            className="ptd-task-tree__modality-label"
          >
            non-visual listbox
          </text>
        </g>
      </g>
    </svg>
  );
}
