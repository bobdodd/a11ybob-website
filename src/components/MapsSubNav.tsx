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
  { href: "/maps/groves", label: "The Groves" },
  { href: "/maps/yvr", label: "YVR terminal" },
  { href: "/maps/guelph", label: "Guelph streetmap" },
] as const;

export function MapsSubNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Maps sections">
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
