import { SiteShell } from "@/components/SiteShell";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell zone="home">{children}</SiteShell>;
}
