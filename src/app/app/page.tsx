"use client";

import Link from "next/link";
import { AlertTriangle, FlaskConical, GitBranch, TrendingDown, TrendingUp } from "lucide-react";
import { useDemo } from "@/lib/demo/provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { getUsagePercent } from "@/lib/billing/entitlements";
import { getPlanLimits } from "@/lib/billing/plans";

export default function DashboardPage() {
  const { store, workspace } = useDemo();
  const wsId = workspace?.id;
  const flows = store.flows.filter((f) => f.workspaceId === wsId);
  const sims = store.simulations.filter((s) => s.workspaceId === wsId);
  const limits = workspace ? getPlanLimits(workspace.planId) : null;
  const avgRisk = sims.length
    ? Math.round(sims.reduce((a, s) => a + s.riskScore, 0) / sims.length)
    : 0;
  const criticalFailures = sims.reduce(
    (a, s) => a + s.failures.filter((f) => f.severity === "critical" || f.severity === "high").length,
    0,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Dashboard</h1>
        <p className="text-[var(--text-secondary)]">Visão geral do QA lab — {workspace?.name}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Fluxos ativos", value: flows.filter((f) => f.isActive).length, icon: GitBranch },
          { label: "Simulações", value: sims.length, icon: FlaskConical },
          { label: "Risk médio", value: avgRisk, icon: AlertTriangle, badge: true },
          { label: "Falhas altas", value: criticalFailures, icon: AlertTriangle },
        ].map(({ label, value, icon: Icon, badge }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg bg-[var(--bg-elevated)] p-3">
                <Icon className="h-5 w-5 text-[var(--accent-amber)]" />
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)]">{label}</p>
                {badge ? <RiskBadge score={value} /> : <p className="font-display text-2xl font-bold">{value}</p>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {limits && workspace && (
        <Card>
          <CardHeader>
            <CardTitle>Uso do plano</CardTitle>
            <CardDescription>
              {workspace.simulationsThisMonth} / {limits.simulationsPerMonth === Infinity ? "∞" : limits.simulationsPerMonth} simulações este mês
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--bg-elevated)]">
              <div
                className="h-full rounded-full bg-[var(--accent-amber)] transition-all"
                style={{
                  width: `${getUsagePercent(workspace.simulationsThisMonth, limits.simulationsPerMonth)}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Simulações recentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sims.slice(0, 5).map((sim) => {
              const flow = flows.find((f) => f.id === sim.flowId);
              return (
                <Link
                  key={sim.id}
                  href={`/app/simulations/${sim.id}`}
                  className="flex items-center justify-between rounded-lg border border-[var(--border)] p-3 hover:bg-[var(--bg-elevated)]"
                >
                  <div>
                    <p className="text-sm font-medium">{flow?.name ?? sim.flowId}</p>
                    <p className="text-xs text-[var(--text-muted)]">{formatDate(sim.startedAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {sim.regressionDelta !== undefined && (
                      <span
                        className={`flex items-center text-xs ${
                          sim.regressionDelta > 0 ? "text-[var(--risk-critical)]" : "text-[var(--success)]"
                        }`}
                      >
                        {sim.regressionDelta > 0 ? (
                          <TrendingUp className="mr-1 h-3 w-3" />
                        ) : (
                          <TrendingDown className="mr-1 h-3 w-3" />
                        )}
                        {Math.abs(sim.regressionDelta)}%
                      </span>
                    )}
                    <RiskBadge score={sim.riskScore} />
                  </div>
                </Link>
              );
            })}
            {sims.length === 0 && (
              <p className="text-sm text-[var(--text-muted)]">Nenhuma simulação ainda.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ranking de risco por flow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {flows
              .map((flow) => {
                const flowSims = sims.filter((s) => s.flowId === flow.id);
                const avg = flowSims.length
                  ? Math.round(flowSims.reduce((a, s) => a + s.riskScore, 0) / flowSims.length)
                  : 0;
                return { flow, avg, count: flowSims.length };
              })
              .sort((a, b) => b.avg - a.avg)
              .map(({ flow, avg, count }) => (
                <Link
                  key={flow.id}
                  href={`/app/flows/${flow.id}`}
                  className="flex items-center justify-between rounded-lg border border-[var(--border)] p-3 hover:bg-[var(--bg-elevated)]"
                >
                  <div>
                    <p className="text-sm font-medium">{flow.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">v{flow.version} · {count} sims</p>
                  </div>
                  <RiskBadge score={avg} />
                </Link>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
