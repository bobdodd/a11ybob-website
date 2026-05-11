"use client";

/* Primary site navigation. Nine top-level entries; each has a
 * matcher that decides whether the user's current pathname makes
 * it the current page.
 *
 * Two of the entries are index-page parents whose children sit at
 * different routes for historical reasons:
 *  - Tools  → /tools, and also /carnforth, /a11yauto,
 *             /lived-testing as siblings in spirit.
 *  - Playgrounds → /playgrounds, /playground (the analyser
 *             playground), and /playgrounds/action-language (the
 *             Action Language playground).
 *
 * Per-item matchers replace the previous startsWith convention so
 * each entry can claim its own cross-section family precisely.
 * WCAG says only one aria-current="page" at a time; the matchers
 * are written to be mutually exclusive. */

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  isActive: (pathname: string) => boolean;
};

const items: NavItem[] = [
  {
    href: "/writing",
    label: "Writing",
    isActive: (p) => p === "/writing" || p.startsWith("/writing/"),
  },
  {
    href: "/research",
    label: "Research",
    isActive: (p) => p === "/research" || p.startsWith("/research/"),
  },
  {
    href: "/paradise",
    label: "Paradise",
    isActive: (p) => p === "/paradise" || p.startsWith("/paradise/"),
  },
  {
    href: "/tools",
    label: "Tools",
    /* The Tools index plus its three cross-listed siblings. */
    isActive: (p) =>
      p === "/tools" ||
      p.startsWith("/tools/") ||
      p === "/carnforth" ||
      p.startsWith("/carnforth/") ||
      p === "/a11yauto" ||
      p.startsWith("/a11yauto/") ||
      p === "/lived-testing" ||
      p.startsWith("/lived-testing/"),
  },
  {
    href: "/playgrounds",
    label: "Playgrounds",
    /* The Playgrounds index plus every sub-page. The legacy
     * /playground and /research/action-language URLs both
     * redirect to /playgrounds/* via next.config; the matcher
     * targets the post-redirect pathnames. */
    isActive: (p) =>
      p === "/playgrounds" || p.startsWith("/playgrounds/"),
  },
  {
    href: "/maps",
    label: "Maps",
    isActive: (p) => p === "/maps" || p.startsWith("/maps/"),
  },
  {
    href: "/talks",
    label: "Talks",
    isActive: (p) => p === "/talks" || p.startsWith("/talks/"),
  },
  {
    href: "/work",
    label: "Work",
    isActive: (p) => p === "/work" || p.startsWith("/work/"),
  },
  {
    href: "/about",
    label: "About",
    isActive: (p) => p === "/about" || p.startsWith("/about/"),
  },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary">
      <ul
        className="nav-list cluster"
        style={{ "--space": "var(--s1)" } as React.CSSProperties}
      >
        {items.map(({ href, label, isActive }) => {
          const active = isActive(pathname);
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
