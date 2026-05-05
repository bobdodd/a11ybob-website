"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/writing", label: "Writing" },
  { href: "/research", label: "Research" },
  { href: "/paradise", label: "Paradise" },
  { href: "/playground", label: "Playground" },
  { href: "/talks", label: "Talks" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
] as const;

export function Nav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary">
      <ul className="nav-list cluster" style={{ "--space": "var(--s1)" } as React.CSSProperties}>
        {items.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
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
