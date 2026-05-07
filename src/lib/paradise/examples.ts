/* Pre-defined Playground examples. Each example carries an HTML /
 * JavaScript / CSS triple and a short description. Picking one in
 * the Playground UI loads its three buffers into the editors and
 * re-runs the analysers. The set is curated to cover one analyser
 * per slot — adding a new example should ideally illustrate a
 * different kind of cross-file or single-file violation. */

export type SourceFile = { name: string; content: string };

export type LangBuffers = {
  html: SourceFile[];
  javascript: SourceFile[];
  css: SourceFile[];
};

export type Example = {
  slug: string;
  label: string;
  description: string;
  files: LangBuffers;
};

export const DEFAULT_EXAMPLE_SLUG = "cross-file-demo";

/* Helper to keep the example definitions tidy — single-file
 * languages declared once, multi-file lists declared explicitly. */
const file = (name: string, content: string): SourceFile => ({ name, content });

export const EXAMPLES: Example[] = [
  {
    slug: "cross-file-demo",
    label: "Cross-file demo",
    description:
      "Two bugs across three files. The cancel button has a click handler but no keyboard equivalent (mouse-only-click). The save button has a CSS rule that hides it on focus (visibility-focus-conflict). Each bug spans a file boundary that single-file linters can't reason across.",
    files: {
      html: [
        file(
          "index.html",
          `<!-- index.html -->
<h1>Save dialog</h1>

<!-- Native button: keyboard support is built in. -->
<button id="save">Save</button>

<!-- Custom: bare div used as a button. No role, no tabindex,
     no keyboard handler — interactive only with a mouse. -->
<div id="cancel">Cancel</div>`,
        ),
      ],
      javascript: [
        file(
          "handlers.js",
          `// handlers.js
// Both elements get click handlers — but only one is keyboard-
// reachable. The cross-file analyser should report the cancel div.

document.getElementById("save")
  .addEventListener("click", () => save());

document.getElementById("cancel")
  .addEventListener("click", () => cancel());`,
        ),
      ],
      css: [
        file(
          "styles.css",
          `/* styles.css */

/* Bug: the save button vanishes the moment it receives focus.
   Keyboard users can't see what they've tabbed onto. */
#save:focus {
  display: none;
}`,
        ),
      ],
    },
  },

  {
    slug: "orphan-handler",
    label: "Orphan handler",
    description:
      "The HTML defines an element with one id; the JavaScript attaches a handler to a similar-but-different id (typo). The handler is silently dead. Single-file linters can't catch this — they don't see the HTML.",
    files: {
      html: [
        file(
          "index.html",
          `<!-- index.html -->
<h1>Submit</h1>
<button id="submit">Submit</button>`,
        ),
      ],
      javascript: [
        file(
          "handlers.js",
          `// handlers.js — typo: "submitt" not "submit"
document.getElementById("submitt")
  .addEventListener("click", () => submit());`,
        ),
      ],
      css: [],
    },
  },

  {
    slug: "missing-aria-target",
    label: "Missing ARIA target",
    description:
      "An input declares aria-labelledby pointing at a label id that does not exist anywhere in the page. The screen reader gets nothing where it expected a label.",
    files: {
      html: [
        file(
          "index.html",
          `<!-- index.html -->
<h1>Account</h1>
<!-- aria-labelledby points at "lbl-name", but no element has that id. -->
<input type="text" aria-labelledby="lbl-name" />`,
        ),
      ],
      javascript: [],
      css: [],
    },
  },

  {
    slug: "good-cross-file",
    label: "Cross-file (good)",
    description:
      "The same situation as the cross-file demo but with the keyboard equivalent wired up across two separate JavaScript files. Paradise should report no issues — the multi-model architecture is what lets it tell the difference between the broken case and this one.",
    files: {
      html: [
        file(
          "index.html",
          `<!-- index.html -->
<h1>Save dialog</h1>

<button id="save">Save</button>

<!-- Custom button with role + tabindex. -->
<div id="cancel" role="button" tabindex="0">Cancel</div>`,
        ),
      ],
      javascript: [
        file(
          "click-handlers.js",
          `// click-handlers.js
document.getElementById("save")
  .addEventListener("click", () => save());

document.getElementById("cancel")
  .addEventListener("click", () => cancel());`,
        ),
        file(
          "keyboard-handlers.js",
          `// keyboard-handlers.js — separate file, the
// multi-model analyser still resolves the cross-file relationship.
document.getElementById("cancel")
  .addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      cancel();
    }
  });`,
        ),
      ],
      css: [],
    },
  },

  {
    slug: "heading-skip",
    label: "Heading hierarchy",
    description:
      "Heading levels skip from h1 to h3, then jump back. Source-only check; no JavaScript or CSS involved. Demonstrates that Paradise also runs single-file structural analysers, not only cross-file ones.",
    files: {
      html: [
        file(
          "index.html",
          `<!-- index.html -->
<h1>Page title</h1>
<h3>Skipped from h1 straight to h3</h3>
<h2>Then went back up to h2</h2>`,
        ),
      ],
      javascript: [],
      css: [],
    },
  },
];

export function findExample(slug: string): Example | undefined {
  return EXAMPLES.find((e) => e.slug === slug);
}
