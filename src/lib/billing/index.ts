import type { BillingProvider } from "./billing-provider";
import { mockBillingProvider } from "./mock-provider";
import { createMercadoPagoProvider } from "./mercadopago-provider";
import { createStripeProvider } from "./stripe-provider";

export function getBillingProvider(): BillingProvider {
  const provider = process.env.BILLING_PROVIDER ?? "mock";

  if (provider === "stripe") {
    const stripe = createStripeProvider();
    if (stripe) return stripe;
  }

  if (provider === "mercadopago") {
    const mp = createMercadoPagoProvider();
    if (mp) return mp;
  }

  return mockBillingProvider;
}

export { mockBillingProvider } from "./mock-provider";
