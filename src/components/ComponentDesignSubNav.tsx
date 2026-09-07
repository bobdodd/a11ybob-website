"use client";

/* Sub-navigation for the component design section. Same pattern as
 * AfdsSubNav and TetrisSubNav — lists only sub-pages that exist, and
 * announces the current page via aria-current="page".
 *
 * This section is a peer of the design system, not a part of it.
 * Component design does not require a design system; this design
 * system uses components, and the AFDS pages refer back here. */

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";

const BASE = "/adaptation/component-design";

const SUB_PAGES = [
  { href: BASE, label: "Introduction" },
  { href: `${BASE}/the-landscape`, label: "The framework landscape" },
  { href: `${BASE}/the-assembly-hierarchy`, label: "The assembly hierarchy" },
  { href: `${BASE}/failure-modes`, label: "How composition fails" },
  { href: `${BASE}/worked-examples`, label: "Worked examples" },
  { href: `${BASE}/what-this-means`, label: "What this means for a design system" },
  { href: `${BASE}/state-propagation`, label: "State and its propagation" },
  { href: `${BASE}/testing`, label: "Testing across the hierarchy" },
  { href: `${BASE}/what-is-open`, label: "What is still open" },
] as const;

export function ComponentDesignSubNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Component design sections" className="section-nav">
      <p className="section-nav__label">In this section</p>
      <ul
        className="nav-list cluster"
        style={{ "--space": "var(--s0)" } as CSSProperties}
      >
        {SUB_PAGES.map(({ href, label }) => {
          /* The section root is matched exactly, or it would be
           * current on every page beneath it. */
          const active =
            pathname === href ||
            (href !== BASE && pathname.startsWith(`${href}/`));
          return (
            <li key={href}>
              <Link href={href} aria-current={active ? "page" : undefined}>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
