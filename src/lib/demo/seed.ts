import type { FailureReport, Flow, Persona, SimulationRun, User, Workspace } from "@/lib/types";
import type { DemoStore } from "@/lib/demo/store";
import { generateId, getDemoStore, saveDemoStore } from "./store";

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
    version: 2,
    tags: ["suporte", "reclamação"],
    createdAt: "2026-03-10T09:00:00.000Z",
    updatedAt: "2026-06-20T11:00:00.000Z",
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

const DEMO_SIMULATIONS: SimulationRun[] = [
  {
    id: "sim-pedido-v3",
    workspaceId: DEMO_WORKSPACE.id,
    flowId: "flow-pedido-pizza",
    flowVersion: 3,
    personaId: "persona-indeciso",
    status: "completed",
    riskScore: 34,
    passRate: 83,
    totalTurns: 12,
    regressionDelta: -5,
    startedAt: "2026-07-08T15:00:00.000Z",
    completedAt: "2026-07-08T15:02:30.000Z",
    heatmap: [0.1, 0.2, 0.15, 0.45, 0.3, 0.1],
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
      { id: "m2", role: "agent", content: "Olá! 🍕 Bem-vindo à Pizzaria Flow! Posso ajudar com seu pedido?", timestamp: "2026-07-08T15:00:08.000Z" },
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
  },
  {
    id: "sim-reclamacao-v2",
    workspaceId: DEMO_WORKSPACE.id,
    flowId: "flow-reclamacao",
    flowVersion: 2,
    personaId: "persona-reclamacao",
    status: "completed",
    riskScore: 72,
    passRate: 45,
    totalTurns: 8,
    regressionDelta: 12,
    startedAt: "2026-07-07T10:00:00.000Z",
    completedAt: "2026-07-07T10:01:45.000Z",
    heatmap: [0.3, 0.6, 0.9],
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
  },
];

export function seedDemoData(): DemoStore {
  const store: DemoStore = {
    users: [DEMO_USER],
    workspaces: [DEMO_WORKSPACE],
    flows: DEMO_FLOWS,
    personas: DEMO_PERSONAS,
    simulations: DEMO_SIMULATIONS,
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
  const store = getDemoStore();
  if (store.flows.length === 0) {
    return seedDemoData();
  }
  return store;
}

export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE !== "false";
}

export { DEMO_USER, DEMO_WORKSPACE, DEMO_FLOWS, DEMO_PERSONAS, DEMO_SIMULATIONS };
