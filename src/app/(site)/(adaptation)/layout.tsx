import { SiteShell } from "@/components/SiteShell";
import { zoneViewport } from "@/lib/zone-theme-color";

export const viewport = zoneViewport("adaptation");

export default function AdaptationLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell zone="adaptation">{children}</SiteShell>;
}
