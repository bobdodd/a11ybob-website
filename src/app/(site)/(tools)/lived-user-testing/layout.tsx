import { SiteShell } from "@/components/SiteShell";
import { zoneViewport } from "@/lib/zone-theme-color";

export const viewport = zoneViewport("tools");

/* /lived-user-testing is reached from the /tools landing page and
 * inherits the Tools zone. */
export default function LivedUserTestingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteShell zone="tools">{children}</SiteShell>;
}
