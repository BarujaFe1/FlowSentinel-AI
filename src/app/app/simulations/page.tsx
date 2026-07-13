"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { FlaskConical, Play, ShieldAlert } from "lucide-react";
import { useDemo } from "@/lib/demo/provider";
import { runAdversarialScenario, runMockSimulation } from "@/lib/demo/simulation-runner";
import { listScenarios } from "@/lib/demo/adversarial-scenarios";
import { checkEntitlement } from "@/lib/billing/entitlements";
import { Button } from "@/components/ui/button";
import { Badge, RiskBadge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";

export default function SimulationsPage() {
  const router = useRouter();
  const { store, workspace, addSimulation } = useDemo();
  const scenarios = listScenarios();
  const [flowId, setFlowId] = useState("");
  const [personaId, setPersonaId] = useState("");
  const [scenarioId, setScenarioId] = useState("adv-refund-policy");
  const [buildId, setBuildId] = useState("");
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  const flows = store.flows.filter((f) => f.workspaceId === workspace?.id);
  const personas = store.personas.filter((p) => p.workspaceId === workspace?.id);
  const sims = store.simulations.filter((s) => s.workspaceId === workspace?.id);
  const buildsForFlow = useMemo(
    () => store.agentBuilds.filter((b) => b.flowId === (flowId || scenarios.find((s) => s.id === scenarioId)?.preferredFlowId)),
    [store.agentBuilds, flowId, scenarioId, scenarios],
  );

  function applyScenarioDefaults(nextScenarioId: string) {
    setScenarioId(nextScenarioId);
    const scenario = scenarios.find((s) => s.id === nextScenarioId);
    if (!scenario) return;
    if (flows.some((f) => f.id === scenario.preferredFlowId)) {
      setFlowId(scenario.preferredFlowId);
    }
    if (personas.some((p) => p.id === scenario.preferredPersonaId)) {
      setPersonaId(scenario.preferredPersonaId);
    }
    const builds = store.agentBuilds.filter((b) => b.flowId === scenario.preferredFlowId);
    setBuildId(builds[0]?.id ?? "");
  }

  async function runSimulation() {
    if (!workspace) {
      setError("Workspace não encontrado");
      return;
    }

    const scenario = scenarios.find((s) => s.id === scenarioId);
    const resolvedFlowId = flowId || scenario?.preferredFlowId || "";
    const resolvedPersonaId = personaId || scenario?.preferredPersonaId || "";

    if (!resolvedFlowId || !resolvedPersonaId) {
      setError("Selecione flow e persona");
      return;
    }

    const check = checkEntitlement(
      workspace.planId,
      {
        workspaces: store.workspaces.length,
        users: store.users.length,
        activeFlows: flows.filter((f) => f.isActive).length,
        simulationsThisMonth: workspace.simulationsThisMonth,
      },
      "run_simulation",
    );
    if (!check.allowed) {
      setError(check.reason ?? "Limite atingido");
      return;
    }

    setError("");
    setRunning(true);
    const flow = flows.find((f) => f.id === resolvedFlowId);
    const persona = personas.find((p) => p.id === resolvedPersonaId);
    if (!flow || !persona) {
      setError("Flow ou persona inválidos");
      setRunning(false);
      return;
    }

    const agentBuild =
      store.agentBuilds.find((b) => b.id === buildId) ??
      store.agentBuilds.find((b) => b.flowId === flow.id) ??
      null;

    const baseline =
      sims.find(
        (s) =>
          s.flowId === flow.id &&
          s.scenarioId === scenarioId &&
          s.agentBuildId &&
          s.agentBuildId !== agentBuild?.id,
      ) ??
      sims.find((s) => s.flowId === flow.id && s.id !== undefined && s.flowVersion < flow.version) ??
      null;

    await new Promise((r) => setTimeout(r, 600));

    const result = scenario
      ? runAdversarialScenario({
          scenario,
          flow,
          persona,
          workspaceId: workspace.id,
          agentBuild,
          baseline,
        })
      : runMockSimulation({
          flow,
          persona,
          workspaceId: workspace.id,
          agentBuild,
          baseline,
          scenarioId: scenarioId || undefined,
        });

    addSimulation(result);
    setRunning(false);
    router.push(`/app/simulations/${result.id}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Simulations</h1>
          <p className="text-[var(--text-secondary)]">
            Cenários adversariais reproduzíveis + regressão vs baseline de build
          </p>
        </div>
        <Link href="/app/cases/pre-prod-refund">
          <Button variant="secondary" className="gap-2">
            <ShieldAlert className="h-4 w-4" />
            Case pré-produção
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold">Nova simulação (lab)</h3>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Motor mock/scripted — não é LLM nem WhatsApp ao vivo. Outcomes adversariais são determinísticos.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="scenario">Cenário adversarial</Label>
              <Select
                id="scenario"
                value={scenarioId}
                onChange={(e) => applyScenarioDefaults(e.target.value)}
              >
                {scenarios.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="flow">Flow</Label>
              <Select id="flow" value={flowId} onChange={(e) => setFlowId(e.target.value)}>
                <option value="">Selecione...</option>
                {flows.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} (v{f.version})
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="persona">Persona</Label>
              <Select id="persona" value={personaId} onChange={(e) => setPersonaId(e.target.value)}>
                <option value="">Selecione...</option>
                {personas.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="build">Agent build</Label>
              <Select id="build" value={buildId} onChange={(e) => setBuildId(e.target.value)}>
                <option value="">Build padrão do flow</option>
                {buildsForFlow.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.label} (v{b.version}) — {b.notes.slice(0, 48)}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          {error && <p className="mt-2 text-sm text-[var(--risk-critical)]">{error}</p>}
          <Button onClick={runSimulation} disabled={running} className="mt-4 gap-2">
            <Play className="h-4 w-4" />
            {running ? "Executando..." : "Executar cenário"}
          </Button>
        </CardContent>
      </Card>

      {sims.length === 0 ? (
        <EmptyState
          icon={<FlaskConical className="h-12 w-12" />}
          title="Nenhuma simulação"
          description="Execute um cenário adversarial para gerar evidência de risco."
        />
      ) : (
        <div className="space-y-3">
          {sims.map((sim) => {
            const flow = flows.find((f) => f.id === sim.flowId);
            const persona = personas.find((p) => p.id === sim.personaId);
            const build = store.agentBuilds.find((b) => b.id === sim.agentBuildId);
            return (
              <Link key={sim.id} href={`/app/simulations/${sim.id}`}>
                <Card className="transition-colors hover:border-[var(--accent-amber)]/30">
                  <CardContent className="flex items-center justify-between gap-3 p-4">
                    <div>
                      <p className="font-medium">{flow?.name ?? sim.flowId}</p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {persona?.name} · {build?.label ?? `flow v${sim.flowVersion}`}
                        {sim.scenarioId ? ` · ${sim.scenarioId}` : ""} · {formatDate(sim.startedAt)}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      {sim.regressionDelta !== undefined && (
                        <Badge variant={sim.regressionDelta > 0 ? "danger" : "success"}>
                          Δ risco {sim.regressionDelta > 0 ? "+" : ""}
                          {sim.regressionDelta}
                        </Badge>
                      )}
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
