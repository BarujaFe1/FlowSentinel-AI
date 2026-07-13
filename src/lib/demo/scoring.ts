import type { FailureSeverity, SimulationFailure } from "@/lib/types";

export interface ScoreInputs {
  stepCount: number;
  failures: SimulationFailure[];
  aggressionLevel: number;
}

export interface RunMetrics {
  passRate: number;
  riskScore: number;
}

export interface RegressionResult {
  /** Positive = worse risk vs baseline (matches existing UI). */
  delta: number | undefined;
  basis: "risk_score" | "none";
  label: string;
}

const SEVERITY_WEIGHT: Record<FailureSeverity, number> = {
  low: 8,
  medium: 12,
  high: 18,
  critical: 25,
};

/** Pass rate = share of flow steps without a failure. */
export function computePassRate(stepCount: number, failureCount: number): number {
  if (stepCount <= 0) return 0;
  const passed = Math.max(0, stepCount - failureCount);
  return Math.round((passed / stepCount) * 100);
}

/**
 * Risk score 0–100.
 * Uses failure severity weights + persona aggression — not Math.random.
 */
export function computeRiskScore(failures: SimulationFailure[], aggressionLevel: number): number {
  const failurePoints = failures.reduce(
    (sum, f) => sum + (SEVERITY_WEIGHT[f.severity] ?? 12),
    0,
  );
  const aggressionPoints = Math.max(0, Math.min(10, aggressionLevel)) * 3;
  return Math.min(100, Math.round(failurePoints + aggressionPoints));
}

export function computeRunMetrics(input: ScoreInputs): RunMetrics {
  return {
    passRate: computePassRate(input.stepCount, input.failures.length),
    riskScore: computeRiskScore(input.failures, input.aggressionLevel),
  };
}

/**
 * Regression vs a prior completed run of the same flow (usually previous agent build).
 * Delta = current.riskScore - baseline.riskScore (positive = regression / worse).
 */
export function computeRegression(
  current: RunMetrics,
  baseline: RunMetrics | null | undefined,
): RegressionResult {
  if (!baseline) {
    return {
      delta: undefined,
      basis: "none",
      label: "Sem baseline — primeira evidência nesta linha de versão",
    };
  }
  const delta = current.riskScore - baseline.riskScore;
  return {
    delta,
    basis: "risk_score",
    label:
      delta > 0
        ? `Regressão: risco +${delta} vs baseline`
        : delta < 0
          ? `Melhora: risco ${delta} vs baseline`
          : "Estável vs baseline (mesmo risk score)",
  };
}

/** Deterministic PRNG for reproducible probabilistic lab runs. */
export function createSeededRandom(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashStringToSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
