import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

type Zone =
  | "home"
  | "ambient"
  | "work"
  | "about"
  | "writing"
  | "research"
  | "paradise"
  | "tools"
  | "playgrounds"
  | "maps";

export function SiteShell({
  zone,
  children,
}: {
  zone: Zone;
  children: React.ReactNode;
}) {
  return (
    <div className="site-shell" data-zone={zone}>
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
