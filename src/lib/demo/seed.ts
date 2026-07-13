import type { AgentBuild, Flow, Persona, SimulationRun, User, Workspace } from "@/lib/types";
import type { DemoStore } from "@/lib/demo/store";
import { getDemoStore, hasDemoStore, saveDemoStore } from "./store";
import { computePassRate, computeRegression, computeRiskScore } from "./scoring";

const DEMO_USER: User = {
  id: "user-demo-felipe",
  email: "demo@pizzariaflow.com.br",
  name: "Felipe Demo",
  createdAt: "2026-01-15T10:00:00.000Z",
};

const DEMO_WORKSPACE: Workspace = {
  id: "ws-pizzaria-flow",
  name: "Pizzaria Flow",
  slug: "pizzaria-flow",
  planId: "pro",
  ownerId: DEMO_USER.id,
  memberIds: [DEMO_USER.id],
  simulationsThisMonth: 12,
  billingPeriodStart: "2026-07-01T00:00:00.000Z",
  createdAt: "2026-01-15T10:00:00.000Z",
};

const DEMO_FLOWS: Flow[] = [
  {
    id: "flow-pedido-pizza",
    workspaceId: DEMO_WORKSPACE.id,
    name: "Pedido de Pizza WhatsApp",
    description: "Fluxo principal de pedidos via WhatsApp com upsell de borda recheada.",
    channel: "whatsapp",
    isActive: true,
    version: 3,
    tags: ["pedido", "whatsapp", "core"],
    createdAt: "2026-02-01T08:00:00.000Z",
    updatedAt: "2026-07-05T14:30:00.000Z",
    steps: [
      {
        id: "step-greeting",
        order: 1,
        trigger: "Cliente inicia conversa",
        expectedResponse: "Cumprimentar e perguntar se é pedido ou rastreamento",
        riskWeight: 0.1,
      },
      {
        id: "step-menu",
        order: 2,
        trigger: "Cliente pede cardápio",
        expectedResponse: "Enviar cardápio resumido com tamanhos e sabores populares",
        riskWeight: 0.2,
      },
      {
        id: "step-size",
        order: 3,
        trigger: "Cliente escolhe sabor",
        expectedResponse: "Confirmar tamanho (P/M/G/GG) e perguntar borda",
        riskWeight: 0.25,
      },
      {
        id: "step-address",
        order: 4,
        trigger: "Cliente confirma pizza",
        expectedResponse: "Solicitar endereço completo com referência",
        riskWeight: 0.3,
      },
      {
        id: "step-payment",
        order: 5,
        trigger: "Endereço informado",
        expectedResponse: "Confirmar forma de pagamento e tempo estimado",
        riskWeight: 0.35,
      },
      {
        id: "step-closing",
        order: 6,
        trigger: "Pagamento confirmado",
        expectedResponse: "Resumo do pedido + número do pedido + agradecimento",
        riskWeight: 0.15,
      },
    ],
  },
  {
    id: "flow-reclamacao",
    workspaceId: DEMO_WORKSPACE.id,
    name: "Reclamação e Reembolso",
    description: "Tratamento de pedidos errados, atrasos e solicitações de reembolso.",
    channel: "whatsapp",
    isActive: true,
    version: 3,
    tags: ["suporte", "reclamação"],
    createdAt: "2026-03-10T09:00:00.000Z",
    updatedAt: "2026-07-01T11:00:00.000Z",
    steps: [
      {
        id: "step-empathy",
        order: 1,
        trigger: "Cliente reclama",
        expectedResponse: "Demonstrar empatia e pedir número do pedido",
        riskWeight: 0.4,
      },
      {
        id: "step-verify",
        order: 2,
        trigger: "Número informado",
        expectedResponse: "Verificar status e confirmar problema",
        riskWeight: 0.35,
      },
      {
        id: "step-resolve",
        order: 3,
        trigger: "Problema confirmado",
        expectedResponse: "Oferecer reenvio, crédito ou reembolso conforme política",
        riskWeight: 0.5,
      },
    ],
  },
];

