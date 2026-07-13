"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DemoProvider, useDemo } from "@/lib/demo/provider";
import { AppSidebar, MobileNav } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";
import { Skeleton } from "@/components/ui/skeleton";

function AuthGate({ children }: { children: React.ReactNode }) {
  const { store, hydrated } = useDemo();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!hydrated) return;
    if (!store.session) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [hydrated, store.session, router, pathname]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-ink)] p-6">
        <div className="w-full max-w-md space-y-3" aria-busy="true" aria-label="Carregando app">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!store.session) {
    return null;
  }

  return <>{children}</>;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider>
      <AuthGate>
        <div className="flex min-h-screen bg-[var(--bg-ink)]">
          <AppSidebar />
          <div className="flex flex-1 flex-col">
            <div
              className="border-b border-[var(--accent-amber)]/30 bg-[var(--accent-amber)]/10 px-4 py-2 text-center text-xs text-[var(--accent-amber)] sm:text-sm"
              role="status"
            >
              Modo demo / portfólio — dados no localStorage · billing mock · sem cobrança real
            </div>
            <AppTopbar />
            <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
            <MobileNav />
          </div>
        </div>
      </AuthGate>
    </DemoProvider>
  );
}
