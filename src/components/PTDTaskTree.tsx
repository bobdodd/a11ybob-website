import { useId } from "react";

/* PTDTaskTree — inline SVG rendering of the canonical Polymorphic
 * Task Decomposition example: "Delete File" realised as two
 * polymorphs, each with its own task ordering and leaf-level
 * modality affordances.
 *
 * AT contract (WAI-ARIA Graphics module + always-on fallback):
 * - Root <svg role="img"> with aria-labelledby + aria-describedby
 *   pointing at <title> and <desc>. The always-supported summary
 *   every AT engine announces.
 * - Structural groups carry role="graphics-object" with aria-label;
 *   leaf modality icons carry role="graphics-symbol" with
 *   aria-label. Engines that understand the Graphics module
 *   (VoiceOver, recent NVDA) expose these for in-diagram
 *   navigation; engines that don't (older JAWS) silently ignore
 *   them and the title/desc still carries the diagram.
 * - Edges and "before" labels are aria-hidden; the temporal
 *   relationships they encode are spelled out inside each
 *   sub-task's aria-label.
 *
 * Layout coordinates (viewBox 0 0 2400 1350, 16:9):
 *
 *   Row 0 root           y=40-120
 *   Row 1 polymorphs     y=200-280
 *   Row 2 sub-tasks      y=380-460
 *   Row 3 modality boxes y=540-820
 *
 * Sub-task boxes are sized to comfortably accommodate their
 * labels at font-size 30 with at least ~80 units of horizontal
 * padding; the gap between adjacent sub-tasks is 120 units, wide
 * enough that the "before" label and arrow sit cleanly without
 * overrunning either box. The wider 2400-unit viewBox (vs the
 * original 1600) provides the horizontal real-estate needed for
 * Modal Dialogue's three sub-tasks to breathe.
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
      viewBox="0 0 2400 1350"
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
        <line x1="1200" y1="120" x2="585" y2="200" />
        <line x1="1200" y1="120" x2="1805" y2="200" />
        {/* Direct Manipulation to its sub-tasks */}
        <line x1="585" y1="280" x2="375" y2="380" />
        <line x1="585" y1="280" x2="780" y2="380" />
        {/* Modal Dialogue to its sub-tasks */}
        <line x1="1805" y1="280" x2="1390" y2="380" />
        <line x1="1805" y1="280" x2="1795" y2="380" />
        <line x1="1805" y1="280" x2="2210" y2="380" />
      </g>

      {/* ===== ROOT ===== */}
      <g role="graphics-object" aria-label="Root task: Delete File">
        <rect
          x="1070"
          y="40"
          width="260"
          height="80"
          className="ptd-task-tree__node-box"
        />
        <text
          x="1200"
          y="80"
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
          x="385"
          y="200"
          width="400"
          height="80"
          className="ptd-task-tree__node-box"
        />
        <text
          x="585"
          y="240"
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
          x="240"
          y="380"
          width="270"
          height="80"
          className="ptd-task-tree__node-box"
        />
        <text
          x="375"
          y="420"
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
          x="630"
          y="380"
          width="300"
          height="80"
          className="ptd-task-tree__node-box"
        />
        <text
          x="780"
          y="420"
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
          x1="510"
          y1="420"
          x2="630"
          y2="420"
          markerEnd={`url(#${arrowId})`}
        />
        <text
          x="570"
          y="396"
          textAnchor="middle"
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
          x="365"
          y="540"
          width="440"
          height="280"
          className="ptd-task-tree__modality-box"
        />

        {/* Scanning icon: 2x2 grid with top-left filled = current scan cell */}
        <g role="graphics-symbol" aria-label="Scanning modality">
          <rect x="445" y="585" width="40" height="40" fill="currentColor" />
          <rect x="490" y="585" width="40" height="40" fill="none" />
          <rect x="445" y="630" width="40" height="40" fill="none" />
          <rect x="490" y="630" width="40" height="40" fill="none" />
          <text
            x="488"
            y="720"
            textAnchor="middle"
            className="ptd-task-tree__modality-label"
          >
            scanning
          </text>
        </g>

        {/* Visual icon: stylised monitor with stand */}
        <g role="graphics-symbol" aria-label="Visual modality">
          <rect x="625" y="585" width="120" height="80" fill="none" />
          <line x1="685" y1="665" x2="685" y2="690" />
          <line x1="660" y1="690" x2="710" y2="690" />
          <text
            x="685"
            y="730"
            textAnchor="middle"
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
          x="1645"
          y="200"
          width="320"
          height="80"
          className="ptd-task-tree__node-box"
        />
        <text
          x="1805"
          y="240"
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
          x="1240"
          y="380"
          width="300"
          height="80"
          className="ptd-task-tree__node-box"
        />
        <text
          x="1390"
          y="420"
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
          x="1660"
          y="380"
          width="270"
          height="80"
          className="ptd-task-tree__node-box"
        />
        <text
          x="1795"
          y="420"
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
          x="2050"
          y="380"
          width="320"
          height="80"
          className="ptd-task-tree__node-box"
        />
        <text
          x="2210"
          y="420"
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
          x1="1540"
          y1="420"
          x2="1660"
          y2="420"
          markerEnd={`url(#${arrowId})`}
        />
        <text
          x="1600"
          y="396"
          textAnchor="middle"
          className="ptd-task-tree__edge-label"
        >
          before
        </text>
        <line
          x1="1930"
          y1="420"
          x2="2050"
          y2="420"
          markerEnd={`url(#${arrowId})`}
        />
        <text
          x="1990"
          y="396"
          textAnchor="middle"
          className="ptd-task-tree__edge-label"
        >
          before
        </text>
      </g>

      {/* MD modality affordances */}
      <g
        role="graphics-object"
        aria-label="Modal Dialogue modality affordances: visual output and non-visual button input"
      >
        <rect
          x="1565"
          y="540"
          width="480"
          height="280"
          className="ptd-task-tree__modality-box"
        />

        {/* Visual icon */}
        <g role="graphics-symbol" aria-label="Visual modality">
          <rect x="1645" y="585" width="120" height="80" fill="none" />
          <line x1="1705" y1="665" x2="1705" y2="690" />
          <line x1="1680" y1="690" x2="1730" y2="690" />
          <text
            x="1705"
            y="730"
            textAnchor="middle"
            className="ptd-task-tree__modality-label"
          >
            visual
          </text>
        </g>

        {/* Non-visual button icon */}
        <g role="graphics-symbol" aria-label="Non-visual button modality">
          <rect
            x="1820"
            y="595"
            width="170"
            height="70"
            rx="22"
            fill="none"
          />
          <circle cx="1855" cy="630" r="6" fill="currentColor" />
          <circle cx="1895" cy="630" r="6" fill="currentColor" />
          <circle cx="1935" cy="630" r="6" fill="currentColor" />
          <text
            x="1905"
            y="730"
            textAnchor="middle"
            className="ptd-task-tree__modality-label"
          >
            non-visual button
          </text>
        </g>
      </g>
    </svg>
  );
}
