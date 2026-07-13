"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useDemo } from "@/lib/demo/provider";
import { PLANS } from "@/lib/billing/plans";
import { getUsagePercent } from "@/lib/billing/entitlements";
import type { PlanId } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const PLAN_IDS: PlanId[] = ["starter", "pro", "business", "free"];

function isPlanId(value: string): value is PlanId {
  return PLAN_IDS.includes(value as PlanId);
}

function BillingContent() {
  const { workspace, store, updateWorkspace } = useDemo();
  const searchParams = useSearchParams();
  const [notice, setNotice] = useState("");
  const plan = workspace?.planId && workspace.planId !== "free" ? PLANS[workspace.planId] : null;

  useEffect(() => {
    if (!workspace) return;
    const success = searchParams.get("success");
    const planParam = searchParams.get("plan");
    if (success === "true" && planParam && isPlanId(planParam) && planParam !== "free") {
      if (workspace.planId !== planParam) {
        updateWorkspace({ ...workspace, planId: planParam });
        setNotice(`Plano mock atualizado para ${planParam} (sem cobrança real).`);
      }
    }
  }, [searchParams, workspace, updateWorkspace]);

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
        <p className="text-[var(--text-secondary)]">Plano e uso do workspace (mock)</p>
      </div>

      {notice && (
        <p
          className="rounded-lg border border-[var(--accent-teal)]/40 bg-[var(--accent-teal)]/10 px-3 py-2 text-sm text-[var(--accent-teal)]"
          role="status"
        >
          {notice}
        </p>
      )}

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

export default function BillingPage() {
  return (
    <Suspense fallback={<Skeleton className="h-40 w-full" />}>
      <BillingContent />
    </Suspense>
  );
}
