import { AppShell } from "@/layout/AppShell";

export const instant = false;

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
