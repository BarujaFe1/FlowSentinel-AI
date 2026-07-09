"use client";

import Link from "next/link";
import { useState } from "react";
import { FlaskConical, Play } from "lucide-react";
import { useDemo } from "@/lib/demo/provider";
import { runMockSimulation } from "@/lib/demo/simulation-runner";
import { checkEntitlement } from "@/lib/billing/entitlements";
import { Button } from "@/components/ui/button";
import { Badge, RiskBadge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";

export default function SimulationsPage() {
  const { store, workspace, addSimulation } = useDemo();
  const [flowId, setFlowId] = useState("");
  const [personaId, setPersonaId] = useState("");
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  const flows = store.flows.filter((f) => f.workspaceId === workspace?.id);
  const personas = store.personas.filter((p) => p.workspaceId === workspace?.id);
  const sims = store.simulations.filter((s) => s.workspaceId === workspace?.id);

  async function runSimulation() {
    if (!workspace || !flowId || !personaId) {
      setError("Selecione flow e persona");
      return;
    }
    const check = checkEntitlement(workspace.planId, {
      workspaces: store.workspaces.length,
      users: store.users.length,
      activeFlows: flows.filter((f) => f.isActive).length,
      simulationsThisMonth: workspace.simulationsThisMonth,
    }, "run_simulation");
    if (!check.allowed) {
      setError(check.reason ?? "Limite atingido");
      return;
    }
    setError("");
    setRunning(true);
    const flow = flows.find((f) => f.id === flowId)!;
    const persona = personas.find((p) => p.id === personaId)!;
    await new Promise((r) => setTimeout(r, 800));
    const result = runMockSimulation({ flow, persona, workspaceId: workspace.id });
    addSimulation(result);
    setRunning(false);
    window.location.href = `/app/simulations/${result.id}`;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Simulations</h1>
        <p className="text-[var(--text-secondary)]">Execute e analise simulações de conversa</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold">Nova simulação</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Flow</Label>
              <Select value={flowId} onChange={(e) => setFlowId(e.target.value)}>
                <option value="">Selecione...</option>
                {flows.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} (v{f.version})
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Persona</Label>
              <Select value={personaId} onChange={(e) => setPersonaId(e.target.value)}>
                <option value="">Selecione...</option>
                {personas.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          {error && <p className="mt-2 text-sm text-[var(--risk-critical)]">{error}</p>}
          <Button onClick={runSimulation} disabled={running} className="mt-4 gap-2">
            <Play className="h-4 w-4" />
            {running ? "Executando..." : "Executar simulação"}
          </Button>
        </CardContent>
      </Card>

      {sims.length === 0 ? (
        <EmptyState
          icon={<FlaskConical className="h-12 w-12" />}
          title="Nenhuma simulação"
          description="Execute sua primeira simulação para ver risk score e replay."
        />
      ) : (
        <div className="space-y-3">
          {sims.map((sim) => {
            const flow = flows.find((f) => f.id === sim.flowId);
            const persona = personas.find((p) => p.id === sim.personaId);
            return (
              <Link key={sim.id} href={`/app/simulations/${sim.id}`}>
                <Card className="transition-colors hover:border-[var(--accent-amber)]/30">
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">{flow?.name ?? sim.flowId}</p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {persona?.name} · v{sim.flowVersion} · {formatDate(sim.startedAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="success">{sim.passRate}% pass</Badge>
                      <RiskBadge score={sim.riskScore} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
