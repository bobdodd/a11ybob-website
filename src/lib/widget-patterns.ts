/* WAI-ARIA widget pattern catalogue — twenty-one patterns from the
 * WAI-ARIA Authoring Practices Guide (APG) that Paradise's
 * WidgetPatternAnalyzer validates. The /paradise/widget-patterns
 * catalogue and the [slug] dynamic route both read from here. */

export type PatternCategory =
  | "navigation"
  | "input"
  | "disclosure"
  | "status";

export type WidgetPattern = {
  slug: string;
  /** Pattern name as it appears in the WAI-ARIA APG. */
  name: string;
  category: PatternCategory;
  /** One-line summary used on the catalogue. */
  summary: string;
  /** Slightly longer treatment on the pattern's own page. */
  description: string;
  /** Expected role(s). */
  roles: string[];
  /** Expected ARIA states and properties (with brief notes). */
  statesAndProps: { name: string; note: string }[];
  /** Expected keyboard interactions (with brief notes). */
  keyboard: { keys: string; behaviour: string }[];
  /** WCAG criteria the pattern engages. */
  wcag: { criterion: string; title: string }[];
  /** Canonical link in the WAI-ARIA APG. */
  apg: string;
};

export const CATEGORY_LABEL: Record<PatternCategory, string> = {
  navigation: "Navigation widgets",
  input: "Input widgets",
  disclosure: "Disclosure widgets",
  status: "Status widgets",
};

const APG = "https://www.w3.org/WAI/ARIA/apg/patterns";

