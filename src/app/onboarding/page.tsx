"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  { id: 1, title: "Workspace criado", desc: "Pizzaria Flow demo carregado" },
  { id: 2, title: "Flows mapeados", desc: "2 fluxos WhatsApp prontos" },
  { id: 3, title: "Personas configuradas", desc: "3 personas de teste" },
  { id: 4, title: "Primeira simulação", desc: "Execute para ver risk score" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);

  function next() {
    if (current < steps.length - 1) {
      setCurrent(current + 1);
    } else {
      router.push("/app");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-ink)] px-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="font-display text-2xl">Bem-vindo ao FlowSentinel</CardTitle>
          <CardDescription>Seu QA lab está quase pronto</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {steps.map((step, i) => (
            <div
              key={step.id}
              className={`flex items-start gap-3 rounded-lg border p-4 transition-colors ${
                i <= current
                  ? "border-[var(--accent-teal)]/30 bg-[var(--accent-teal)]/5"
                  : "border-[var(--border)] opacity-50"
              }`}
            >
              <CheckCircle2
                className={`mt-0.5 h-5 w-5 shrink-0 ${
                  i <= current ? "text-[var(--accent-teal)]" : "text-[var(--text-muted)]"
                }`}
              />
              <div>
                <p className="font-medium">{step.title}</p>
                <p className="text-sm text-[var(--text-secondary)]">{step.desc}</p>
              </div>
            </div>
          ))}
          <Button onClick={next} className="w-full gap-2">
            {current < steps.length - 1 ? "Continuar" : "Ir para o dashboard"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
