import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

type Zone = "self" | "writing" | "knowledge" | "tools";

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
