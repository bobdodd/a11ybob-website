import { SiteShell } from "@/components/SiteShell";

export default function MapsLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell zone="maps">{children}</SiteShell>;
}
