import { NextResponse } from "next/server";
import { getBillingProvider } from "@/lib/billing";
import { z } from "zod";

const portalSchema = z.object({
  customerId: z.string().min(1),
  returnUrl: z.string().url(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = portalSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid request" },
        { status: 400 },
      );
    }

    const provider = getBillingProvider();
    const session = await provider.createPortalSession(parsed.data);
    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Portal failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
