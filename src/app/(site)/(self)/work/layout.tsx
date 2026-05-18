import { SiteShell } from "@/components/SiteShell";
import { zoneViewport } from "@/lib/zone-theme-color";

export const viewport = zoneViewport("work");

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell zone="work">{children}</SiteShell>;
}
