import { SiteShell } from "@/components/SiteShell";
import { zoneViewport } from "@/lib/zone-theme-color";

export const viewport = zoneViewport("writing");

/* /writing/experience/* inherits the Writing zone — the experience
 * corpus is a sub-tree of the Writing main-nav landing. */
export default function ExperienceLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell zone="writing">{children}</SiteShell>;
}
