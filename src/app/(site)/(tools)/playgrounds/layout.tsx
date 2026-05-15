import { SiteShell } from "@/components/SiteShell";

export default function PlaygroundsLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell zone="playgrounds">{children}</SiteShell>;
}
