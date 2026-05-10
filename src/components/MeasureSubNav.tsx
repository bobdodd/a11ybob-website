"use client";

/* Internal navigation for The Measure of Accessibility six-page
 * sub-collection. The six pages are designed to be read linearly
 * but each stands alone; this nav exposes both the linear order
 * and the named entry points. Active page announced via
 * aria-current="page". */

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";

const PAGES = [
  {
    href: "/research/the-measure-of-accessibility",
    label: "Index",
  },
  {
    href: "/research/the-measure-of-accessibility/the-question",
    label: "1. The Question",
  },
  {
    href: "/research/the-measure-of-accessibility/functional-accessibility",
    label: "2. Functional Accessibility",
  },
  {
    href: "/research/the-measure-of-accessibility/intrinsic-accessibility",
    label: "3. Intrinsic Accessibility",
  },
  {
    href: "/research/the-measure-of-accessibility/equivalent-experience",
    label: "4. Equivalent Experience",
  },
  {
    href: "/research/the-measure-of-accessibility/the-shlaer-mellor-lens",
    label: "5. The Shlaer-Mellor lens",
  },
  {
    href: "/research/the-measure-of-accessibility/communities-of-practice",
    label: "6. Communities of Practice",
  },
] as const;

export function MeasureSubNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="The Measure of Accessibility — pages">
      <ul
        className="nav-list cluster"
        style={{ "--space": "var(--s-1)" } as CSSProperties}
      >
        {PAGES.map(({ href, label }) => {
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
