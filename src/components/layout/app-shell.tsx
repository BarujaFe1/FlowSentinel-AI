"use client";

import { DemoProvider } from "@/lib/demo/provider";
import { AppSidebar, MobileNav } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider>
      <div className="flex min-h-screen bg-[var(--bg-ink)]">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <AppTopbar />
          <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
          <MobileNav />
        </div>
      </div>
    </DemoProvider>
  );
}
