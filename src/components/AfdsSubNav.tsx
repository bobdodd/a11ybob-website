"use client";

/* Sub-navigation for the AFDS section. Same pattern as the
 * TetrisSubNav and ParadiseSubNav — lists only sub-pages that
 * exist; current page is announced via aria-current="page". */

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";

const BASE = "/adaptation/afds";

const SUB_PAGES = [
  { href: BASE, label: "Introduction" },
  { href: `${BASE}/why-a-design-system`, label: "Why a design system" },
  { href: `${BASE}/what-a-component-declares`, label: "What a component declares" },
  { href: `${BASE}/evidence-and-uncertainty`, label: "Evidence and uncertainty" },
  { href: `${BASE}/apg-support`, label: "APG support" },
  { href: `${BASE}/portable-representations`, label: "Portable representations" },
  { href: `${BASE}/the-package-format`, label: "The package format" },
  { href: `${BASE}/adapters`, label: "Adapters" },
  { href: `${BASE}/open-questions`, label: "Open questions" },
  { href: `${BASE}/user-guide`, label: "User guide" },
  { href: `${BASE}/specification`, label: "Specification" },
] as const;

export function AfdsSubNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="AFDS sections" className="section-nav">
      <p className="section-nav__label">In this design system</p>
      <ul
        className="nav-list cluster"
        style={{ "--space": "var(--s0)" } as CSSProperties}
      >
        {SUB_PAGES.map(({ href, label }) => {
          /* The specification is a set of pages under one route, so its
           * entry stays current while the reader is inside it. The
           * section root is matched exactly, or it would be current
           * everywhere. */
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
