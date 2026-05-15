import { SiteShell } from "@/components/SiteShell";

export default function ParadiseLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell zone="paradise">{children}</SiteShell>;
}
