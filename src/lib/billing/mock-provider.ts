import type { PlanId } from "@/lib/types";
import type { BillingProvider, CheckoutSession, PortalSession, WebhookResult } from "./billing-provider";
import { routeWebhook } from "./webhook-router";

export class MockBillingProvider implements BillingProvider {
  name = "mock";

  async createCheckoutSession(params: {
    planId: PlanId;
    customerEmail: string;
    workspaceId: string;
    successUrl: string;
    cancelUrl: string;
  }): Promise<CheckoutSession> {
    const sessionId = `mock_cs_${Date.now()}`;
    const url = `${params.successUrl}?session_id=${sessionId}&plan=${params.planId}&demo=true`;
    return { id: sessionId, url, planId: params.planId };
  }

  async createPortalSession(params: { customerId: string; returnUrl: string }): Promise<PortalSession> {
    return {
      id: `mock_portal_${Date.now()}`,
      url: `${params.returnUrl}?portal=demo&customer=${params.customerId}`,
    };
  }

  async handleWebhook(payload: string, signature: string): Promise<WebhookResult> {
    void signature;
    let eventId = `mock_evt_${Date.now()}`;
    let eventType = "checkout.session.completed";
    let data: Record<string, unknown> = {};

    try {
      const parsed = JSON.parse(payload) as {
        id?: string;
        type?: string;
        data?: Record<string, unknown>;
      };
      if (parsed.id) eventId = parsed.id;
      if (parsed.type) eventType = parsed.type;
      if (parsed.data) data = parsed.data;
    } catch {
      // use defaults for malformed demo payloads
    }

    return routeWebhook(eventId, eventType, data);
  }
}

export const mockBillingProvider = new MockBillingProvider();
