import type { PlanId } from "@/lib/types";

export interface CheckoutSession {
  id: string;
  url: string;
  planId: PlanId;
}

export interface PortalSession {
  id: string;
  url: string;
}

export interface WebhookResult {
  processed: boolean;
  eventId: string;
  action?: string;
  message?: string;
}

export interface BillingProvider {
  name: string;
  createCheckoutSession(params: {
    planId: PlanId;
    customerEmail: string;
    workspaceId: string;
    successUrl: string;
    cancelUrl: string;
  }): Promise<CheckoutSession>;
  createPortalSession(params: {
    customerId: string;
    returnUrl: string;
  }): Promise<PortalSession>;
  handleWebhook(payload: string, signature: string): Promise<WebhookResult>;
}
