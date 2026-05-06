@AGENTS.md

## Ask before inventing or inferring content

This site's use case is unique. Defaults that look reasonable in general
web work — auto-extracting a summary, choosing a sensible metadata field,
normalising content for display — may be wrong here. Treat any of the
following as decisions that need Bob's explicit buy-in BEFORE
implementation:

- **Inferring or inventing fields on data models.** E.g. the first pass
  of the article migration auto-extracted the first paragraph as a
  "summary" field. The result wasn't a summary, it was duplicated
  content that rendered twice on the article page. The summary field
  was removed entirely.
- **Choosing what content to display vs hide vs strip at render time.**
  E.g. whether the article reader page should suppress its own `<h1>`
  when the markdown body provides one. The renderer should not silently
  alter what the author wrote.
- **Adding fields the site doesn't strictly need.** E.g. an `author`
  field that always reads "Bob Dodd" was noise, not signal. Removed.
- **Content normalisation that quietly changes what was written.** Any
  regex that strips or rewrites user content needs sign-off.
- **Anything framed as "for safety" or "defensive" that affects what
  the user sees.** Tolerances and fallbacks are easy to over-apply.

Reasonable defaults are still defaults — the point of asking isn't that
common practice is wrong, it's that this site is a deliberate piece of
work and deserves intentional decisions, not implicit ones.

**Mechanic:** when about to make this kind of decision, surface the
option, name the trade-off, propose a recommendation, then wait. Don't
ship and ask forgiveness.