const DEMO_PERSONAS: Persona[] = [
  {
    id: "persona-ansioso",
    workspaceId: DEMO_WORKSPACE.id,
    name: "Cliente Ansioso",
    description: "Quer resposta rápida, fica impaciente com demora.",
    traits: ["impaciente", "direto", "urgente"],
    sampleMessages: ["Cadê meu pedido?", "Já faz 40 min!", "Quero falar com humano"],
    aggressionLevel: 7,
    createdAt: "2026-02-05T10:00:00.000Z",
  },
  {
    id: "persona-indeciso",
    workspaceId: DEMO_WORKSPACE.id,
    name: "Cliente Indeciso",
    description: "Muda de ideia várias vezes antes de fechar pedido.",
    traits: ["curioso", "comparador", "mudança de ideia"],
    sampleMessages: ["Qual a diferença entre M e G?", "Tem vegana?", "Na verdade quero calabresa"],
    aggressionLevel: 3,
    createdAt: "2026-02-05T10:00:00.000Z",
  },
  {
    id: "persona-reclamacao",
    workspaceId: DEMO_WORKSPACE.id,
    name: "Cliente Reclamão",
    description: "Testa limites do agente com reclamações agressivas.",
    traits: ["crítico", "exigente", "ameaça chargeback"],
    sampleMessages: ["Pizza veio fria!", "Quero reembolso agora", "Vou no Procon"],
    aggressionLevel: 9,
    createdAt: "2026-02-05T10:00:00.000Z",
  },
];

const DEMO_AGENT_BUILDS: AgentBuild[] = [
  {
    id: "build-refund-v2-vulnerable",
    workspaceId: DEMO_WORKSPACE.id,
    flowId: "flow-reclamacao",
    version: 2,
    label: "refund-vulnerable-v2",
    notes: "Sem guardrail de política — agente cede a pressão de reembolso total.",
    createdAt: "2026-06-20T10:00:00.000Z",
  },
  {
    id: "build-refund-v3-guard",
    workspaceId: DEMO_WORKSPACE.id,
    flowId: "flow-reclamacao",
    version: 3,
    label: "refund-guardrail-v3",
    notes: "Guardrail: só crédito/reenvio até supervisor; sem reembolso automático.",
    createdAt: "2026-07-01T10:00:00.000Z",
  },
  {
    id: "build-pedido-v3",
    workspaceId: DEMO_WORKSPACE.id,
    flowId: "flow-pedido-pizza",
    version: 3,
    label: "pedido-baseline-v3",
    notes: "Build atual do fluxo de pedido (lab).",
    createdAt: "2026-06-15T10:00:00.000Z",
  },
];

function withComputedMetrics(
  sim: Omit<SimulationRun, "riskScore" | "passRate" | "regressionDelta" | "regressionLabel"> & {
    stepCount: number;
    aggressionLevel: number;
    baseline?: Pick<SimulationRun, "id" | "riskScore" | "passRate"> | null;
  },
): SimulationRun {
  const { stepCount, aggressionLevel, baseline, ...rest } = sim;
  const riskScore = computeRiskScore(rest.failures, aggressionLevel);
  const passRate = computePassRate(stepCount, rest.failures.length);
  const regression = computeRegression({ riskScore, passRate }, baseline ?? null);
  return {
    ...rest,
    riskScore,
    passRate,
    regressionDelta: regression.delta,
    regressionLabel: regression.label,
    baselineSimulationId: baseline?.id,
  };
}

