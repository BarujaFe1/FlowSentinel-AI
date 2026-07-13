"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { useDemo } from "@/lib/demo/provider";
import { getScenarioById } from "@/lib/demo/adversarial-scenarios";
import { Button } from "@/components/ui/button";
import { Badge, RiskBadge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { FailureHeatmap } from "@/components/app/failure-heatmap";
import { ConversationReplay } from "@/components/app/conversation-replay";

export default function SimulationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { store, hydrated } = useDemo();
  const sim = store.simulations.find((s) => s.id === id);
  const flow = sim ? store.flows.find((f) => f.id === sim.flowId) : null;
  const persona = sim ? store.personas.find((p) => p.id === sim.personaId) : null;
  const build = sim ? store.agentBuilds.find((b) => b.id === sim.agentBuildId) : null;
  const scenario = sim?.scenarioId ? getScenarioById(sim.scenarioId) : null;
  const baseline = sim?.baselineSimulationId
    ? store.simulations.find((s) => s.id === sim.baselineSimulationId)
    : null;

  if (!hydrated) {
    return (
      <div className="space-y-4" aria-busy="true">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!sim) {
    return (
      <EmptyState
        title="Simulação não encontrada"
        description="Esta simulação pode ter sido removida."
        actionLabel="Voltar"
        onAction={() => router.push("/app/simulations")}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/app/simulations">
          <Button variant="ghost" size="sm" aria-label="Voltar">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold">{flow?.name ?? "Simulação"}</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            {persona?.name} · {build?.label ?? `flow v${sim.flowVersion}`} · {formatDate(sim.startedAt)}
          </p>
          {scenario && (
            <p className="mt-1 text-xs text-[var(--accent-teal)]">
              Cenário: {scenario.name} ({scenario.kind})
            </p>
          )}
        </div>
        <RiskBadge score={sim.riskScore} />
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Pass rate", value: `${sim.passRate}%` },
          { label: "Turns", value: sim.totalTurns },
          { label: "Falhas", value: sim.failures.length },
          {
            label: "Δ risco vs baseline",
            value:
              sim.regressionDelta !== undefined
                ? `${sim.regressionDelta > 0 ? "+" : ""}${sim.regressionDelta}`
                : "—",
          },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardContent className="p-4 text-center">
              <p className="text-xs text-[var(--text-muted)]">{label}</p>
              <p className="font-display text-xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {sim.regressionLabel && (
        <p className="text-sm text-[var(--text-secondary)]">
          {sim.regressionLabel}
          {baseline ? (
            <>
              {" "}
              (
              <Link
                href={`/app/simulations/${baseline.id}`}
                className="text-[var(--accent-teal)] hover:underline"
              >
                ver baseline
              </Link>
              )
            </>
          ) : null}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Replay</CardTitle>
          </CardHeader>
          <CardContent>
            <ConversationReplay messages={sim.messages} />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Heatmap de peso de risco</CardTitle>
            </CardHeader>
            <CardContent>
              <FailureHeatmap
                values={sim.heatmap}
                steps={flow?.steps.map((s) => s.trigger) ?? []}
              />
              <p className="mt-2 text-xs text-[var(--text-muted)]">
                Valores = peso de risco do passo × agressividade da persona (não é taxa empírica de
                falha em produção).
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-[var(--risk-critical)]" />
                Falhas ({sim.failures.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sim.failures.map((f) => (
                <div key={f.id} className="rounded-lg border border-[var(--border)] p-3">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        f.severity === "critical" || f.severity === "high"
                          ? "danger"
                          : f.severity === "medium"
                            ? "warning"
                            : "default"
                      }
                    >
                      {f.severity}
                    </Badge>
                    <span className="text-xs text-[var(--text-muted)]">{f.category}</span>
                  </div>
                  <p className="mt-2 text-sm">{f.message}</p>
                  <p className="mt-1 text-xs text-[var(--accent-teal)]">{f.suggestion}</p>
                </div>
              ))}
              {sim.failures.length === 0 && (
                <p className="text-sm text-[var(--text-muted)]">Nenhuma falha detectada neste build.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
