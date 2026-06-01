import type { ReactNode } from "react";

interface NewTabLinkProps {
  href: string;
  /* The visible link label. Kept as one non-breaking phrase. */
  children: ReactNode;
  /* Extra classes — e.g. "pill" to render as a button-style launch. */
  className?: string;
  /* Override the new-window notice wording (e.g. for a non-demo link).
   * Keep the parentheses; they mark it as the supplementary part of
   * the label. */
  notice?: string;
}

/* NewTabLink — a link that opens in a new browser window/tab.
 *
 * The "(opens in a new window)" notice is rendered as VISIBLE text
 * inside the link, so it is both seen and part of the link's
 * accessible name. A screen-reader user tabbing through focusable
 * content therefore hears the warning when the link takes focus —
 * before they activate it — not only after the new window has opened
 * (WCAG 3.2.5, technique G201). rel="noopener" severs the opened
 * context's access to window.opener.
 *
 * Used for launching the interactive demos (which take over keyboard,
 * focus, and screen-reader handling, so they need their own surface)
 * and for any other link that should open away from the current page. */
export function NewTabLink({
  href,
  children,
  className,
  notice = "(opens in a new window)",
}: NewTabLinkProps) {
  const classes = ["new-tab-link", className].filter(Boolean).join(" ");
  return (
    <a href={href} target="_blank" rel="noopener" className={classes}>
      <span className="new-tab-link__label">{children}</span>{" "}
      <span className="new-tab-link__notice">{notice}</span>
    </a>
  );
}
