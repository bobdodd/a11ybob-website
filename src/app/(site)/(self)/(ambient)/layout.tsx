import { SiteShell } from "@/components/SiteShell";

export default function AmbientLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell zone="ambient">{children}</SiteShell>;
}
