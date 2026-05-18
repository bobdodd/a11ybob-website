import { SiteShell } from "@/components/SiteShell";
import { zoneViewport } from "@/lib/zone-theme-color";

export const viewport = zoneViewport("writing");

/* /writing/reviews/* inherits the Writing zone — the lit-review
 * browser is a sub-tree of the Writing main-nav landing. */
export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell zone="writing">{children}</SiteShell>;
}
