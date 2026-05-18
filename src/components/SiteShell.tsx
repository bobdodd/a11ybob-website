import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { ZoneSync } from "./ZoneSync";
import type { ZoneName } from "@/lib/zone-theme-color";

export function SiteShell({
  zone,
  children,
}: {
  zone: ZoneName;
  children: React.ReactNode;
}) {
  return (
    <div className="site-shell" data-zone={zone}>
      {/* Keep the browser-chrome theme-color in sync with the
       * current zone on client-side navigation. Server-rendered
       * theme-color is correct on initial load; this fires on
       * every zone change to re-mutate the meta tag so Safari
       * picks up the new value. */}
      <ZoneSync zone={zone} />
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
