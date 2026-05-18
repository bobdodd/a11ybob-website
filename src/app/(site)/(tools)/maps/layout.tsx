import { SiteShell } from "@/components/SiteShell";
import { zoneViewport } from "@/lib/zone-theme-color";

export const viewport = zoneViewport("maps");

export default function MapsLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell zone="maps">{children}</SiteShell>;
}
