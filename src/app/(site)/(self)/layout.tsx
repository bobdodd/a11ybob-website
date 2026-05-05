import { SiteShell } from "@/components/SiteShell";

export default function SelfLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell zone="self">{children}</SiteShell>;
}
