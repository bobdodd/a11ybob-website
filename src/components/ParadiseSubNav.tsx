"use client";

/* Sub-navigation for the Paradise section. Shows only sub-pages that
 * are live; new pages join the list as they ship. The current page is
 * announced via aria-current="page", which the existing
 * `.nav-list a[aria-current="page"]` selector already styles to mark
 * it visually as the current location.
 *
 * Built as a client component to read the current pathname directly,
 * mirroring the primary site Nav. */

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";

const SUB_PAGES = [
  { href: "/paradise", label: "Paradise" },
  { href: "/paradise/lineage", label: "Lineage" },
  { href: "/paradise/architecture", label: "Architecture" },
  { href: "/paradise/action-language", label: "ActionLanguage" },
  { href: "/paradise/analysers", label: "Analysers" },
  { href: "/paradise/widget-patterns", label: "Widget patterns" },
  { href: "/paradise/evidence", label: "Evidence" },
  { href: "/paradise/vscode-extension", label: "VS Code plugin" },
  { href: "/paradise/cite", label: "Cite" },
] as const;

export function ParadiseSubNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Paradise sections" className="section-nav">
      <p className="section-nav__label">In this section</p>
      <ul
        className="nav-list cluster"
        style={{ "--space": "var(--s0)" } as CSSProperties}
      >
        {SUB_PAGES.map(({ href, label }) => {
          const active = pathname === href;
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
