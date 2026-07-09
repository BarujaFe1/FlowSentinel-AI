import Link from "next/link";
import { Check } from "lucide-react";
import { MarketingNav, MarketingFooter } from "@/components/layout/marketing-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PLANS } from "@/lib/billing/plans";
import { cn } from "@/lib/utils";

export const metadata = { title: "Pricing" };

export default function PricingPage() {
  const plans = Object.values(PLANS);

  return (
    <div className="min-h-screen bg-[var(--bg-ink)]">
      <MarketingNav />
      <main className="mx-auto max-w-6xl px-4 pt-28 pb-16 sm:px-6">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold">Planos simples, em Reais</h1>
          <p className="mt-4 text-[var(--text-secondary)]">
            Comece grátis. Escale conforme seu volume de simulações.
          </p>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={cn(
                "relative flex flex-col",
                plan.highlighted && "border-[var(--accent-amber)] ring-1 ring-[var(--accent-amber)]/30",
              )}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--accent-amber)] px-3 py-0.5 text-xs font-semibold text-[var(--bg-ink)]">
                  Mais popular
                </span>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <p className="font-display mt-4 text-3xl font-bold">{plan.priceLabel}</p>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-teal)]" />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link href={plan.contactSales ? "/app/upgrade" : `/signup?plan=${plan.id}`} className="w-full">
                  <Button variant={plan.highlighted ? "default" : "secondary"} className="w-full">
                    {plan.contactSales ? "Falar com vendas" : "Começar"}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
