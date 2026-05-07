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

## Don't use inline styles for declarative styling

Avoid `style={…}` for properties that should live in a CSS class.
Inline styles are an accessibility regression: they override user
stylesheets and break every assistive-tech adaptation the user has
configured — screen-magnifier reflow, high-contrast user stylesheets,
reader-mode tools, contrast-tuning browser extensions. All of those
adapt by replacing CSS rules; inline styles win the cascade against
them without `!important`, which is a war the user shouldn't have to
fight.

- **Don't** set declarative properties inline — colour, padding,
  border, font, background, alignment, dimensions. Those go in a
  CSS class in the right `@layer`: `base` for element-level
  defaults, `components` for specific component classes,
  `utilities` for composable one-offs.
- **Do** set CSS custom properties inline when they configure a
  class-based primitive — e.g. `style={{"--space": "var(--s2)"}}`
  on `.stack`, `style={{"--max": "min(80rem, 100%)"}}` on
  `.center`. The class encodes the behaviour; the inline custom
  property tunes one instance. This is the Every Layout pattern.
- **Don't** inline-style as a "belt-and-suspenders" workaround for
  perceived cascade issues. Trace and fix the cascade; don't paint
  over it. (This trapped me once with the pill toggle — the right
  fix was a more specific selector, not inline overrides.)
- **Don't** inline-style "small" adjustments because it feels
  proportionate. If a property is being declared, it's a class.

Apply equally to React `style` props, HTML `style` attributes, and
any equivalent.

## Never use placeholder text on inputs

The site targets WCAG 2.2 AAA. Placeholder text fails 1.4.6 in every
browser's default styling — the muted-grey rendering doesn't reach
the 7:1 contrast ratio AAA requires for text. It also disappears as
soon as the user types, removing context exactly when they may need
to refer back to it.

- Don't use `placeholder=...` on `<input>` or `<textarea>`. If a
  field needs guidance, render a visible `<small>` hint beneath the
  input and connect it via `aria-describedby`. The SearchForm /
  SearchSuggest components have a `hint` prop that does this; use
  it.
- The label is a separate concern from the hint. Labels say *what
  field this is*, hints offer additional guidance. Both can be
  visible.
- This rule applies to demo inputs in the styleguide too — those
  examples shouldn't model anti-patterns.
- Hint text below an input renders at body size (`var(--s0)`), not
  `<small>` / `var(--s-1)`. Hints are guidance the reader may need
  at any moment and have to stay at the same legibility floor as
  body text — the fluid root font-size keeps body comfortable, but
  `<small>` shrinks below it and can drop under the practical
  minimum on narrow viewports. Use a `<span style="display:block">`
  or `<p>` with explicit `font-size: var(--s0)` and a muted colour
  to de-emphasise visually without shrinking.

## Never set autocomplete="off" on a text input

The HTML default is `autocomplete="on"`, and that's the right default
here. Text entry is one of the highest-cost activities for users on
explore-by-touch mobile keyboards, switch access, and eye-gaze input
— every keystroke autocomplete saves is real cognitive and physical
effort spared.

- For ordinary text inputs, leave `autocomplete` unset (defaults to
  on) or set it to a specific token like `name`, `email`,
  `street-address`, etc. when the field has a known semantic.
- For passwords (when we eventually add them), use
  `autocomplete="current-password"` or `"new-password"` — those
  tokens cooperate with password managers without accumulating
  plaintext history.
- Never set `autocomplete="off"` without a specific, named reason
  that outweighs the typing cost for assistive-input users. "I don't
  want browser suggestions to look messy" is not such a reason.
