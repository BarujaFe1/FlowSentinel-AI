import type {
  AgentBuild,
  ConversationMessage,
  Flow,
  Persona,
  SimulationFailure,
  SimulationRun,
} from "@/lib/types";
import type { AdversarialScenario } from "@/lib/demo/adversarial-scenarios";
import {
  computeRegression,
  computeRunMetrics,
  createSeededRandom,
  hashStringToSeed,
} from "@/lib/demo/scoring";

interface RunSimulationParams {
  flow: Flow;
  persona: Persona;
  workspaceId: string;
  /** Optional deterministic seed; defaults to hash of flow+persona+time bucket. */
  seed?: number;
  agentBuild?: AgentBuild | null;
  baseline?: Pick<SimulationRun, "id" | "riskScore" | "passRate"> | null;
  scenarioId?: string;
}

const AGENT_RESPONSES = [
  "Entendi! Posso ajudar com isso.",
  "Claro, vou verificar para você.",
  "Perfeito, anotado!",
  "Deixe-me confirmar os detalhes.",
];

const FAILURE_CATEGORIES = ["tone", "missing_info", "policy", "empathy", "hallucination"] as const;

function attachRegression(
  run: Omit<SimulationRun, "regressionDelta" | "regressionLabel" | "baselineSimulationId">,
  baseline: RunSimulationParams["baseline"],
): SimulationRun {
  const regression = computeRegression(
    { passRate: run.passRate, riskScore: run.riskScore },
    baseline
      ? { passRate: baseline.passRate, riskScore: baseline.riskScore }
      : null,
  );
  return {
    ...run,
    regressionDelta: regression.delta,
    regressionLabel: regression.label,
    baselineSimulationId: baseline?.id,
  };
}

/**
 * Probabilistic lab runner (seeded RNG). Not an LLM. Not WhatsApp.
 */
export function runMockSimulation(params: RunSimulationParams): SimulationRun {
  const { flow, persona, workspaceId, agentBuild, baseline } = params;
  const now = new Date();
  const messages: ConversationMessage[] = [];
  const failures: SimulationFailure[] = [];
  const heatmap: number[] = [];

  const seed =
    params.seed ??
    hashStringToSeed(`${flow.id}:${flow.version}:${persona.id}:${agentBuild?.label ?? "default"}`);
  const random = createSeededRandom(seed);

  flow.steps.forEach((step, index) => {
    const userMsg: ConversationMessage = {
      id: `msg-u-${index}`,
      role: "user",
      content: persona.sampleMessages[index % persona.sampleMessages.length] ?? step.trigger,
      timestamp: new Date(now.getTime() + index * 5000).toISOString(),
    };
    messages.push(userMsg);

    const riskFactor = step.riskWeight * (persona.aggressionLevel / 10);
    heatmap.push(riskFactor);

    const shouldFail = random() < riskFactor * 0.6;
    const agentContent = shouldFail
      ? "Desculpe, não entendi. Pode repetir?"
      : AGENT_RESPONSES[index % AGENT_RESPONSES.length] +
        ` (${step.expectedResponse.slice(0, 40)}...)`;

    const agentMsg: ConversationMessage = {
      id: `msg-a-${index}`,
      role: "agent",
      content: agentContent,
      timestamp: new Date(now.getTime() + index * 5000 + 2000).toISOString(),
      flagged: shouldFail,
      failureReason: shouldFail ? "Resposta inadequada ao contexto" : undefined,
    };
    messages.push(agentMsg);

    if (shouldFail) {
      failures.push({
        id: `fail-${index}-${seed}`,
        stepId: step.id,
        severity: riskFactor > 0.4 ? "high" : riskFactor > 0.25 ? "medium" : "low",
        category: FAILURE_CATEGORIES[index % FAILURE_CATEGORIES.length],
        message: `Falha no passo "${step.trigger}": resposta não atende expectativa`,
        turnIndex: index * 2 + 1,
        suggestion: `Revisar prompt para: ${step.expectedResponse}`,
      });
    }
  });

  const metrics = computeRunMetrics({
    stepCount: flow.steps.length,
    failures,
    aggressionLevel: persona.aggressionLevel,
  });

  return attachRegression(
    {
      id: `sim-${seed}-${Date.now()}`,
      workspaceId,
      flowId: flow.id,
      flowVersion: flow.version,
      personaId: persona.id,
      status: "completed",
      riskScore: metrics.riskScore,
      passRate: metrics.passRate,
      totalTurns: messages.length,
      failures,
      messages,
      heatmap,
      startedAt: now.toISOString(),
      completedAt: new Date(now.getTime() + flow.steps.length * 7000).toISOString(),
      scenarioId: params.scenarioId,
      agentBuildId: agentBuild?.id,
    },
    baseline,
  );
}

