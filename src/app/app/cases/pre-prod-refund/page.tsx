"use client";

import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { useDemo } from "@/lib/demo/provider";
import { Button } from "@/components/ui/button";
import { Badge, RiskBadge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Portfolio case study: failure caught in lab before a fictional production push.
 * Data is demo/seed — not a live WhatsApp incident.
 */
export default function PreProdRefundCasePage() {
  const { store } = useDemo();
  const before = store.simulations.find((s) => s.id === "sim-reclamacao-v2");
  const after = store.simulations.find((s) => s.id === "sim-reclamacao-v3-fixed");
  const vulnerable = store.agentBuilds.find((b) => b.id === "build-refund-v2-vulnerable");
  const fixed = store.agentBuilds.find((b) => b.id === "build-refund-v3-guard");

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex items-start gap-4">
        <Link href="/app/simulations">
          <Button variant="ghost" size="sm" aria-label="Voltar">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <div className="mb-2 flex items-center gap-2 text-[var(--accent-amber)]">
            <ShieldAlert className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-wide">Case de lab</span>
          </div>
          <h1 className="font-display text-3xl font-bold">
            Reembolso fora de política — detectado antes do “go-live”
          </h1>
          <p className="mt-2 text-[var(--text-secondary)]">
            Evidência reproduzível no cenário adversarial <code>adv-refund-policy</code>. Isto é um
            case de laboratório (seed demo), não um incidente real de WhatsApp em produção.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Problema</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-[var(--text-secondary)]">
          <p>
            No fluxo de reclamação, o build <strong>{vulnerable?.label ?? "refund-vulnerable-v2"}</strong>{" "}
            cede à pressão do cliente e promete reembolso total sem checar política da loja.
          </p>
          <p>
            Em um atendimento real isso vira custo financeiro + inconsistência operacional. No lab,
            o cenário adversarial força essa falha de forma determinística — antes de qualquer
            deploy fictício.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Antes — build vulnerável</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              {before && <RiskBadge score={before.riskScore} />}
              <Badge variant="danger">{before?.failures.length ?? "—"} falhas</Badge>
            </div>
            <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--text-secondary)]">
              {(before?.failures ?? []).map((f) => (
                <li key={f.id}>
                  <span className="text-[var(--text-primary)]">{f.category}</span>: {f.message}
                </li>
              ))}
            </ul>
            {before && (
              <Link href={`/app/simulations/${before.id}`}>
                <Button variant="secondary" size="sm">
                  Abrir replay v2
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Depois — guardrail v3</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              {after && <RiskBadge score={after.riskScore} />}
              {after?.regressionDelta !== undefined && (
                <Badge variant="success">
                  Δ risco {after.regressionDelta > 0 ? "+" : ""}
                  {after.regressionDelta}
                </Badge>
              )}
            </div>
            <p className="text-sm text-[var(--text-secondary)]">
              Build <strong>{fixed?.label ?? "refund-guardrail-v3"}</strong>: recusa reembolso
              automático, oferece reenvio/crédito, escala supervisor.{" "}
              {after?.regressionLabel}
            </p>
            {after && (
              <Link href={`/app/simulations/${after.id}`}>
                <Button variant="secondary" size="sm">
                  Abrir replay v3
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Como reproduzir (3 minutos)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-[var(--text-secondary)]">
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              Em <Link href="/app/simulations" className="text-[var(--accent-teal)] hover:underline">Simulations</Link>,
              escolha o cenário <strong>Pressão de reembolso sem política</strong>.
            </li>
            <li>
              Rode com build <code>refund-vulnerable-v2</code> → observe falha critical de policy.
            </li>
            <li>
              Rode de novo com <code>refund-guardrail-v3</code> → Δ risco negativo vs baseline.
            </li>
            <li>Use o replay + relatório como “evidence pack” de entrevista.</li>
          </ol>
          <p className="pt-2 text-xs text-[var(--text-muted)]">
            Métricas: risk score = severidade das falhas + agressividade da persona; regressão =
            diferença de risk score vs baseline do mesmo cenário — não é telemetria de produção.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
