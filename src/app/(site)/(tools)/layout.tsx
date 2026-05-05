import { SiteShell } from "@/components/SiteShell";

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell zone="tools">{children}</SiteShell>;
}
