# Technical decisions

## Demo store over mandatory Supabase

**Decision:** Ship a complete product experience on `localStorage` first.  
**Why:** Recruiters and hiring managers open the live URL without env secrets.  
**Trade-off:** No multi-device sync, no real RLS. Schema under `supabase/migrations/` is the upgrade path.

## Billing provider interface

**Decision:** `BillingProvider` with `mock` default; Stripe/Mercado Pago adapters beside it.  
**Why:** Shows monetization architecture without charging anyone in demos.  
**Trade-off:** Real providers need secrets, webhooks, and signature verification before production.

## In-memory webhook idempotency

**Decision:** `Set<string>` in `webhook-router.ts` for process lifetime.  
**Why:** Unit-testable and enough to demonstrate the *pattern*.  
**Trade-off:** Not durable across Vercel cold starts. Do not claim “persisted webhooks” in sales copy.

## Client session gate (not middleware auth)

**Decision:** Soft gate inside `AppShell` after demo store hydrate.  
**Why:** Matches localStorage session; keeps middleware simple for static/demo deploy.  
**Trade-off:** APIs remain callable without session — acceptable for portfolio mock, not for SaaS production.

## Seed only when storage key is absent

**Decision:** `ensureDemoData()` checks `hasDemoStore()`, not `flows.length === 0`.  
**Why:** Deleting all flows must not silently restore pizza demo.  
**Trade-off:** First visit always gets seed; reset is an explicit Settings action.

## Simulation creates report + usage

**Decision:** `addSimulation` updates `simulationsThisMonth` and inserts a `FailureReport`.  
**Why:** Dashboard, billing usage, and Reports stay coherent after a run.  
**Trade-off:** Report shape is simplified (top 3 failures) — enough for MVP storytelling.

## Tailwind v4 + manual UI primitives

**Decision:** Avoid heavy component kits; small local `components/ui/*`.  
**Why:** Faster control of dark premium look; fewer deps.  
**Trade-off:** No full shadcn registry; a11y must be maintained by hand.

## Honest portfolio framing

**Decision:** Banner + README state “demo / portfolio / mock billing”.  
**Why:** Credibility with technical recruiters beats overselling.  
**Trade-off:** Less “production SaaS” hype; more trust.
