import { SiteShell } from "@/components/SiteShell";
import { zoneViewport } from "@/lib/zone-theme-color";

export const viewport = zoneViewport("about");

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell zone="about">{children}</SiteShell>;
}
