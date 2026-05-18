"use client";

/* Sub-navigation for the Research section. Mirrors ParadiseSubNav:
 * lists only sub-pages that exist; current page is announced via
 * aria-current="page". The Measure of Accessibility sub-collection
 * appears as a single entry pointing at its index; its six
 * sub-pages have their own internal nav inside the collection. */

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";

const SUB_PAGES = [
  { href: "/research", label: "Research" },
  { href: "/research/cisna-model", label: "CISNA Model" },
  {
    href: "/research/polymorphic-task-decomposition",
    label: "Polymorphic Task Decomposition",
  },
  { href: "/research/tetris-testbed", label: "Tetris testbed" },
  { href: "/research/shlaer-mellor-lens", label: "Shlaer-Mellor lens" },
  { href: "/research/2029-framework", label: "2029 framework" },
  {
    href: "/research/accessibility-of-dialogue",
    label: "Accessibility of dialogue",
  },
  {
    href: "/research/the-measure-of-accessibility",
    label: "The Measure of Accessibility",
  },
  { href: "/research/spotlight", label: "Spotlight projects" },
] as const;

export function ResearchSubNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Research sections" className="section-nav">
      <p className="section-nav__label">In this section</p>
      <ul
        className="nav-list cluster"
        style={{ "--space": "var(--s0)" } as CSSProperties}
      >
        {SUB_PAGES.map(({ href, label }) => {
          // Active when this is the page or a descendant of it (sub-
          // collection pages light up the parent nav entry).
          const active =
            pathname === href ||
            (href !== "/research" && pathname.startsWith(href + "/"));
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
