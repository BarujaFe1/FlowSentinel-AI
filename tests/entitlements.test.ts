import { describe, it, expect } from "vitest";
import { checkEntitlement, getUsagePercent } from "@/lib/billing/entitlements";

describe("entitlements", () => {
  const baseUsage = {
    workspaces: 1,
    users: 2,
    activeFlows: 3,
    simulationsThisMonth: 10,
  };

  it("allows simulation within starter limits", () => {
    const result = checkEntitlement("starter", baseUsage, "run_simulation");
    expect(result.allowed).toBe(true);
  });

  it("blocks simulation when monthly limit reached", () => {
    const result = checkEntitlement(
      "starter",
      { ...baseUsage, simulationsThisMonth: 50 },
      "run_simulation",
    );
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("simulações");
  });

  it("blocks export on starter plan", () => {
    const result = checkEntitlement("starter", baseUsage, "export_report");
    expect(result.allowed).toBe(false);
  });

  it("allows export on pro plan", () => {
    const result = checkEntitlement("pro", baseUsage, "export_report");
    expect(result.allowed).toBe(true);
  });

  it("calculates usage percent correctly", () => {
    expect(getUsagePercent(25, 50)).toBe(50);
    expect(getUsagePercent(60, 50)).toBe(100);
  });
});
