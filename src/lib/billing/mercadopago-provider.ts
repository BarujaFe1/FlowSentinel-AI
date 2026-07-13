import type { PlanId } from "@/lib/types";
import type { BillingProvider, CheckoutSession, PortalSession, WebhookResult } from "./billing-provider";
import { routeWebhook } from "./webhook-router";

const PLAN_AMOUNTS: Partial<Record<PlanId, number>> = {
  starter: 79,
  pro: 199,
  business: 499,
};

export class MercadoPagoBillingProvider implements BillingProvider {
  name = "mercadopago";

  async createCheckoutSession(params: {
    planId: PlanId;
    customerEmail: string;
    workspaceId: string;
    successUrl: string;
    cancelUrl: string;
  }): Promise<CheckoutSession> {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) throw new Error("MERCADOPAGO_ACCESS_TOKEN not configured");

    const amount = PLAN_AMOUNTS[params.planId];
    if (!amount) throw new Error(`No MercadoPago amount for plan: ${params.planId}`);

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          {
            title: `FlowSentinel ${params.planId}`,
            quantity: 1,
            unit_price: amount,
            currency_id: "BRL",
          },
        ],
        payer: { email: params.customerEmail },
        back_urls: { success: params.successUrl, failure: params.cancelUrl, pending: params.cancelUrl },
        auto_return: "approved",
        external_reference: params.workspaceId,
        metadata: { planId: params.planId },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`MercadoPago error: ${err}`);
    }

    const data = (await response.json()) as { id: string; init_point: string };
    return { id: data.id, url: data.init_point, planId: params.planId };
  }

  async createPortalSession(params: { customerId: string; returnUrl: string }): Promise<PortalSession> {
    return {
      id: `mp_portal_${Date.now()}`,
      url: `${params.returnUrl}?mp_portal=demo&customer=${params.customerId}`,
    };
  }

  async handleWebhook(payload: string, signature: string): Promise<WebhookResult> {
    void signature;
    let eventId = `mp_evt_${Date.now()}`;
    let action = "payment.updated";

    try {
      const data = JSON.parse(payload) as { id?: string | number; action?: string; type?: string };
      eventId = String(data.id ?? eventId);
      action = data.action ?? data.type ?? action;
    } catch {
      // use defaults
    }

    return routeWebhook(eventId, action, {});
  }
}

export function createMercadoPagoProvider(): MercadoPagoBillingProvider | null {
  if (!process.env.MERCADOPAGO_ACCESS_TOKEN) return null;
  return new MercadoPagoBillingProvider();
}
