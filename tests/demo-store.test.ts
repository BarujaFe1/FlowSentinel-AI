import { beforeEach, describe, expect, it } from "vitest";
import { ensureDemoData, seedDemoData } from "@/lib/demo/seed";
import {
  createEmptyStore,
  DEMO_STORAGE_KEY,
  hasDemoStore,
  saveDemoStore,
} from "@/lib/demo/store";
import { mockBillingProvider } from "@/lib/billing/mock-provider";
import { clearWebhookEvents, hasProcessedEvent } from "@/lib/billing/webhook-router";

describe("ensureDemoData", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("seeds when storage key is missing", () => {
    expect(hasDemoStore()).toBe(false);
    const store = ensureDemoData();
    expect(store.flows.length).toBeGreaterThan(0);
    expect(hasDemoStore()).toBe(true);
  });

  it("does not wipe an intentional empty workspace", () => {
    const empty = createEmptyStore();
    empty.session = {
      userId: "u1",
      workspaceId: "w1",
      email: "a@b.com",
      name: "A",
    };
    empty.workspaces = [
      {
        id: "w1",
        name: "Empty Co",
        slug: "empty-co",
        planId: "free",
        ownerId: "u1",
        memberIds: ["u1"],
        simulationsThisMonth: 0,
        billingPeriodStart: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
    ];
    saveDemoStore(empty);

    const next = ensureDemoData();
    expect(next.flows).toHaveLength(0);
    expect(next.workspaces[0]?.name).toBe("Empty Co");
  });

  it("preserves seeded data on second ensure", () => {
    const first = seedDemoData();
    first.flows[0]!.name = "Custom Flow Name";
    saveDemoStore(first);
    const second = ensureDemoData();
    expect(second.flows[0]?.name).toBe("Custom Flow Name");
  });
});

describe("simulation usage + reports contract", () => {
  it("seed creates matching reports for simulations", () => {
    localStorage.removeItem(DEMO_STORAGE_KEY);
    const store = seedDemoData();
    expect(store.reports.length).toBe(store.simulations.length);
    expect(store.workspaces[0]?.simulationsThisMonth).toBeGreaterThan(0);
  });
});

describe("mock billing webhook routing", () => {
  beforeEach(() => {
    clearWebhookEvents();
  });

  it("routes through idempotent webhook router", async () => {
    const payload = JSON.stringify({
      id: "evt_mock_1",
      type: "checkout.session.completed",
      data: { planId: "pro" },
    });
    const first = await mockBillingProvider.handleWebhook(payload, "sig");
    const second = await mockBillingProvider.handleWebhook(payload, "sig");
    expect(first.processed).toBe(true);
    expect(first.action).toBe("subscription_created");
    expect(second.processed).toBe(false);
    expect(hasProcessedEvent("evt_mock_1")).toBe(true);
  });
});
