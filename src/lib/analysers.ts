/* Analyser catalogue — one entry per Paradise analyser. Edited as
 * each analyser is reviewed in the documentation pass. The
 * /paradise/analysers catalogue page and the
 * /paradise/analysers/[slug] dynamic route both read from here. */

export type AnalyserFamily =
  | "multi-model"
  | "framework-specific"
  | "javascript"
  | "structural-html";

export type Analyser = {
  slug: string;
  name: string;
  family: AnalyserFamily;
  /** One-line summary used on the catalogue page. */
  summary: string;
  /** Slightly longer treatment on the analyser's own page. */
  description: string;
  /** WCAG criteria the analyser maps to, with short titles. */
  wcag: { criterion: string; title: string }[];
  /** Short broken-code example (under 12 lines) and what Paradise reports. */
  example?: { code: string; language: "html" | "javascript" | "css"; report: string };
  /** Path inside the Paradise repo. */
  sourcePath: string;
};

export const FAMILY_LABEL: Record<AnalyserFamily, string> = {
  "multi-model": "Multi-model analysers",
  "framework-specific": "Framework-specific analysers",
  javascript: "JavaScript analysers",
  "structural-html": "Structural HTML analysers",
};

const REPO = "https://github.com/bobdodd/paradise/blob/main";

export function sourceUrl(a: Analyser): string {
  return `${REPO}/${a.sourcePath}`;
}

