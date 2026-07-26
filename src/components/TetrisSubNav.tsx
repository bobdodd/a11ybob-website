"use client";

/* Sub-navigation for the Accessible Tetris case study. Same
 * pattern as the MapsSubNav and ResearchSubNav — lists only
 * sub-pages that exist; current page is announced via
 * aria-current="page". */

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";

const BASE = "/adaptation/accessible-tetris";

const SUB_PAGES = [
  { href: BASE, label: "Introduction" },
  { href: `${BASE}/the-game`, label: "The game and the player" },
  { href: `${BASE}/why-assistive-technology-fails`, label: "Why assistive technology fails" },
  { href: `${BASE}/the-sonic-design-space`, label: "The sonic design space" },
  { href: `${BASE}/the-rhetoric-of-sound`, label: "The rhetoric of sound" },
  { href: `${BASE}/an-architecture-for-adaptation`, label: "An architecture for adaptation" },
  { href: `${BASE}/what-the-browser-makes-possible`, label: "What the browser makes possible" },
  { href: `${BASE}/the-record`, label: "The record" },
  { href: `${BASE}/from-case-study-to-demonstrator`, label: "From case study to demonstrator" },
] as const;

export function TetrisSubNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Accessible Tetris sections" className="section-nav">
      <p className="section-nav__label">In this case study</p>
      <ul
        className="nav-list cluster"
        style={{ "--space": "var(--s0)" } as CSSProperties}
      >
        {SUB_PAGES.map(({ href, label }) => {
          const active = pathname === href;
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
