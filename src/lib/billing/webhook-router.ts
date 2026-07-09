import type { WebhookResult } from "./billing-provider";

const processedEvents = new Set<string>();

export function routeWebhook(
  eventId: string,
  eventType: string,
  _data: Record<string, unknown>,
): WebhookResult {
  if (processedEvents.has(eventId)) {
    return {
      processed: false,
      eventId,
      action: eventType,
      message: "Event already processed (idempotent skip)",
    };
  }

  processedEvents.add(eventId);

  const actionMap: Record<string, string> = {
    "checkout.session.completed": "subscription_created",
    "customer.subscription.updated": "subscription_updated",
    "customer.subscription.deleted": "subscription_cancelled",
    "invoice.payment_failed": "payment_failed",
    payment: "payment_received",
    "payment.updated": "payment_updated",
  };

  return {
    processed: true,
    eventId,
    action: actionMap[eventType] ?? eventType,
    message: `Webhook processed: ${eventType}`,
  };
}

export function clearWebhookEvents(): void {
  processedEvents.clear();
}

export function getProcessedEventCount(): number {
  return processedEvents.size;
}

export function hasProcessedEvent(eventId: string): boolean {
  return processedEvents.has(eventId);
}
