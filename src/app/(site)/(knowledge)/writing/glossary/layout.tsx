import { SiteShell } from "@/components/SiteShell";

/* /writing/glossary/* inherits the Writing zone — sub-tree of the
 * Writing main-nav landing. */
export default function GlossaryLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell zone="writing">{children}</SiteShell>;
}
