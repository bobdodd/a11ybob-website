import { SiteShell } from "@/components/SiteShell";
import { zoneViewport } from "@/lib/zone-theme-color";

export const viewport = zoneViewport("research");

export default function ResearchLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell zone="research">{children}</SiteShell>;
}
