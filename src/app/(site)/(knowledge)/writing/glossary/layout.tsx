import { SiteShell } from "@/components/SiteShell";
import { zoneViewport } from "@/lib/zone-theme-color";

export const viewport = zoneViewport("writing");

/* /writing/glossary/* inherits the Writing zone — sub-tree of the
 * Writing main-nav landing. */
export default function GlossaryLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell zone="writing">{children}</SiteShell>;
}
