/* Shared monochrome syntax highlighting for both CodeMirror 6
 * editor surfaces — the analyser Playground and the Action
 * Language playground. Same logic as the .pill--danger variant:
 * weight does what colour does in conventional sites, palette
 * stays monochrome, AAA contrast is preserved by definition
 * because every coloured token resolves to var(--ink) or
 * var(--ink-muted) over the editor's surface.
 *
 * Design rules:
 * - Keywords, tag names, function names, type names, numbers,
 *   booleans: bold ink. The structural tokens.
 * - Strings, attribute values, regex, comments: italic. The
 *   "this is content" tokens.
 * - Comments and operators / punctuation: --ink-muted (still
 *   AAA against surface). Comments lose visual weight against
 *   adjacent live code; operators are syntactic noise the
 *   reader's eye should skip.
 * - Everything else: regular ink. */

import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";
import type { Extension } from "@codemirror/state";

export const monochromeHighlight = HighlightStyle.define([
  // Structural / "this is code" tokens — bold ink.
  { tag: t.keyword, color: "var(--ink)", fontWeight: "700" },
  { tag: t.controlKeyword, color: "var(--ink)", fontWeight: "700" },
  { tag: t.operatorKeyword, color: "var(--ink)", fontWeight: "700" },
  { tag: t.modifier, color: "var(--ink)", fontWeight: "700" },
  { tag: t.definitionKeyword, color: "var(--ink)", fontWeight: "700" },
  { tag: t.tagName, color: "var(--ink)", fontWeight: "700" },
  { tag: t.angleBracket, color: "var(--ink-muted)" },
  { tag: t.function(t.variableName), color: "var(--ink)", fontWeight: "700" },
  { tag: t.function(t.propertyName), color: "var(--ink)", fontWeight: "700" },
  { tag: t.className, color: "var(--ink)", fontWeight: "700" },
  { tag: t.typeName, color: "var(--ink)", fontWeight: "700" },
  { tag: t.namespace, color: "var(--ink)", fontWeight: "700" },
  { tag: t.number, color: "var(--ink)", fontWeight: "700" },
  { tag: t.bool, color: "var(--ink)", fontWeight: "700" },
  { tag: t.null, color: "var(--ink)", fontWeight: "700" },
  { tag: t.atom, color: "var(--ink)", fontWeight: "700" },
  { tag: t.escape, color: "var(--ink)", fontWeight: "700" },

  // Content / "this is data" tokens — italic ink.
  { tag: t.string, color: "var(--ink)", fontStyle: "italic" },
  { tag: t.special(t.string), color: "var(--ink)", fontStyle: "italic" },
  { tag: t.attributeName, color: "var(--ink)", fontStyle: "italic" },
  { tag: t.attributeValue, color: "var(--ink)", fontStyle: "italic" },
  { tag: t.regexp, color: "var(--ink)", fontStyle: "italic" },

  // Subdued tokens — muted ink, no weight or style accent.
  // Comments lose visual weight against adjacent live code;
  // operators and punctuation are syntactic noise the reader's
  // eye should skip past.
  { tag: t.comment, color: "var(--ink-muted)", fontStyle: "italic" },
  { tag: t.lineComment, color: "var(--ink-muted)", fontStyle: "italic" },
  { tag: t.blockComment, color: "var(--ink-muted)", fontStyle: "italic" },
  { tag: t.docComment, color: "var(--ink-muted)", fontStyle: "italic" },
  { tag: t.meta, color: "var(--ink-muted)", fontStyle: "italic" },
  { tag: t.operator, color: "var(--ink-muted)" },
  { tag: t.punctuation, color: "var(--ink-muted)" },
  { tag: t.separator, color: "var(--ink-muted)" },
  { tag: t.bracket, color: "var(--ink-muted)" },
  { tag: t.squareBracket, color: "var(--ink-muted)" },
  { tag: t.paren, color: "var(--ink-muted)" },
  { tag: t.brace, color: "var(--ink-muted)" },

  // Other distinctive markers.
  { tag: t.heading, color: "var(--ink)", fontWeight: "700" },
  { tag: t.link, color: "var(--ink)", textDecoration: "underline" },
  { tag: t.emphasis, fontStyle: "italic" },
  { tag: t.strong, fontWeight: "700" },
  { tag: t.invalid, color: "var(--ink)", textDecoration: "underline wavy" },
]);

/** Drop into a CodeMirror 6 extensions array to enable monochrome
 *  syntax highlighting. Used by PlaygroundEditor (analyser
 *  Playground) and ALPlayground (Action Language). */
export const monochromeSyntaxHighlighting: Extension = syntaxHighlighting(
  monochromeHighlight,
);
