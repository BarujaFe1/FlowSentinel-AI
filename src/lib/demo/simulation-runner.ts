import type {
  ConversationMessage,
  Flow,
  Persona,
  SimulationFailure,
  SimulationRun,
} from "@/lib/types";

interface RunSimulationParams {
  flow: Flow;
  persona: Persona;
  workspaceId: string;
}

const AGENT_RESPONSES = [
  "Entendi! Posso ajudar com isso.",
  "Claro, vou verificar para você.",
  "Perfeito, anotado!",
  "Deixe-me confirmar os detalhes.",
];

const FAILURE_CATEGORIES = ["tone", "missing_info", "policy", "empathy", "hallucination"] as const;

export function runMockSimulation(params: RunSimulationParams): SimulationRun {
  const { flow, persona, workspaceId } = params;
  const now = new Date();
  const messages: ConversationMessage[] = [];
  const failures: SimulationFailure[] = [];
  const heatmap: number[] = [];

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

    const shouldFail = Math.random() < riskFactor * 0.6;
    const agentContent = shouldFail
      ? "Desculpe, não entendi. Pode repetir?"
      : AGENT_RESPONSES[index % AGENT_RESPONSES.length] + ` (${step.expectedResponse.slice(0, 40)}...)`;

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
        id: `fail-${index}-${Date.now()}`,
        stepId: step.id,
        severity: riskFactor > 0.4 ? "high" : riskFactor > 0.25 ? "medium" : "low",
        category: FAILURE_CATEGORIES[index % FAILURE_CATEGORIES.length],
        message: `Falha no passo "${step.trigger}": resposta não atende expectativa`,
        turnIndex: index * 2 + 1,
        suggestion: `Revisar prompt para: ${step.expectedResponse}`,
      });
    }
  });

  const passRate = Math.round(((flow.steps.length - failures.length) / flow.steps.length) * 100);
  const riskScore = Math.min(100, Math.round(failures.length * 15 + persona.aggressionLevel * 3));

  return {
    id: `sim-${Date.now()}`,
    workspaceId,
    flowId: flow.id,
    flowVersion: flow.version,
    personaId: persona.id,
    status: "completed",
    riskScore,
    passRate,
    totalTurns: messages.length,
    failures,
    messages,
    heatmap,
    startedAt: now.toISOString(),
    completedAt: new Date(now.getTime() + flow.steps.length * 7000).toISOString(),
    regressionDelta: Math.round((Math.random() - 0.5) * 20),
  };
}
