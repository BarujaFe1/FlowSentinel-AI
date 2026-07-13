import type { WebhookResult } from "./billing-provider";

/**
 * In-memory idempotency for the demo / serverless process lifetime.
 * Not durable across cold starts — document this honestly for portfolio demos.
 * Production would use a DB unique constraint on event_id.
 */
const processedEvents = new Set<string>();

export function routeWebhook(
  eventId: string,
  eventType: string,
  data: Record<string, unknown>,
): WebhookResult {
  void data;
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
