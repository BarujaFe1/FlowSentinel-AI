import Stripe from "stripe";
import type { PlanId } from "@/lib/types";
import type { BillingProvider, CheckoutSession, PortalSession, WebhookResult } from "./billing-provider";
import { routeWebhook } from "./webhook-router";

const PRICE_MAP: Partial<Record<PlanId, string>> = {
  starter: process.env.STRIPE_PRICE_STARTER,
  pro: process.env.STRIPE_PRICE_PRO,
  business: process.env.STRIPE_PRICE_BUSINESS,
};

export class StripeBillingProvider implements BillingProvider {
  name = "stripe";
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
      apiVersion: "2025-02-24.acacia",
    });
  }

  async createCheckoutSession(params: {
    planId: PlanId;
    customerEmail: string;
    workspaceId: string;
    successUrl: string;
    cancelUrl: string;
  }): Promise<CheckoutSession> {
    const priceId = PRICE_MAP[params.planId];
    if (!priceId) throw new Error(`No Stripe price configured for plan: ${params.planId}`);

    const session = await this.stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: params.customerEmail,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: { workspaceId: params.workspaceId, planId: params.planId },
    });

    if (!session.url) throw new Error("Stripe checkout session missing URL");
    return { id: session.id, url: session.url, planId: params.planId };
  }

  async createPortalSession(params: { customerId: string; returnUrl: string }): Promise<PortalSession> {
    const session = await this.stripe.billingPortal.sessions.create({
      customer: params.customerId,
      return_url: params.returnUrl,
    });
    return { id: session.id, url: session.url };
  }

  async handleWebhook(payload: string, signature: string): Promise<WebhookResult> {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) throw new Error("STRIPE_WEBHOOK_SECRET not configured");

    const event = this.stripe.webhooks.constructEvent(payload, signature, secret);
    return routeWebhook(event.id, event.type, event.data.object as unknown as Record<string, unknown>);
  }
}

export function createStripeProvider(): StripeBillingProvider | null {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new StripeBillingProvider();
}
