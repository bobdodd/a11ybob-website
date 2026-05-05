import { SiteShell } from "@/components/SiteShell";

export default function WritingLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell zone="writing">{children}</SiteShell>;
}
