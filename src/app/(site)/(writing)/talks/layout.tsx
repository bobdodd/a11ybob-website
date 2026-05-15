import { SiteShell } from "@/components/SiteShell";

export default function TalksLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell zone="talks">{children}</SiteShell>;
}
