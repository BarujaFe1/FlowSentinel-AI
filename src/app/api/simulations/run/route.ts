import { NextResponse } from "next/server";
import { DEMO_FLOWS, DEMO_PERSONAS, DEMO_WORKSPACE } from "@/lib/demo/seed";
import { runMockSimulation } from "@/lib/demo/simulation-runner";
import { simulationRunSchema } from "@/lib/validation/schemas";
import { checkEntitlement } from "@/lib/billing/entitlements";

/**
 * Lab-only endpoint: runs against in-module seed entities (not the browser store).
 * Prefer the client runner in /app/simulations for demo evidence packs.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = simulationRunSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid request" },
        { status: 400 },
      );
    }

    const flow = DEMO_FLOWS.find((f) => f.id === parsed.data.flowId);
    const persona = DEMO_PERSONAS.find((p) => p.id === parsed.data.personaId);

    if (!flow || !persona) {
      return NextResponse.json({ error: "Flow or persona not found" }, { status: 404 });
    }

    const check = checkEntitlement(DEMO_WORKSPACE.planId, {
      workspaces: 1,
      users: 1,
      activeFlows: DEMO_FLOWS.filter((f) => f.isActive).length,
      simulationsThisMonth: DEMO_WORKSPACE.simulationsThisMonth,
    }, "run_simulation");

    if (!check.allowed) {
      return NextResponse.json({ error: check.reason }, { status: 403 });
    }

    const simulation = runMockSimulation({
      flow,
      persona,
      workspaceId: parsed.data.workspaceId,
    });

    return NextResponse.json({ simulation });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Simulation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
