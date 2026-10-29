"use client";

import { AuthGuard } from "@/components/common/AuthGuard";
import { SidebarProvider } from "@/layout/SidebarContext";
import { TopBar } from "@/layout/TopBar";
import { Sidebar } from "@/layout/Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <div className="flex h-svh overflow-hidden bg-background text-foreground">
          <Sidebar />
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <TopBar />
            <main className="min-h-0 flex-1 overflow-auto p-4 md:p-6">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}
