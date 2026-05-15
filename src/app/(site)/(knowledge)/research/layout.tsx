import { SiteShell } from "@/components/SiteShell";

export default function ResearchLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell zone="research">{children}</SiteShell>;
}
