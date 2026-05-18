import { SiteShell } from "@/components/SiteShell";
import { zoneViewport } from "@/lib/zone-theme-color";

export const viewport = zoneViewport("home");

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell zone="home">{children}</SiteShell>;
}
