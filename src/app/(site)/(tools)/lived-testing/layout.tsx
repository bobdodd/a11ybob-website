import { SiteShell } from "@/components/SiteShell";

/* /lived-testing is reached from the /tools landing page and
 * inherits the Tools zone. */
export default function LivedTestingLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell zone="tools">{children}</SiteShell>;
}
