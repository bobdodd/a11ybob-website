import { SiteShell } from "@/components/SiteShell";
import { zoneViewport } from "@/lib/zone-theme-color";

export const viewport = zoneViewport("tools");

/* /a11yauto is reached from the /tools landing page and inherits
 * the Tools zone. */
export default function A11yAutoLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell zone="tools">{children}</SiteShell>;
}
