import { SiteShell } from "@/components/SiteShell";
import { zoneViewport } from "@/lib/zone-theme-color";

export const viewport = zoneViewport("ambient");

export default function AmbientLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell zone="ambient">{children}</SiteShell>;
}
