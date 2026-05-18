import Link from "next/link";
import { Nav } from "./Nav";

/* The header reads as a single horizontal cluster: branding is the
 * first item, the primary nav flows from it left-to-right, no
 * float to the right viewport edge. Constrained to the same
 * column the content sits in (via .site-chrome's --max), so
 * screen-magnifier users zoomed on the body column don't have to
 * pan to the edge of a wide viewport to find the nav. */
export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-chrome center">
        <div
          className="cluster"
          style={
            {
              /* Baseline align so the visually-larger logo and the
               * nav items share a text baseline rather than
               * centring on each other (which made the smaller nav
               * text float and the bottoms misalign). */
              "--align": "baseline",
              "--space": "var(--s1)",
            } as React.CSSProperties
          }
        >
          <Link href="/" className="site-logo">
            a11ybob.com
          </Link>
          <Nav />
        </div>
      </div>
    </header>
  );
}
