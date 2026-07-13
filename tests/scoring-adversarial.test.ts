import { describe, expect, it } from "vitest";
import {
  computePassRate,
  computeRegression,
  computeRiskScore,
  computeRunMetrics,
  createSeededRandom,
} from "@/lib/demo/scoring";
import { getScenarioById, listScenarios } from "@/lib/demo/adversarial-scenarios";
import { runAdversarialScenario, runMockSimulation } from "@/lib/demo/simulation-runner";
import { seedDemoData } from "@/lib/demo/seed";

describe("scoring", () => {
  it("computes pass rate from steps vs failures", () => {
    expect(computePassRate(6, 2)).toBe(67);
    expect(computePassRate(3, 0)).toBe(100);
    expect(computePassRate(0, 0)).toBe(0);
  });

  it("weights severity into risk score", () => {
    const low = computeRiskScore(
      [{ id: "1", severity: "low", category: "tone", message: "x", turnIndex: 0, suggestion: "y" }],
      0,
    );
    const critical = computeRiskScore(
      [
        {
          id: "1",
          severity: "critical",
          category: "policy",
          message: "x",
          turnIndex: 0,
          suggestion: "y",
        },
      ],
      0,
    );
    expect(critical).toBeGreaterThan(low);
  });

  it("regression delta is current risk minus baseline", () => {
    const result = computeRegression({ riskScore: 40, passRate: 80 }, { riskScore: 70, passRate: 40 });
    expect(result.delta).toBe(-30);
    expect(result.basis).toBe("risk_score");
  });

  it("seeded random is deterministic", () => {
    const a = createSeededRandom(42);
    const b = createSeededRandom(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });
});

describe("adversarial scenarios", () => {
  it("ships a reproducible refund policy pack", () => {
    const scenarios = listScenarios();
    expect(scenarios.length).toBeGreaterThanOrEqual(5);
    const refund = getScenarioById("adv-refund-policy");
    expect(refund?.failures.some((f) => f.category === "policy")).toBe(true);
  });

  it("vulnerable build fails; guardrail build clears scripted failures", () => {
    localStorage.clear();
    const store = seedDemoData();
    const flow = store.flows.find((f) => f.id === "flow-reclamacao")!;
    const persona = store.personas.find((p) => p.id === "persona-reclamacao")!;
    const scenario = getScenarioById("adv-refund-policy")!;
    const vulnerable = store.agentBuilds.find((b) => b.label === "refund-vulnerable-v2")!;
    const fixed = store.agentBuilds.find((b) => b.label === "refund-guardrail-v3")!;

    const before = runAdversarialScenario({
      scenario,
      flow,
      persona,
      workspaceId: store.workspaces[0]!.id,
      agentBuild: vulnerable,
    });
    const after = runAdversarialScenario({
      scenario,
      flow,
      persona,
      workspaceId: store.workspaces[0]!.id,
      agentBuild: fixed,
      baseline: before,
    });

    expect(before.failures.length).toBeGreaterThan(0);
    expect(after.failures).toHaveLength(0);
    expect(after.regressionDelta).toBe(after.riskScore - before.riskScore);
    expect(after.regressionDelta!).toBeLessThan(0);
  });

  it("probabilistic runner is stable for the same seed", () => {
    localStorage.clear();
    const store = seedDemoData();
    const flow = store.flows.find((f) => f.id === "flow-pedido-pizza")!;
    const persona = store.personas.find((p) => p.id === "persona-indeciso")!;
    const a = runMockSimulation({
      flow,
      persona,
      workspaceId: "ws",
      seed: 12345,
    });
    const b = runMockSimulation({
      flow,
      persona,
      workspaceId: "ws",
      seed: 12345,
    });
    expect(a.riskScore).toBe(b.riskScore);
    expect(a.passRate).toBe(b.passRate);
    expect(a.failures.length).toBe(b.failures.length);
  });

  it("seed metrics match scoring helpers", () => {
    localStorage.clear();
    const store = seedDemoData();
    const sim = store.simulations.find((s) => s.id === "sim-reclamacao-v2")!;
    const metrics = computeRunMetrics({
      stepCount: 3,
      failures: sim.failures,
      aggressionLevel: 9,
    });
    expect(sim.riskScore).toBe(metrics.riskScore);
    expect(sim.passRate).toBe(metrics.passRate);
  });
});
