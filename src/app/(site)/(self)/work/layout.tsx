import { SiteShell } from "@/components/SiteShell";

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell zone="work">{children}</SiteShell>;
}
