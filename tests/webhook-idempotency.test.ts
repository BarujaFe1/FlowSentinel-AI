import { describe, it, expect, beforeEach } from "vitest";
import {
  routeWebhook,
  clearWebhookEvents,
  hasProcessedEvent,
  getProcessedEventCount,
} from "@/lib/billing/webhook-router";

describe("webhook idempotency", () => {
  beforeEach(() => {
    clearWebhookEvents();
  });

  it("processes event on first call", () => {
    const result = routeWebhook("evt_123", "checkout.session.completed", {});
    expect(result.processed).toBe(true);
    expect(result.eventId).toBe("evt_123");
    expect(hasProcessedEvent("evt_123")).toBe(true);
  });

  it("skips duplicate event (idempotent)", () => {
    routeWebhook("evt_456", "payment.updated", {});
    const second = routeWebhook("evt_456", "payment.updated", {});
    expect(second.processed).toBe(false);
    expect(second.message).toContain("already processed");
    expect(getProcessedEventCount()).toBe(1);
  });

  it("processes different events independently", () => {
    routeWebhook("evt_a", "payment", {});
    routeWebhook("evt_b", "payment", {});
    expect(getProcessedEventCount()).toBe(2);
  });
});
