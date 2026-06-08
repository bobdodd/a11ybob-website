"use client";

/* Sub-navigation for the Writing section. Mirrors ResearchSubNav /
 * ParadiseSubNav: Writing is the umbrella; its four corpora sit under
 * it as peers. Current page (or corpus) is announced via
 * aria-current="page". Reader pages light up their parent corpus. */

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";

const SUB_PAGES = [
  { href: "/writing", label: "Writing" },
  { href: "/writing/research-essays", label: "Research essays" },
  { href: "/writing/experience", label: "Experience" },
  { href: "/writing/reviews", label: "Reviews" },
  { href: "/writing/glossary", label: "Glossary" },
] as const;

export function WritingSubNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Writing sections" className="section-nav">
      <p className="section-nav__label">In this section</p>
      <ul
        className="nav-list cluster"
        style={{ "--space": "var(--s0)" } as CSSProperties}
      >
        {SUB_PAGES.map(({ href, label }) => {
          // Active when this is the page or a descendant of it (reader
          // pages light up their parent corpus entry). The "/writing"
          // hub matches only exactly, so it never co-fires with a corpus.
          const active =
            pathname === href ||
            (href !== "/writing" && pathname.startsWith(href + "/"));
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
