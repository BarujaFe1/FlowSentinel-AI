"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CreditCard,
  FlaskConical,
  GitBranch,
  LayoutDashboard,
  Settings,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDemo } from "@/lib/demo/provider";
import { Badge } from "@/components/ui/badge";
import { PLANS } from "@/lib/billing/plans";

const navItems = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/flows", label: "Flows", icon: GitBranch },
  { href: "/app/personas", label: "Personas", icon: Users },
  { href: "/app/simulations", label: "Simulations", icon: FlaskConical },
  { href: "/app/reports", label: "Reports", icon: BarChart3 },
  { href: "/app/settings", label: "Settings", icon: Settings },
  { href: "/app/billing", label: "Billing", icon: CreditCard },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { workspace } = useDemo();
  const plan = workspace?.planId && workspace.planId !== "free" ? PLANS[workspace.planId] : null;

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--bg-charcoal)] lg:flex">
      <div className="flex h-16 items-center gap-2 border-b border-[var(--border)] px-6">
        <Zap className="h-5 w-5 text-[var(--accent-amber)]" />
        <span className="font-display text-lg font-bold">FlowSentinel</span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/app" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-[var(--bg-elevated)] text-[var(--accent-amber)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-[var(--border)] p-4">
        {plan && (
          <div className="rounded-lg bg-[var(--bg-surface)] p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--text-muted)]">Plano</span>
              <Badge variant="warning">{plan.name}</Badge>
            </div>
            <Link
              href="/app/upgrade"
              className="mt-2 flex items-center gap-1 text-xs text-[var(--accent-teal)] hover:underline"
            >
              <Sparkles className="h-3 w-3" />
              Upgrade
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto border-t border-[var(--border)] bg-[var(--bg-charcoal)] p-2 lg:hidden">
      {navItems.slice(0, 5).map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (href !== "/app" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex shrink-0 flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs",
              active ? "text-[var(--accent-amber)]" : "text-[var(--text-muted)]",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
