import type { PlanId } from "@/lib/types";
import { getPlanLimits, type PlanLimits } from "./plans";

export interface UsageSnapshot {
  workspaces: number;
  users: number;
  activeFlows: number;
  simulationsThisMonth: number;
}

export interface EntitlementCheck {
  allowed: boolean;
  reason?: string;
  limit?: number;
  current?: number;
}

export function getLimitsForPlan(planId: PlanId): PlanLimits {
  return getPlanLimits(planId);
}

export function checkEntitlement(
  planId: PlanId,
  usage: UsageSnapshot,
  action:
    | "create_workspace"
    | "add_user"
    | "activate_flow"
    | "run_simulation"
    | "export_report"
    | "use_automation",
): EntitlementCheck {
  const limits = getPlanLimits(planId);

  switch (action) {
    case "create_workspace":
      return checkLimit(usage.workspaces, limits.workspaces, "workspaces");
    case "add_user":
      return checkLimit(usage.users, limits.users, "usuários");
    case "activate_flow":
      return checkLimit(usage.activeFlows, limits.activeFlows, "fluxos ativos");
    case "run_simulation":
      return checkLimit(
        usage.simulationsThisMonth,
        limits.simulationsPerMonth,
        "simulações este mês",
      );
    case "export_report":
      return limits.exportEnabled
        ? { allowed: true }
        : { allowed: false, reason: "Export disponível no plano Pro ou superior." };
    case "use_automation":
      return limits.automations
        ? { allowed: true }
        : { allowed: false, reason: "Automações disponíveis no plano Pro ou superior." };
    default:
      return { allowed: false, reason: "Ação desconhecida." };
  }
}

function checkLimit(current: number, limit: number, label: string): EntitlementCheck {
  if (current >= limit) {
    return {
      allowed: false,
      reason: `Limite de ${label} atingido (${limit}). Faça upgrade para continuar.`,
      limit,
      current,
    };
  }
  return { allowed: true, limit, current };
}

export function getUsagePercent(current: number, limit: number): number {
  if (!isFinite(limit) || limit === 0) return 0;
  return Math.min(100, Math.round((current / limit) * 100));
}

export function isNearLimit(current: number, limit: number, threshold = 0.8): boolean {
  if (!isFinite(limit)) return false;
  return current / limit >= threshold;
}
