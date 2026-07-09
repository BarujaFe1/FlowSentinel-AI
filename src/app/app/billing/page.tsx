"use client";

import Link from "next/link";
import { useDemo } from "@/lib/demo/provider";
import { PLANS } from "@/lib/billing/plans";
import { getUsagePercent } from "@/lib/billing/entitlements";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BillingPage() {
  const { workspace, store } = useDemo();
  const plan = workspace?.planId && workspace.planId !== "free" ? PLANS[workspace.planId] : null;

  async function openPortal() {
    const res = await fetch("/api/billing/portal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId: "demo_customer", returnUrl: window.location.href }),
    });
    const data = (await res.json()) as { url?: string };
    if (data.url) window.location.href = data.url;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Billing</h1>
        <p className="text-[var(--text-secondary)]">Plano e uso do workspace</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Plano atual
            {plan && <Badge variant="warning">{plan.name}</Badge>}
          </CardTitle>
          <CardDescription>{plan?.priceLabel ?? "Free tier"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {plan && (
            <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
              {plan.features.map((f) => (
                <li key={f}>✓ {f}</li>
              ))}
            </ul>
          )}
          <div className="flex gap-2">
            <Link href="/app/upgrade">
              <Button>Upgrade</Button>
            </Link>
            <Button variant="secondary" onClick={openPortal}>
              Gerenciar assinatura
            </Button>
          </div>
        </CardContent>
      </Card>

      {plan && workspace && (
        <Card>
          <CardHeader>
            <CardTitle>Uso</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Simulações: {workspace.simulationsThisMonth} /{" "}
              {plan.limits.simulationsPerMonth === Infinity ? "∞" : plan.limits.simulationsPerMonth}
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--bg-elevated)]">
              <div
                className="h-full bg-[var(--accent-amber)]"
                style={{
                  width: `${getUsagePercent(workspace.simulationsThisMonth, plan.limits.simulationsPerMonth)}%`,
                }}
              />
            </div>
            <p className="mt-4 text-xs text-[var(--text-muted)]">
              Modo demo — billing via mock provider. E-mail: {store.session?.email}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
