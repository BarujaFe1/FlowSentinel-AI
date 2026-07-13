"use client";

import { ChevronDown, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDemo } from "@/lib/demo/provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function AppTopbar() {
  const { store, workspace, setSession } = useDemo();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [wsOpen, setWsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const userName = store.session?.name ?? "Usuário";

  return (
    <header className="relative flex h-16 shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--bg-charcoal)] px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden"
          aria-label="Abrir menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="relative">
          <button
            type="button"
            onClick={() => setWsOpen(!wsOpen)}
            className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-1.5 text-sm hover:bg-[var(--bg-elevated)]"
          >
            <span className="font-medium">{workspace?.name ?? "Workspace"}</span>
            <ChevronDown className="h-4 w-4 text-[var(--text-muted)]" />
          </button>
          {wsOpen && (
            <div className="absolute left-0 top-full z-50 mt-1 w-56 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] py-1 shadow-xl">
              {store.workspaces.map((ws) => (
                <button
                  key={ws.id}
                  type="button"
                  onClick={() => {
                    if (store.session) {
                      setSession({ ...store.session, workspaceId: ws.id });
                    }
                    setWsOpen(false);
                  }}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-[var(--bg-elevated)]"
                >
                  {ws.name}
                  {ws.id === workspace?.id && (
                    <Badge variant="info" className="text-[10px]">
                      Ativo
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="relative flex items-center gap-3">
        <Link href="/app/simulations">
          <Button size="sm">Nova simulação</Button>
        </Link>
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-[var(--bg-surface)]"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-amber)]/20 text-xs font-bold text-[var(--accent-amber)]">
            {userName.charAt(0)}
          </div>
          <span className="hidden sm:inline">{userName}</span>
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] py-1 shadow-xl">
            <Link
              href="/app/settings"
              className="block px-3 py-2 text-sm hover:bg-[var(--bg-elevated)]"
              onClick={() => setMenuOpen(false)}
            >
              Configurações
            </Link>
            <button
              type="button"
              onClick={() => {
                setSession(null);
                router.push("/login");
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[var(--risk-critical)] hover:bg-[var(--bg-elevated)]"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        )}
      </div>
      {mobileOpen && (
        <div className="absolute left-0 right-0 top-16 z-40 border-b border-[var(--border)] bg-[var(--bg-charcoal)] p-3 lg:hidden">
          <nav className="grid grid-cols-2 gap-2">
            {[
              ["/app", "Dashboard"],
              ["/app/flows", "Flows"],
              ["/app/personas", "Personas"],
              ["/app/simulations", "Simulations"],
              ["/app/reports", "Reports"],
              ["/app/billing", "Billing"],
              ["/app/settings", "Settings"],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-amber)]"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
