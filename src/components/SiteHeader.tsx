import Link from "next/link";
import { Nav } from "./Nav";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-chrome center">
        <div
          className="cluster"
          style={
            {
              "--justify": "space-between",
              "--align": "center",
              "--space": "var(--s1)",
            } as React.CSSProperties
          }
        >
          <Link href="/" className="site-logo">
            a11ybob.com
          </Link>
          <Nav />
        </div>
      </div>
    </header>
  );
}
