import { SiteShell } from "@/components/SiteShell";
import { zoneViewport } from "@/lib/zone-theme-color";

export const viewport = zoneViewport("playgrounds");

export default function PlaygroundsLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell zone="playgrounds">{children}</SiteShell>;
}