export const ANALYSERS: Analyser[] = [
  {
    slug: "mouse-only-click",
    name: "MouseOnlyClickAnalyzer",
    family: "multi-model",
    summary:
      "Reports click handlers without a keyboard equivalent. Cross-file aware.",
    description:
      "Many false positives on `<div onclick>` come from single-file linters that can't see the keyboard handler in another file. This analyser walks the integrated DocumentModel and reports a click handler only when no equivalent keyboard handler is registered against the same selector across any source file.",
    wcag: [
      { criterion: "2.1.1", title: "Keyboard" },
      { criterion: "4.1.2", title: "Name, Role, Value" },
    ],
    example: {
      language: "html",
      code: `<!-- index.html -->
<div onclick="save()">Save</div>

<!-- handlers.js (separate file) -->
// no keydown handler — this is a real failure`,
      report:
        "Element `<div>` has a click handler but no keyboard equivalent. Add `keydown` for Enter/Space, or use `<button>`.",
    },
    sourcePath: "analyzers/MouseOnlyClickAnalyzer.ts",
  },
  {
    slug: "orphaned-event-handler",
    name: "OrphanedEventHandlerAnalyzer",
    family: "multi-model",
    summary:
      "Detects handlers attached to selectors that don't resolve to any element.",
    description:
      "An `addEventListener` against `#submit` is silently dead code when no element with that id exists in the source HTML. This analyser cross-references every handler registration in the ActionLanguage tree against the DOMModel and reports unresolved selectors.",
    wcag: [{ criterion: "4.1.1", title: "Parsing (deprecated; legacy)" }],
    example: {
      language: "javascript",
      code: `// handlers.js
document
  .querySelector("#submitt") // typo — element is "submit"
  .addEventListener("click", save);`,
      report:
        "Handler registered against selector `#submitt`, but no matching element exists in the source HTML.",
    },
    sourcePath: "analyzers/OrphanedEventHandlerAnalyzer.ts",
  },
  {
    slug: "missing-aria-connection",
    name: "MissingAriaConnectionAnalyzer",
    family: "multi-model",
    summary:
      "Validates aria-labelledby, aria-describedby, and aria-controls targets exist.",
    description:
      "An `aria-labelledby=\"foo\"` is harmful if no element with `id=\"foo\"` exists — the assistive technology gets nothing where it expected a name. Cross-references ARIA reference attributes against actual element ids in the DOMModel.",
    wcag: [
      { criterion: "1.3.1", title: "Info and Relationships" },
      { criterion: "4.1.2", title: "Name, Role, Value" },
    ],
    example: {
      language: "html",
      code: `<input aria-labelledby="lbl-name" />
<!-- no element with id="lbl-name" anywhere on the page -->`,
      report:
        "Element references `aria-labelledby=\"lbl-name\"` but no element with that id exists.",
    },
    sourcePath: "analyzers/MissingAriaConnectionAnalyzer.ts",
  },
  {
    slug: "visibility-focus-conflict",
    name: "VisibilityFocusConflictAnalyzer",
    family: "multi-model",
    summary:
      "Catches focusable elements hidden by CSS — keyboard reaches them, sight does not.",
    description:
      "An element with `tabindex` or a focusable role is reachable by keyboard. If CSS hides it (`display: none`, `visibility: hidden`, zero size, off-screen clip), the keyboard user lands on something they can't see. This analyser cross-references the DOMModel's focusable elements against the CSSModel's computed visibility.",
    wcag: [
      { criterion: "2.4.7", title: "Focus Visible" },
      { criterion: "2.4.11", title: "Focus Not Obscured" },
    ],
    example: {
      language: "css",
      code: `.save:focus { display: none; }
/* The element disappears the moment it receives focus. */`,
      report:
        "Element `.save` becomes focusable then immediately hides on focus — keyboard users land on a vanished element.",
    },
    sourcePath: "analyzers/VisibilityFocusConflictAnalyzer.ts",
  },
  {
    slug: "focus-order-conflict",
    name: "FocusOrderConflictAnalyzer",
    family: "multi-model",
    summary:
      "Detects chaotic tabindex patterns across the page (positive values, gaps).",
    description:
      "Positive `tabindex` values override DOM-order focus and are notoriously fragile across page changes. This analyser examines the global tabindex picture across the DocumentModel and reports patterns that confuse keyboard users — positive values mixed with zero, gaps in the sequence, focus traps that aren't intentional.",
    wcag: [{ criterion: "2.4.3", title: "Focus Order" }],
    sourcePath: "analyzers/FocusOrderConflictAnalyzer.ts",
  },
  {
    slug: "keyboard-navigation",
    name: "KeyboardNavigationAnalyzer",
    family: "multi-model",
    summary:
      "Validates that custom widgets implement the keyboard patterns their roles imply.",
    description:
      "An element with `role=\"tablist\"` is expected to support left/right arrow navigation between tabs. This analyser checks each widget role in the DOMModel against the keyboard interactions actually wired up in the ActionLanguage tree, reporting where the expected interactions are missing.",
    wcag: [
      { criterion: "2.1.1", title: "Keyboard" },
      { criterion: "4.1.2", title: "Name, Role, Value" },
    ],
    sourcePath: "analyzers/KeyboardNavigationAnalyzer.ts",
  },
  {
    slug: "aria-semantic",
    name: "ARIASemanticAnalyzer",
    family: "multi-model",
    summary:
      "Validates ARIA role / state / property combinations against the WAI-ARIA spec.",
    description:
      "ARIA roles have constraints on which states and properties they can carry, which children are valid, and which parent contexts they require. This analyser reports invalid combinations — `role=\"option\"` outside a `role=\"listbox\"`, `aria-required` on an element whose role doesn't allow it, and so on.",
    wcag: [
      { criterion: "4.1.2", title: "Name, Role, Value" },
      { criterion: "1.3.1", title: "Info and Relationships" },
    ],
    sourcePath: "analyzers/ARIASemanticAnalyzer.ts",
  },
  {
    slug: "widget-pattern",
    name: "WidgetPatternAnalyzer",
    family: "multi-model",
    summary:
      "Validates all twenty-one WAI-ARIA widget patterns end-to-end.",
    description:
      "WAI-ARIA Authoring Practices defines twenty-one canonical widget patterns — combobox, dialog, tree, grid, tabs, accordion, and so on. Each has expected role, state, property, and keyboard-interaction signatures. This analyser detects which pattern an element is attempting and reports incomplete or incorrect implementations.",
    wcag: [
      { criterion: "4.1.2", title: "Name, Role, Value" },
      { criterion: "2.1.1", title: "Keyboard" },
    ],
    sourcePath: "analyzers/WidgetPatternAnalyzer.ts",
  },
  {
    slug: "react-a11y",
    name: "ReactA11yAnalyzer",
    family: "framework-specific",
    summary:
      "React-specific patterns: hooks, portals, ref forwarding, event propagation.",
    description:
      "React's component lifecycle and reactive patterns introduce accessibility issues that don't appear in plain HTML/JS. Portals can move focus across the visible tree. `useState` toggles can hide focused elements between renders. This analyser understands React's idioms and applies the multi-model checks across them.",
    wcag: [
      { criterion: "4.1.2", title: "Name, Role, Value" },
      { criterion: "2.4.7", title: "Focus Visible" },
    ],
    sourcePath: "analyzers/ReactA11yAnalyzer.ts",
  },
  {
    slug: "svelte-reactivity",
    name: "SvelteReactivityAnalyzer",
    family: "framework-specific",
    summary:
      "Svelte directives: bind:, on:, class:, transition: applied to a11y patterns.",
    description:
      "Svelte's reactive directives bind state to the DOM in ways that affect accessibility. `class:hidden` toggles visibility; `bind:this` captures element references for focus management; `on:keydown` attaches handlers. This analyser parses Svelte components and applies the multi-model checks to the reactive bindings.",
    wcag: [
      { criterion: "1.3.1", title: "Info and Relationships" },
      { criterion: "2.1.1", title: "Keyboard" },
    ],
    sourcePath: "analyzers/SvelteReactivityAnalyzer.ts",
  },
  {
    slug: "vue-reactivity",
    name: "VueReactivityAnalyzer",
    family: "framework-specific",
    summary:
      "Vue patterns: v-model, v-on, v-if, v-show, scoped slots.",
    description:
      "Vue's template directives carry accessibility-relevant behaviours. `v-show` toggles visibility but keeps elements in the DOM; `v-if` removes them entirely. Each has different focus-management implications. This analyser parses Vue templates and reasons about the directive-driven runtime behaviour.",
    wcag: [
      { criterion: "1.3.1", title: "Info and Relationships" },
      { criterion: "4.1.2", title: "Name, Role, Value" },
    ],
    sourcePath: "analyzers/VueReactivityAnalyzer.ts",
  },
  {
    slug: "angular-reactivity",
    name: "AngularReactivityAnalyzer",
    family: "framework-specific",
    summary:
      "Angular patterns: [(ngModel)], structural directives, change detection.",
    description:
      "Angular's two-way binding, structural directives (`*ngIf`, `*ngFor`), and change-detection cycles all affect when accessibility-relevant DOM updates happen. This analyser parses Angular templates and reasons about the binding-driven runtime behaviour.",
    wcag: [
      { criterion: "1.3.1", title: "Info and Relationships" },
      { criterion: "4.1.2", title: "Name, Role, Value" },
    ],
    sourcePath: "analyzers/AngularReactivityAnalyzer.ts",
  },
  {
    slug: "focus-management",
    name: "FocusManagementAnalyzer",
    family: "javascript",
    summary:
      "Validates focus changes — moves to dialogs, restoration, traps.",
    description:
      "Focus is the single most fragile piece of state on a page. Opening a modal should move focus into it; closing should return focus to the trigger; keyboard navigation inside the modal should be trapped. This analyser walks the ActionLanguage tree, identifies focus-affecting actions, and reports patterns that drop or trap focus incorrectly.",
    wcag: [
      { criterion: "2.4.3", title: "Focus Order" },
      { criterion: "2.1.2", title: "No Keyboard Trap" },
    ],
    sourcePath: "analyzers/FocusManagementAnalyzer.ts",
  },
  {
    slug: "structural-html",
    name: "StructuralHTMLAnalyzer",
    family: "structural-html",
    summary:
      "Document structure: headings hierarchy, landmark coverage, list nesting.",
    description:
      "Structural rules that don't need behaviour or styling to evaluate. Headings should descend without skipping levels. The page should have a `<main>`. Lists should contain `<li>` and not arbitrary content. This analyser runs over the DOMModel and reports structural violations.",
    wcag: [
      { criterion: "1.3.1", title: "Info and Relationships" },
      { criterion: "2.4.6", title: "Headings and Labels" },
      { criterion: "2.4.1", title: "Bypass Blocks" },
    ],
    sourcePath: "analyzers/StructuralHTMLAnalyzer.ts",
  },
];

export function findAnalyser(slug: string): Analyser | undefined {
  return ANALYSERS.find((a) => a.slug === slug);
}

export function analysersByFamily(): { family: AnalyserFamily; analysers: Analyser[] }[] {
  const families: AnalyserFamily[] = [
    "multi-model",
    "framework-specific",
    "javascript",
    "structural-html",
  ];
  return families.map((family) => ({
    family,
    analysers: ANALYSERS.filter((a) => a.family === family),
  }));
}
