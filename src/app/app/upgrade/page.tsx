"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useDemo } from "@/lib/demo/provider";
import { PLANS } from "@/lib/billing/plans";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function UpgradePage() {
  const { workspace, store } = useDemo();
  const [loading, setLoading] = useState<string | null>(null);

  async function checkout(planId: "starter" | "pro" | "business") {
    setLoading(planId);
    const res = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        planId,
        workspaceId: workspace?.id ?? "ws-demo",
        email: store.session?.email ?? "demo@example.com",
      }),
    });
    const data = (await res.json()) as { url?: string; error?: string };
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(data.error ?? "Erro ao iniciar checkout");
    }
    setLoading(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Upgrade</h1>
        <p className="text-[var(--text-secondary)]">Escolha o plano ideal para seu volume</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {Object.values(PLANS).map((plan) => (
          <Card
            key={plan.id}
            className={cn(
              "flex flex-col",
              plan.highlighted && "border-[var(--accent-amber)] ring-1 ring-[var(--accent-amber)]/30",
              workspace?.planId === plan.id && "ring-2 ring-[var(--accent-teal)]",
            )}
          >
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <p className="font-display text-3xl font-bold">{plan.priceLabel}</p>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                    <Check className="mt-0.5 h-4 w-4 text-[var(--accent-teal)]" />
                    {f}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={plan.highlighted ? "default" : "secondary"}
                disabled={loading === plan.id || workspace?.planId === plan.id}
                onClick={() => checkout(plan.id as "starter" | "pro" | "business")}
              >
                {workspace?.planId === plan.id
                  ? "Plano atual"
                  : loading === plan.id
                    ? "Redirecionando..."
                    : plan.contactSales
                      ? "Falar com vendas"
                      : "Assinar"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
