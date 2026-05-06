/* Shared highlight-marker helpers used by every search surface
 * (articles, reviews, glossary).
 *
 * Why placeholders rather than <mark> tags directly: the snippet text
 * coming back from OpenSearch is the source content, which may itself
 * contain HTML-significant characters (< & for instance). We must
 * HTML-escape the body and then inject real <mark> tags only at the
 * highlighter-marked positions. Doing the round-trip via opaque ASCII
 * placeholders means a stray < in source never gets confused for a
 * highlight tag and vice versa. */

export const HL_OPEN = "___HL_OPEN___";
export const HL_CLOSE = "___HL_CLOSE___";

/* Convert a highlighted snippet from OpenSearch into safe HTML.
 *
 * The snippet contains the source text with HL_OPEN/HL_CLOSE
 * placeholders around matched terms. We:
 *   1. HTML-escape the whole thing so any < or & in the source
 *      becomes harmless;
 *   2. swap the placeholders for actual <mark> tags;
 *   3. strip markdown syntax from the visible text so headings
 *      don't render as literal "##" and bold doesn't show "**".
 *      (Harmless on non-markdown sources.)
 *
 * The returned string is safe to pass to dangerouslySetInnerHTML. */
export function renderSnippet(snippet: string): string {
  let s = snippet
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  s = s.split(HL_OPEN).join("<mark>").split(HL_CLOSE).join("</mark>");

  // Strip markdown syntax — kept loose; snippet-scale, not document-scale.
  s = s.replace(/^#{1,6}\s+/gm, "");                             // headings
  s = s.replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1");                // images
  s = s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");                 // links
  s = s.replace(/\*\*([^*]+)\*\*/g, "$1");                       // bold **
  s = s.replace(/__([^_]+)__/g, "$1");                           // bold __
  s = s.replace(/(?<![*\w])\*([^*\n]+)\*(?!\w)/g, "$1");         // italic *
  s = s.replace(/(?<![_\w])_([^_\n]+)_(?!\w)/g, "$1");           // italic _
  s = s.replace(/`([^`]+)`/g, "$1");                             // code spans
  s = s.replace(/^>\s*/gm, "");                                   // blockquote
  s = s.replace(/^[ \t]*[-*+]\s+/gm, "");                         // list bullets
  s = s.replace(/^[ \t]*\d+\.\s+/gm, "");                         // ordered list

  return s.trim();
}
