import type { PlanId } from "@/lib/types";

export interface Plan {
  id: PlanId;
  name: string;
  priceCents: number;
  priceLabel: string;
  description: string;
  features: string[];
  limits: PlanLimits;
  highlighted?: boolean;
  contactSales?: boolean;
}

export interface PlanLimits {
  workspaces: number;
  users: number;
  activeFlows: number;
  simulationsPerMonth: number;
  historyDays: number;
  exportEnabled: boolean;
  automations: boolean;
  prioritySupport: boolean;
}

export const PLANS: Record<Exclude<PlanId, "free">, Plan> = {
  starter: {
    id: "starter",
    name: "Starter",
    priceCents: 7900,
    priceLabel: "R$ 79/mês",
    description: "Para times pequenos testando agentes WhatsApp.",
    features: [
      "1 workspace",
      "3 usuários",
      "5 fluxos ativos",
      "50 simulações/mês",
      "Histórico 7 dias",
    ],
    limits: {
      workspaces: 1,
      users: 3,
      activeFlows: 5,
      simulationsPerMonth: 50,
      historyDays: 7,
      exportEnabled: false,
      automations: false,
      prioritySupport: false,
    },
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceCents: 19900,
    priceLabel: "R$ 199/mês",
    description: "Para operações em crescimento com QA contínuo.",
    features: [
      "3 workspaces",
      "10 usuários",
      "20 fluxos ativos",
      "500 simulações/mês",
      "Histórico 90 dias",
      "Export JSON/CSV",
    ],
    limits: {
      workspaces: 3,
      users: 10,
      activeFlows: 20,
      simulationsPerMonth: 500,
      historyDays: 90,
      exportEnabled: true,
      automations: true,
      prioritySupport: false,
    },
    highlighted: true,
  },
  business: {
    id: "business",
    name: "Business",
    priceCents: 49900,
    priceLabel: "R$ 499+/mês",
    description: "Enterprise-grade QA lab com automações e SLA.",
    features: [
      "Workspaces ilimitados",
      "Usuários ilimitados",
      "Fluxos ilimitados",
      "Simulações ilimitadas",
      "Histórico completo",
      "Automações + SLA",
    ],
    limits: {
      workspaces: Infinity,
      users: Infinity,
      activeFlows: Infinity,
      simulationsPerMonth: Infinity,
      historyDays: Infinity,
      exportEnabled: true,
      automations: true,
      prioritySupport: true,
    },
    contactSales: true,
  },
};

export const FREE_LIMITS: PlanLimits = {
  workspaces: 1,
  users: 1,
  activeFlows: 2,
  simulationsPerMonth: 10,
  historyDays: 3,
  exportEnabled: false,
  automations: false,
  prioritySupport: false,
};

export function getPlanLimits(planId: PlanId): PlanLimits {
  if (planId === "free") return FREE_LIMITS;
  return PLANS[planId].limits;
}

export function getPlan(planId: PlanId): Plan | null {
  if (planId === "free") return null;
  return PLANS[planId];
}
