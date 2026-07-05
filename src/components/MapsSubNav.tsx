"use client";

/* Sub-navigation for the Maps section. Same pattern as the
 * ParadiseSubNav and ResearchSubNav — lists only sub-pages that
 * exist; current page is announced via aria-current="page";
 * ancestor highlighting via pathname.startsWith. */

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";

const SUB_PAGES = [
  { href: "/maps", label: "Maps" },
  { href: "/maps/how-its-built", label: "How it’s built" },
  { href: "/maps/search-and-map-pins", label: "Search and map pins" },
  { href: "/maps/east-toronto-streetmap", label: "East End Toronto streetmap" },
  { href: "/maps/tiled-toronto-map", label: "Tiled Toronto map" },
  { href: "/maps/context-map", label: "Context Map" },
  { href: "/maps/conversational-map", label: "Conversational map" },
  { href: "/maps/knowledge-map", label: "Knowledge map" },
  { href: "/maps/terminal-map", label: "Terminal map" },
] as const;

export function MapsSubNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Maps sections" className="section-nav">
      <p className="section-nav__label">In this section</p>
      <ul
        className="nav-list cluster"
        style={{ "--space": "var(--s0)" } as CSSProperties}
      >
        {SUB_PAGES.map(({ href, label }) => {
          const active =
            pathname === href ||
            (href !== "/maps" && pathname.startsWith(href + "/"));
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
