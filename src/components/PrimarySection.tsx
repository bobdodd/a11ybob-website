/* When cross-corpus extras are showing, the primary corpus's results
 * are wrapped in a <details> disclosure too — same shape as the
 * extras — so the user can collapse the primary section to navigate
 * past it to the others. When there are no extras, the children
 * render as a plain fragment with no disclosure. */

import type { CSSProperties, ReactNode } from "react";

export function PrimarySection({
  wrap,
  heading,
  children,
}: {
  wrap: boolean;
  heading: string;
  children: ReactNode;
}) {
  if (!wrap) return <>{children}</>;
  return (
    <details className="extra-section" open>
      <summary>
        <h2 style={{ display: "inline", fontSize: "var(--s1)", marginBlock: 0 }}>
          {heading}
        </h2>
      </summary>
      <div
        className="stack"
        style={
          {
            "--space": "var(--s2)",
            marginBlockStart: "var(--s1)",
          } as CSSProperties
        }
      >
        {children}
      </div>
    </details>
  );
}
