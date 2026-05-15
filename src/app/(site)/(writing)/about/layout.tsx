import { SiteShell } from "@/components/SiteShell";

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell zone="about">{children}</SiteShell>;
}
