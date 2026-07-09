import { NextResponse } from "next/server";
import { getBillingProvider } from "@/lib/billing";

export async function POST(request: Request) {
  try {
    const payload = await request.text();
    const signature =
      request.headers.get("stripe-signature") ??
      request.headers.get("x-signature") ??
      request.headers.get("x-request-id") ??
      "";

    const provider = getBillingProvider();
    const result = await provider.handleWebhook(payload, signature);

    return NextResponse.json(result, { status: result.processed ? 200 : 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
