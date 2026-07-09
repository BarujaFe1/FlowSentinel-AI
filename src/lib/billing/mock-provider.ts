import type { PlanId } from "@/lib/types";
import type { BillingProvider, CheckoutSession, PortalSession, WebhookResult } from "./billing-provider";
import { PLANS } from "./plans";

export class MockBillingProvider implements BillingProvider {
  name = "mock";

  async createCheckoutSession(params: {
    planId: PlanId;
    customerEmail: string;
    workspaceId: string;
    successUrl: string;
    cancelUrl: string;
  }): Promise<CheckoutSession> {
    const plan = PLANS[params.planId as keyof typeof PLANS];
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

  async handleWebhook(payload: string, _signature: string): Promise<WebhookResult> {
    let eventId = `mock_evt_${Date.now()}`;
    let action = "unknown";

    try {
      const data = JSON.parse(payload) as { id?: string; type?: string };
      if (data.id) eventId = data.id;
      if (data.type) action = data.type;
    } catch {
      // use defaults
    }

    return {
      processed: true,
      eventId,
      action,
      message: "Mock webhook processed (demo mode)",
    };
  }
}

export const mockBillingProvider = new MockBillingProvider();
