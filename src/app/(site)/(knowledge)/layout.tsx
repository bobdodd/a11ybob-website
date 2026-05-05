import { SiteShell } from "@/components/SiteShell";

export default function KnowledgeLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell zone="knowledge">{children}</SiteShell>;
}
