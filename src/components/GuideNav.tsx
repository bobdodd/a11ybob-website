"use client";

/* Navigation within the AFDS user guide. Same pattern as SpecNav:
 * lists the parts, and announces the current one with
 * aria-current="page". The guide is not read in order, so this nav is
 * the ordinary way of moving through it rather than a fallback for
 * readers who lost their place. */

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";

const BASE = "/adaptation/afds/user-guide";

type Entry = { href: string; label: string };

export function GuideNav({ pages }: { pages: Entry[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="User guide parts" className="section-nav">
      <p className="section-nav__label">In this guide</p>
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