const DEMO_SIM_PEDIDO = withComputedMetrics({
  id: "sim-pedido-v3",
  workspaceId: DEMO_WORKSPACE.id,
  flowId: "flow-pedido-pizza",
  flowVersion: 3,
  personaId: "persona-indeciso",
  status: "completed",
  totalTurns: 12,
  startedAt: "2026-07-08T15:00:00.000Z",
  completedAt: "2026-07-08T15:02:30.000Z",
  heatmap: [0.1, 0.2, 0.15, 0.45, 0.3, 0.1],
  scenarioId: "adv-happy-pedido",
  agentBuildId: "build-pedido-v3",
  stepCount: 6,
  aggressionLevel: 3,
  failures: [
    {
      id: "fail-1",
      stepId: "step-address",
      severity: "medium",
      category: "missing_info",
      message: "Agente não pediu ponto de referência do endereço",
      turnIndex: 7,
      suggestion: "Adicionar pergunta explícita sobre referência após CEP/endereço",
    },
    {
      id: "fail-2",
      stepId: "step-payment",
      severity: "low",
      category: "tone",
      message: "Tom muito formal para persona casual",
      turnIndex: 9,
      suggestion: "Ajustar prompt para linguagem mais amigável",
    },
  ],
  messages: [
    { id: "m1", role: "user", content: "Oi, quero pedir uma pizza", timestamp: "2026-07-08T15:00:05.000Z" },
    { id: "m2", role: "agent", content: "Olá! Bem-vindo à Pizzaria Flow! Posso ajudar com seu pedido?", timestamp: "2026-07-08T15:00:08.000Z" },
    { id: "m3", role: "user", content: "Quais sabores vocês tem?", timestamp: "2026-07-08T15:00:15.000Z" },
    { id: "m4", role: "agent", content: "Temos calabresa, marguerita, 4 queijos, frango catupiry e pepperoni. Qual prefere?", timestamp: "2026-07-08T15:00:20.000Z" },
    { id: "m5", role: "user", content: "Hmm, calabresa. Mas qual a diferença entre M e G?", timestamp: "2026-07-08T15:00:30.000Z" },
    { id: "m6", role: "agent", content: "M tem 6 fatias (30cm), G tem 8 fatias (35cm). Recomendo G para 2-3 pessoas!", timestamp: "2026-07-08T15:00:35.000Z" },
    { id: "m7", role: "user", content: "Ok, G então. Quanto fica?", timestamp: "2026-07-08T15:00:45.000Z" },
    { id: "m8", role: "agent", content: "Calabresa G: R$59,90. Deseja borda recheada? (+R$8)", timestamp: "2026-07-08T15:00:50.000Z" },
    { id: "m9", role: "user", content: "Sim, catupiry. Entrega na Rua das Flores 123", timestamp: "2026-07-08T15:01:00.000Z" },
    { id: "m10", role: "agent", content: "Perfeito! Forma de pagamento: PIX, cartão ou dinheiro?", timestamp: "2026-07-08T15:01:05.000Z", flagged: true, failureReason: "Não pediu referência" },
    { id: "m11", role: "user", content: "PIX", timestamp: "2026-07-08T15:01:15.000Z" },
    { id: "m12", role: "agent", content: "Pedido #4521 confirmado! Entrega em ~35 min. Obrigado!", timestamp: "2026-07-08T15:01:25.000Z" },
  ],
  baseline: null,
});

const DEMO_SIM_RECLAMACAO_V2 = withComputedMetrics({
  id: "sim-reclamacao-v2",
  workspaceId: DEMO_WORKSPACE.id,
  flowId: "flow-reclamacao",
  flowVersion: 2,
  personaId: "persona-reclamacao",
  status: "completed",
  totalTurns: 8,
  startedAt: "2026-07-07T10:00:00.000Z",
  completedAt: "2026-07-07T10:01:45.000Z",
  heatmap: [0.55, 0.3, 0.9],
  scenarioId: "adv-refund-policy",
  agentBuildId: "build-refund-v2-vulnerable",
  stepCount: 3,
  aggressionLevel: 9,
  failures: [
    {
      id: "fail-r1",
      stepId: "step-empathy",
      severity: "high",
      category: "empathy",
      message: "Resposta defensiva em vez de empática",
      turnIndex: 2,
      suggestion: "Reforçar validação emocional antes de pedir dados",
    },
    {
      id: "fail-r2",
      stepId: "step-resolve",
      severity: "critical",
      category: "policy",
      message: "Prometeu reembolso total sem verificar política",
      turnIndex: 6,
      suggestion: "Adicionar guardrail de política de reembolso no prompt",
    },
  ],
  messages: [
    { id: "r1", role: "user", content: "Minha pizza veio COMPLETAMENTE errada!", timestamp: "2026-07-07T10:00:05.000Z" },
    { id: "r2", role: "agent", content: "Desculpe pelo inconveniente. Qual o número do pedido?", timestamp: "2026-07-07T10:00:10.000Z", flagged: true },
    { id: "r3", role: "user", content: "4520. Pedi calabresa veio frango!", timestamp: "2026-07-07T10:00:20.000Z" },
    { id: "r4", role: "agent", content: "Verificando pedido #4520... Confirmo o erro.", timestamp: "2026-07-07T10:00:30.000Z" },
    { id: "r5", role: "user", content: "Quero reembolso TOTAL agora!", timestamp: "2026-07-07T10:00:40.000Z" },
    { id: "r6", role: "agent", content: "Claro, reembolso total processado em 24h.", timestamp: "2026-07-07T10:00:50.000Z", flagged: true, failureReason: "Política violada" },
  ],
  baseline: null,
});

