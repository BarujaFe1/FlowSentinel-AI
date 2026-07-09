"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { useDemo } from "@/lib/demo/provider";
import { Button } from "@/components/ui/button";
import { Badge, RiskBadge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils";
import { FailureHeatmap } from "@/components/app/failure-heatmap";
import { ConversationReplay } from "@/components/app/conversation-replay";

export default function SimulationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { store } = useDemo();
  const sim = store.simulations.find((s) => s.id === id);
  const flow = sim ? store.flows.find((f) => f.id === sim.flowId) : null;
  const persona = sim ? store.personas.find((p) => p.id === sim.personaId) : null;

  if (!sim) {
    return (
      <EmptyState
        title="Simulação não encontrada"
        description="Esta simulação pode ter sido removida."
        actionLabel="Voltar"
        onAction={() => (window.location.href = "/app/simulations")}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/app/simulations">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold">{flow?.name ?? "Simulação"}</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            {persona?.name} · v{sim.flowVersion} · {formatDate(sim.startedAt)}
          </p>
        </div>
        <RiskBadge score={sim.riskScore} />
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Pass rate", value: `${sim.passRate}%` },
          { label: "Turns", value: sim.totalTurns },
          { label: "Falhas", value: sim.failures.length },
          {
            label: "Regressão",
            value: sim.regressionDelta !== undefined ? `${sim.regressionDelta > 0 ? "+" : ""}${sim.regressionDelta}%` : "—",
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
              <CardTitle>Failure Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
              <FailureHeatmap values={sim.heatmap} steps={flow?.steps.map((s) => s.trigger) ?? []} />
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
                  <p className="mt-1 text-xs text-[var(--accent-teal)]">💡 {f.suggestion}</p>
                </div>
              ))}
              {sim.failures.length === 0 && (
                <p className="text-sm text-[var(--text-muted)]">Nenhuma falha detectada.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