export interface RunAdversarialParams {
  scenario: AdversarialScenario;
  flow: Flow;
  persona: Persona;
  workspaceId: string;
  agentBuild?: AgentBuild | null;
  baseline?: Pick<SimulationRun, "id" | "riskScore" | "passRate"> | null;
}

/**
 * Fully scripted adversarial (or happy-path) run — reproducible evidence pack.
 */
export function runAdversarialScenario(params: RunAdversarialParams): SimulationRun {
  const { scenario, flow, persona, workspaceId, agentBuild, baseline } = params;
  const now = new Date();
  const messages: ConversationMessage[] = [];
  const failures: SimulationFailure[] = [];
  const heatmap: number[] = [];

  const isFixed =
    !!agentBuild && scenario.fixedByBuildLabels.includes(agentBuild.label);
  const activeFailures = isFixed ? [] : scenario.failures;
  const failByStep = new Map(activeFailures.map((f) => [f.stepIndex, f]));

  flow.steps.forEach((step, index) => {
    const scripted = failByStep.get(index);
    const riskFactor = step.riskWeight * (persona.aggressionLevel / 10);
    heatmap.push(scripted ? Math.max(riskFactor, 0.55) : riskFactor * (isFixed ? 0.2 : 1));

    const userContent =
      scripted?.userMessage ??
      persona.sampleMessages[index % persona.sampleMessages.length] ??
      step.trigger;

    messages.push({
      id: `adv-u-${scenario.id}-${index}`,
      role: "user",
      content: userContent,
      timestamp: new Date(now.getTime() + index * 5000).toISOString(),
    });

    if (scripted) {
      messages.push({
        id: `adv-a-${scenario.id}-${index}`,
        role: "agent",
        content: scripted.agentReply,
        timestamp: new Date(now.getTime() + index * 5000 + 2000).toISOString(),
        flagged: true,
        failureReason: scripted.message,
      });
      failures.push({
        id: `adv-fail-${scenario.id}-${index}`,
        stepId: step.id,
        severity: scripted.severity,
        category: scripted.category,
        message: scripted.message,
        turnIndex: index * 2 + 1,
        suggestion: scripted.suggestion,
      });
    } else {
      const safeReply = isFixed
        ? `Conforme política do build ${agentBuild?.label}: ${step.expectedResponse.slice(0, 80)}`
        : AGENT_RESPONSES[index % AGENT_RESPONSES.length] +
          ` (${step.expectedResponse.slice(0, 40)}...)`;
      messages.push({
        id: `adv-a-${scenario.id}-${index}`,
        role: "agent",
        content: safeReply,
        timestamp: new Date(now.getTime() + index * 5000 + 2000).toISOString(),
      });
    }
  });

  const metrics = computeRunMetrics({
    stepCount: flow.steps.length,
    failures,
    aggressionLevel: persona.aggressionLevel,
  });

  return attachRegression(
    {
      id: `sim-adv-${scenario.id}-${agentBuild?.label ?? "baseline"}-${Date.now()}`,
      workspaceId,
      flowId: flow.id,
      flowVersion: agentBuild?.version ?? flow.version,
      personaId: persona.id,
      status: "completed",
      riskScore: metrics.riskScore,
      passRate: metrics.passRate,
      totalTurns: messages.length,
      failures,
      messages,
      heatmap,
      startedAt: now.toISOString(),
      completedAt: new Date(now.getTime() + flow.steps.length * 7000).toISOString(),
      scenarioId: scenario.id,
      agentBuildId: agentBuild?.id,
    },
    baseline,
  );
}