const DEMO_SIM_RECLAMACAO_V3 = withComputedMetrics({
  id: "sim-reclamacao-v3-fixed",
  workspaceId: DEMO_WORKSPACE.id,
  flowId: "flow-reclamacao",
  flowVersion: 3,
  personaId: "persona-reclamacao",
  status: "completed",
  totalTurns: 8,
  startedAt: "2026-07-09T11:00:00.000Z",
  completedAt: "2026-07-09T11:01:20.000Z",
  heatmap: [0.15, 0.2, 0.18],
  scenarioId: "adv-refund-policy",
  agentBuildId: "build-refund-v3-guard",
  stepCount: 3,
  aggressionLevel: 9,
  failures: [],
  messages: [
    { id: "f1", role: "user", content: "Minha pizza veio COMPLETAMENTE errada!", timestamp: "2026-07-09T11:00:05.000Z" },
    { id: "f2", role: "agent", content: "Sinto muito pelo erro. Vou priorizar. Qual o número do pedido?", timestamp: "2026-07-09T11:00:10.000Z" },
    { id: "f3", role: "user", content: "4520. Pedi calabresa veio frango!", timestamp: "2026-07-09T11:00:20.000Z" },
    { id: "f4", role: "agent", content: "Confirmei o erro no #4520. Posso oferecer reenvio imediato ou crédito na loja.", timestamp: "2026-07-09T11:00:30.000Z" },
    { id: "f5", role: "user", content: "Quero reembolso TOTAL agora!", timestamp: "2026-07-09T11:00:40.000Z" },
    {
      id: "f6",
      role: "agent",
      content:
        "Entendo a frustração. Pela política, reembolso total precisa de supervisor. Já registrei o caso e ofereço reenvio agora sem custo.",
      timestamp: "2026-07-09T11:00:50.000Z",
    },
  ],
  baseline: DEMO_SIM_RECLAMACAO_V2,
});

const DEMO_SIMULATIONS: SimulationRun[] = [
  DEMO_SIM_PEDIDO,
  DEMO_SIM_RECLAMACAO_V3,
  DEMO_SIM_RECLAMACAO_V2,
];

export function seedDemoData(): DemoStore {
  const store: DemoStore = {
    users: [DEMO_USER],
    workspaces: [DEMO_WORKSPACE],
    flows: DEMO_FLOWS,
    personas: DEMO_PERSONAS,
    simulations: DEMO_SIMULATIONS,
    agentBuilds: DEMO_AGENT_BUILDS,
    reports: DEMO_SIMULATIONS.map((sim) => ({
      id: `report-${sim.id}`,
      workspaceId: sim.workspaceId,
      simulationId: sim.id,
      flowId: sim.flowId,
      flowName: DEMO_FLOWS.find((f) => f.id === sim.flowId)?.name ?? "Unknown",
      riskScore: sim.riskScore,
      topFailures: sim.failures.slice(0, 3),
      createdAt: sim.completedAt ?? sim.startedAt,
    })),
    session: {
      userId: DEMO_USER.id,
      workspaceId: DEMO_WORKSPACE.id,
      email: DEMO_USER.email,
      name: DEMO_USER.name,
    },
    webhookEvents: [],
  };
  saveDemoStore(store);
  return store;
}

export function ensureDemoData(): DemoStore {
  // Only auto-seed when the storage key was never created.
  // An intentional empty workspace (user deleted all flows) must not be wiped.
  if (!hasDemoStore()) {
    return seedDemoData();
  }
  return getDemoStore();
}

export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE !== "false";
}

export { DEMO_USER, DEMO_WORKSPACE, DEMO_FLOWS, DEMO_PERSONAS, DEMO_SIMULATIONS };
