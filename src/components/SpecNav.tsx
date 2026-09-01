"use client";

/* Navigation within the AFDS specification. Same pattern as
 * AfdsSubNav: lists the parts, and announces the current one with
 * aria-current="page". The clause numbers are global, so this nav
 * moves between pages of one document, not between documents. */

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";

const BASE = "/adaptation/afds/specification";

type Entry = { href: string; label: string };

export function SpecNav({ pages }: { pages: Entry[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Specification parts" className="section-nav">
      <p className="section-nav__label">In this specification</p>
      <ul
        className="nav-list cluster"
        style={{ "--space": "var(--s0)" } as CSSProperties}
      >
        <li>
          <Link
            href={BASE}
            aria-current={pathname === BASE ? "page" : undefined}
          >
            Contents
          </Link>
        </li>
        {pages.map(({ href, label }) => {
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