export const WIDGET_PATTERNS: WidgetPattern[] = [
  /* ───── Navigation ─────────────────────────────────────────────── */
  {
    slug: "tabs",
    name: "Tabs",
    category: "navigation",
    summary: "A set of tabs each revealing one of a series of panels.",
    description:
      "A tabs widget groups several panels of content under a row of tabs; activating a tab reveals its panel and hides the others. The active tab carries the user's location; the tab list and the tab panels are linked by aria-controls and aria-labelledby.",
    roles: ["tablist", "tab", "tabpanel"],
    statesAndProps: [
      { name: "aria-selected", note: "On each tab; true on the active one." },
      { name: "aria-controls", note: "On each tab, pointing at its panel." },
      { name: "aria-labelledby", note: "On each panel, pointing at its tab." },
      { name: "tabindex", note: "Active tab is 0; others are -1 (roving tabindex)." },
    ],
    keyboard: [
      { keys: "Left / Right arrow", behaviour: "Move focus between tabs in a horizontal tablist." },
      { keys: "Up / Down arrow", behaviour: "Move focus between tabs in a vertical tablist." },
      { keys: "Home / End", behaviour: "Move focus to first / last tab." },
      { keys: "Enter or Space", behaviour: "Activate the focused tab." },
    ],
    wcag: [
      { criterion: "2.1.1", title: "Keyboard" },
      { criterion: "4.1.2", title: "Name, Role, Value" },
    ],
    apg: `${APG}/tabs/`,
  },
  {
    slug: "menu",
    name: "Menu",
    category: "navigation",
    summary: "A list of choices, often hierarchical, presented for selection.",
    description:
      "A menu offers a list of actions or links. Menus may be nested (submenus) and support roving-tabindex keyboard navigation. The menu's container is a region the user enters from a trigger button, then exits with Escape.",
    roles: ["menu", "menubar", "menuitem", "menuitemcheckbox", "menuitemradio"],
    statesAndProps: [
      { name: "aria-haspopup", note: "On the trigger button; identifies the popup type." },
      { name: "aria-expanded", note: "On the trigger; reflects whether the menu is open." },
      { name: "aria-checked", note: "On menuitemcheckbox / menuitemradio." },
    ],
    keyboard: [
      { keys: "Up / Down arrow", behaviour: "Move between items." },
      { keys: "Right / Left arrow", behaviour: "Open submenu / return to parent." },
      { keys: "Escape", behaviour: "Close the menu, return focus to trigger." },
      { keys: "Enter or Space", behaviour: "Activate item." },
    ],
    wcag: [
      { criterion: "2.1.1", title: "Keyboard" },
      { criterion: "2.1.2", title: "No Keyboard Trap" },
    ],
    apg: `${APG}/menubar/`,
  },
  {
    slug: "tree",
    name: "Tree",
    category: "navigation",
    summary: "Hierarchical list of items the user can expand and collapse.",
    description:
      "A treeview presents nested items, each of which may be expandable. Folders open and close; leaves are activatable. Common in file browsers and outline views.",
    roles: ["tree", "treeitem", "group"],
    statesAndProps: [
      { name: "aria-expanded", note: "On expandable treeitem; true / false." },
      { name: "aria-selected", note: "On the active treeitem." },
      { name: "aria-level", note: "Required if level can't be inferred from DOM nesting." },
    ],
    keyboard: [
      { keys: "Up / Down arrow", behaviour: "Move between visible items." },
      { keys: "Right arrow", behaviour: "Expand collapsed node, or move to first child." },
      { keys: "Left arrow", behaviour: "Collapse expanded node, or move to parent." },
      { keys: "Enter", behaviour: "Activate the focused item." },
    ],
    wcag: [
      { criterion: "2.1.1", title: "Keyboard" },
      { criterion: "1.3.1", title: "Info and Relationships" },
    ],
    apg: `${APG}/treeview/`,
  },
  {
    slug: "breadcrumb",
    name: "Breadcrumb",
    category: "navigation",
    summary: "A trail of links showing the user's location in a hierarchy.",
    description:
      "A breadcrumb is a horizontal list of links representing the user's path from the site root to the current page. The current page is named but not a link; previous pages are links.",
    roles: ["navigation"],
    statesAndProps: [
      { name: "aria-current", note: "Set to \"page\" on the link or text representing the current page." },
      { name: "aria-label", note: "On the nav landmark, e.g. \"Breadcrumb\"." },
    ],
    keyboard: [{ keys: "Tab", behaviour: "Move between breadcrumb links." }],
    wcag: [{ criterion: "2.4.8", title: "Location (AAA)" }],
    apg: `${APG}/breadcrumb/`,
  },
  {
    slug: "toolbar",
    name: "Toolbar",
    category: "navigation",
    summary: "A row of related actions or controls.",
    description:
      "A toolbar groups commands or controls that operate on the page or a region of it. Roving tabindex moves focus between toolbar items so the toolbar takes a single Tab stop.",
    roles: ["toolbar"],
    statesAndProps: [
      { name: "aria-label", note: "Required if there's no visible label." },
      { name: "aria-orientation", note: "horizontal (default) or vertical." },
    ],
    keyboard: [
      { keys: "Left / Right arrow", behaviour: "Move between toolbar items." },
      { keys: "Home / End", behaviour: "First / last item." },
    ],
    wcag: [{ criterion: "2.1.1", title: "Keyboard" }],
    apg: `${APG}/toolbar/`,
  },
  {
    slug: "grid",
    name: "Grid",
    category: "navigation",
    summary: "Tabular structure with two-dimensional keyboard navigation.",
    description:
      "A grid is a tabular widget where users can navigate with arrow keys in both row and column directions. Spreadsheet-like.",
    roles: ["grid", "row", "gridcell", "rowheader", "columnheader"],
    statesAndProps: [
      { name: "aria-rowcount / aria-colcount", note: "Total dimensions if larger than DOM." },
      { name: "aria-rowindex / aria-colindex", note: "Cell position within the conceptual grid." },
      { name: "aria-selected", note: "On selected cells if the grid supports selection." },
    ],
    keyboard: [
      { keys: "Arrow keys", behaviour: "Move focus by one cell." },
      { keys: "Home / End", behaviour: "First / last cell in row." },
      { keys: "Ctrl+Home / Ctrl+End", behaviour: "First / last cell in grid." },
    ],
    wcag: [
      { criterion: "2.1.1", title: "Keyboard" },
      { criterion: "1.3.1", title: "Info and Relationships" },
    ],
    apg: `${APG}/grid/`,
  },
  {
    slug: "feed",
    name: "Feed",
    category: "navigation",
    summary: "Scrollable region of content articles loaded as the user moves through.",
    description:
      "A feed is a list of dynamically-loaded articles (e.g., social-media-style streams). Each article is a focusable region; the feed loads more content as the user scrolls down.",
    roles: ["feed", "article"],
    statesAndProps: [
      { name: "aria-busy", note: "Set on the feed during loading." },
      { name: "aria-posinset / aria-setsize", note: "Required on each article." },
      { name: "aria-labelledby", note: "On each article, pointing at its title." },
    ],
    keyboard: [
      { keys: "Page Down / Page Up", behaviour: "Move between articles." },
      { keys: "Control + End", behaviour: "Jump to last loaded article." },
      { keys: "Control + Home", behaviour: "Jump to first article." },
    ],
    wcag: [{ criterion: "1.3.1", title: "Info and Relationships" }],
    apg: `${APG}/feed/`,
  },

  /* ───── Input ──────────────────────────────────────────────────── */
  {
    slug: "combobox",
    name: "Combobox",
    category: "input",
    summary: "Text input with an associated popup of suggestions.",
    description:
      "A combobox combines a single-line text input with a popup of options the user can browse and select. Variants include autocomplete (filter as you type) and dropdown-only (no free input).",
    roles: ["combobox", "listbox", "option"],
    statesAndProps: [
      { name: "aria-expanded", note: "On the combobox input; reflects popup state." },
      { name: "aria-controls", note: "On the input, pointing at the popup." },
      { name: "aria-activedescendant", note: "On the input, pointing at the active option." },
      { name: "aria-autocomplete", note: "list, inline, both, or none." },
    ],
    keyboard: [
      { keys: "Down arrow", behaviour: "Open the popup; move to next option." },
      { keys: "Up arrow", behaviour: "Move to previous option." },
      { keys: "Enter", behaviour: "Select the active option." },
      { keys: "Escape", behaviour: "Close the popup; restore input." },
    ],
    wcag: [
      { criterion: "2.1.1", title: "Keyboard" },
      { criterion: "4.1.2", title: "Name, Role, Value" },
    ],
    apg: `${APG}/combobox/`,
  },
  {
    slug: "listbox",
    name: "Listbox",
    category: "input",
    summary: "List of selectable options, single- or multi-select.",
    description:
      "A listbox presents a fixed set of options the user picks from. Single-select listboxes always have one option selected; multi-select listboxes allow zero or more.",
    roles: ["listbox", "option"],
    statesAndProps: [
      { name: "aria-multiselectable", note: "true if multiple options can be selected." },
      { name: "aria-selected", note: "On each option; true / false." },
      { name: "aria-activedescendant", note: "On listbox; the focused option's id." },
    ],
    keyboard: [
      { keys: "Up / Down arrow", behaviour: "Move focus." },
      { keys: "Home / End", behaviour: "First / last option." },
      { keys: "Space", behaviour: "Toggle selection (multi-select)." },
    ],
    wcag: [
      { criterion: "2.1.1", title: "Keyboard" },
      { criterion: "4.1.2", title: "Name, Role, Value" },
    ],
    apg: `${APG}/listbox/`,
  },
  {
    slug: "radiogroup",
    name: "Radio group",
    category: "input",
    summary: "Set of mutually-exclusive choices.",
    description:
      "A radio group presents two or more options of which exactly one is selected. The group itself takes a single Tab stop; arrow keys move between options.",
    roles: ["radiogroup", "radio"],
    statesAndProps: [
      { name: "aria-checked", note: "On each radio; true on the selected one." },
      { name: "aria-labelledby", note: "On the radiogroup, pointing at its label." },
    ],
    keyboard: [
      { keys: "Up / Down or Left / Right arrow", behaviour: "Move focus and selection." },
      { keys: "Space", behaviour: "Select focused radio (if not auto-selected)." },
    ],
    wcag: [{ criterion: "2.1.1", title: "Keyboard" }],
    apg: `${APG}/radio/`,
  },
  {
    slug: "slider",
    name: "Slider",
    category: "input",
    summary: "Continuous-value control between minimum and maximum.",
    description:
      "A slider lets the user pick a value from a continuous range. Volume controls, brightness, price-range filters.",
    roles: ["slider"],
    statesAndProps: [
      { name: "aria-valuenow", note: "Current value." },
      { name: "aria-valuemin / aria-valuemax", note: "Range bounds." },
      { name: "aria-valuetext", note: "Human-readable text for the value (optional)." },
      { name: "aria-orientation", note: "horizontal (default) or vertical." },
    ],
    keyboard: [
      { keys: "Right / Up arrow", behaviour: "Increment by step." },
      { keys: "Left / Down arrow", behaviour: "Decrement by step." },
      { keys: "Page Up / Page Down", behaviour: "Increment / decrement by larger step." },
      { keys: "Home / End", behaviour: "Min / max value." },
    ],
    wcag: [
      { criterion: "2.1.1", title: "Keyboard" },
      { criterion: "4.1.2", title: "Name, Role, Value" },
    ],
    apg: `${APG}/slider/`,
  },
  {
    slug: "spinbutton",
    name: "Spinbutton",
    category: "input",
    summary: "Numeric value with up/down increment controls.",
    description:
      "A spinbutton holds a numeric value the user can adjust with arrow keys or visible increment / decrement buttons. Typical for quantities, time pickers.",
    roles: ["spinbutton"],
    statesAndProps: [
      { name: "aria-valuenow", note: "Current value." },
      { name: "aria-valuemin / aria-valuemax", note: "Bounds." },
    ],
    keyboard: [
      { keys: "Up / Down arrow", behaviour: "Increment / decrement." },
      { keys: "Page Up / Page Down", behaviour: "Larger step." },
    ],
    wcag: [{ criterion: "2.1.1", title: "Keyboard" }],
    apg: `${APG}/spinbutton/`,
  },
  {
    slug: "switch",
    name: "Switch",
    category: "input",
    summary: "On/off toggle, semantically distinct from a checkbox.",
    description:
      "A switch is a binary toggle with explicit on / off semantics, distinct from a checkbox (which represents selection). Common in settings panels.",
    roles: ["switch"],
    statesAndProps: [
      { name: "aria-checked", note: "true (on) / false (off)." },
    ],
    keyboard: [
      { keys: "Space", behaviour: "Toggle state." },
      { keys: "Enter", behaviour: "Toggle state (often)." },
    ],
    wcag: [
      { criterion: "2.1.1", title: "Keyboard" },
      { criterion: "4.1.2", title: "Name, Role, Value" },
    ],
    apg: `${APG}/switch/`,
  },

  /* ───── Disclosure ─────────────────────────────────────────────── */
  {
    slug: "dialog",
    name: "Dialog (modal)",
    category: "disclosure",
    summary: "Window that interrupts the page until dismissed.",
    description:
      "A modal dialog blocks interaction with the rest of the page until it's closed. Focus moves into the dialog when it opens; focus is trapped inside; Escape closes; focus returns to the triggering element.",
    roles: ["dialog", "alertdialog"],
    statesAndProps: [
      { name: "aria-modal", note: "true." },
      { name: "aria-labelledby", note: "Pointing at the dialog's title." },
      { name: "aria-describedby", note: "Pointing at descriptive text (optional)." },
    ],
    keyboard: [
      { keys: "Escape", behaviour: "Close the dialog." },
      { keys: "Tab / Shift+Tab", behaviour: "Cycle focus inside the dialog (trapped)." },
    ],
    wcag: [
      { criterion: "2.1.2", title: "No Keyboard Trap" },
      { criterion: "2.4.3", title: "Focus Order" },
    ],
    apg: `${APG}/dialog-modal/`,
  },
  {
    slug: "accordion",
    name: "Accordion",
    category: "disclosure",
    summary: "Set of collapsible panels with headers.",
    description:
      "An accordion is a vertical list of expandable sections. Each header toggles its associated panel between expanded and collapsed states. Multiple panels may be open simultaneously, or the accordion may enforce one-at-a-time.",
    roles: ["heading", "button", "region"],
    statesAndProps: [
      { name: "aria-expanded", note: "On each section's button." },
      { name: "aria-controls", note: "On each button, pointing at its panel." },
      { name: "aria-labelledby", note: "On each panel, pointing at its button." },
    ],
    keyboard: [
      { keys: "Enter or Space", behaviour: "Toggle the focused section." },
      { keys: "Up / Down arrow", behaviour: "Move between section headers (if implemented)." },
    ],
    wcag: [{ criterion: "2.1.1", title: "Keyboard" }],
    apg: `${APG}/accordion/`,
  },
  {
    slug: "disclosure",
    name: "Disclosure",
    category: "disclosure",
    summary: "Single button that shows or hides associated content.",
    description:
      "A disclosure widget is the simplest case of progressive disclosure: a button that toggles whether its associated content is visible. Native HTML <details>/<summary> implements the pattern.",
    roles: ["button"],
    statesAndProps: [
      { name: "aria-expanded", note: "On the button." },
      { name: "aria-controls", note: "On the button, pointing at the disclosed region." },
    ],
    keyboard: [
      { keys: "Enter or Space", behaviour: "Toggle disclosure." },
    ],
    wcag: [{ criterion: "2.1.1", title: "Keyboard" }],
    apg: `${APG}/disclosure/`,
  },
  {
    slug: "tooltip",
    name: "Tooltip",
    category: "disclosure",
    summary: "Brief informational popup triggered by focus or hover.",
    description:
      "A tooltip provides supplementary information about a control, displayed on focus or hover. Tooltips are non-interactive and do not take focus themselves.",
    roles: ["tooltip"],
    statesAndProps: [
      { name: "aria-describedby", note: "On the trigger, pointing at the tooltip." },
    ],
    keyboard: [
      { keys: "Focus on trigger", behaviour: "Show tooltip." },
      { keys: "Escape", behaviour: "Hide tooltip without moving focus." },
    ],
    wcag: [
      { criterion: "1.4.13", title: "Content on Hover or Focus" },
    ],
    apg: `${APG}/tooltip/`,
  },

  /* ───── Status ─────────────────────────────────────────────────── */
  {
    slug: "progressbar",
    name: "Progressbar",
    category: "status",
    summary: "Visual indicator of operation progress.",
    description:
      "A progressbar shows progress towards a goal — a file upload, a long-running computation, a multi-step process. Indeterminate progressbars (no known total) use only role; determinate ones include current and bound values.",
    roles: ["progressbar"],
    statesAndProps: [
      { name: "aria-valuenow", note: "Current progress." },
      { name: "aria-valuemin / aria-valuemax", note: "Bounds (typically 0 / 100 for percent)." },
      { name: "aria-valuetext", note: "Human-readable text (optional)." },
    ],
    keyboard: [],
    wcag: [
      { criterion: "4.1.3", title: "Status Messages" },
    ],
    apg: `${APG}/meter/`,
  },
  {
    slug: "meter",
    name: "Meter",
    category: "status",
    summary: "Scalar measurement within a known range.",
    description:
      "A meter shows a value within a known range — disk usage, temperature, score. Distinct from progressbar: a meter doesn't change toward completion, it just is.",
    roles: ["meter"],
    statesAndProps: [
      { name: "aria-valuenow", note: "Current value." },
      { name: "aria-valuemin / aria-valuemax", note: "Range bounds." },
      { name: "aria-valuetext", note: "Human-readable text (optional)." },
    ],
    keyboard: [],
    wcag: [{ criterion: "4.1.2", title: "Name, Role, Value" }],
    apg: `${APG}/meter/`,
  },
  {
    slug: "carousel",
    name: "Carousel",
    category: "status",
    summary: "Slideshow of items the user can advance through.",
    description:
      "A carousel rotates through a sequence of items — typically images or feature cards — with controls to advance, reverse, and pause. Auto-rotating carousels have particular accessibility constraints.",
    roles: ["region", "group"],
    statesAndProps: [
      { name: "aria-roledescription", note: "Set to \"carousel\" so screen readers announce it correctly." },
      { name: "aria-label", note: "Naming the carousel." },
      { name: "aria-live", note: "On the slide region; off when auto-rotating, polite when paused." },
    ],
    keyboard: [
      { keys: "Tab", behaviour: "Move into the carousel controls." },
      { keys: "Enter / Space on next/previous", behaviour: "Advance / reverse." },
    ],
    wcag: [
      { criterion: "2.2.2", title: "Pause, Stop, Hide" },
      { criterion: "2.1.1", title: "Keyboard" },
    ],
    apg: `${APG}/carousel/`,
  },
  {
    slug: "link",
    name: "Link (custom)",
    category: "status",
    summary: "Custom-built link that mimics native <a> behaviour.",
    description:
      "When the native <a href> can't be used (e.g., a div that needs to behave as a link), the link role gives custom-built navigation elements a screen-reader-recognised affordance. Real <a> is preferred where possible.",
    roles: ["link"],
    statesAndProps: [
      { name: "tabindex", note: "0 to make it focusable." },
    ],
    keyboard: [
      { keys: "Enter", behaviour: "Activate." },
    ],
    wcag: [
      { criterion: "2.1.1", title: "Keyboard" },
      { criterion: "4.1.2", title: "Name, Role, Value" },
    ],
    apg: `${APG}/link/`,
  },
];

export function findPattern(slug: string): WidgetPattern | undefined {
  return WIDGET_PATTERNS.find((p) => p.slug === slug);
}

export function patternsByCategory(): {
  category: PatternCategory;
  patterns: WidgetPattern[];
}[] {
  const cats: PatternCategory[] = [
    "navigation",
    "input",
    "disclosure",
    "status",
  ];
  return cats.map((category) => ({
    category,
    patterns: WIDGET_PATTERNS.filter((p) => p.category === category),
  }));
}
