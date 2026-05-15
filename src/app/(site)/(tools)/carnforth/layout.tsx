import { SiteShell } from "@/components/SiteShell";

/* The Carnforth GPL tool page is linked from the /tools landing
 * page and inherits the Tools zone. */
export default function CarnforthLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell zone="tools">{children}</SiteShell>;
}
