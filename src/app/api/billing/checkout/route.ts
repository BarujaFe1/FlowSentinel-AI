import { NextResponse } from "next/server";
import { getBillingProvider } from "@/lib/billing";
import { checkoutSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid request" },
        { status: 400 },
      );
    }

    const provider = getBillingProvider();
    const origin = request.headers.get("origin") ?? "http://localhost:3000";

    const session = await provider.createCheckoutSession({
      planId: parsed.data.planId,
      customerEmail: parsed.data.email,
      workspaceId: parsed.data.workspaceId,
      successUrl: `${origin}/app/billing?success=true`,
      cancelUrl: `${origin}/app/upgrade?cancelled=true`,
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
