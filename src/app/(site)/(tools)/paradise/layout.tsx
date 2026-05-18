import { SiteShell } from "@/components/SiteShell";
import { zoneViewport } from "@/lib/zone-theme-color";

export const viewport = zoneViewport("paradise");

export default function ParadiseLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell zone="paradise">{children}</SiteShell>;
}
