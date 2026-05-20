import { SiteShell } from "@/components/SiteShell";
import { zoneViewport } from "@/lib/zone-theme-color";

export const viewport = zoneViewport("tools");

/* The Carnforth tool page is linked from the /tools landing
 * page and inherits the Tools zone. */
export default function CarnforthLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell zone="tools">{children}</SiteShell>;
}
