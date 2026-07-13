# Architecture

## Overview

FlowSentinel AI is a Next.js 15 App Router application for QA testing WhatsApp and AI support agents. It simulates conversations, scores risk, detects failures, and replays interactions.

This MVP ships a **demo-first** path (browser `localStorage`) so recruiters and clients can use the product without Supabase or billing secrets. Optional Supabase schema and Stripe/Mercado Pago adapters are prepared for a production path.

## Stack

- **Frontend:** Next.js 15.5, React 19, TypeScript, Tailwind CSS v4
- **Animation:** Framer Motion (landing)
- **Validation:** Zod
- **Billing:** Provider abstraction (`mock` | `stripe` | `mercadopago`)
- **Storage:** Demo store (`localStorage`) + optional Supabase
- **Tests:** Vitest (unit) + Playwright (smoke)

## Directory structure

```
src/
├── app/                    # App Router pages & API routes
│   ├── app/                # Dashboard shell (client session gate)
│   └── api/                # Billing & simulation endpoints
├── components/
│   ├── ui/                 # Primitives (button, card, skeleton…)
│   ├── layout/             # Shell, sidebar, topbar, mobile nav
│   └── app/                # Domain UI (replay, heatmap)
└── lib/
    ├── billing/            # Plans, entitlements, providers, webhook router
    ├── demo/               # Store, seed, simulation runner, provider
    ├── supabase/           # Optional clients
    ├── types/              # Shared TypeScript types
    └── validation/         # Zod schemas
```

## Demo mode

Default: `NEXT_PUBLIC_DEMO_MODE=true`, `BILLING_PROVIDER=mock`.

| Concern | Behavior |
|---------|----------|
| Persistence | `localStorage` key `flowsentinel-demo-store` |
| Seed | `ensureDemoData()` seeds **only if the key is missing** |
| Auth | Client session in the store; `/app` redirects to `/login` if absent |
| Billing | Mock checkout/portal URLs; no money moves |
| Webhooks | `routeWebhook` idempotency is **in-memory per process** |

## Domain model (demo)

```
Workspace → Flows (versioned steps)
         → Personas
         → SimulationRuns → FailureReports
         → planId + simulationsThisMonth (entitlements)
```

Creating a simulation via `DemoProvider.addSimulation`:

1. Prepends the run to `simulations`
2. Creates a matching `FailureReport`
3. Increments `workspace.simulationsThisMonth`

## Billing layer

```
BillingProvider (interface)
├── MockBillingProvider     ← default (calls routeWebhook)
├── StripeBillingProvider
└── MercadoPagoBillingProvider

webhook-router.ts           ← process-lifetime Set idempotency
entitlements.ts             ← plan gating helpers
plans.ts                    ← Starter / Pro / Business limits
```

**Honest limit:** serverless cold starts clear the in-memory Set. Production should use a DB unique constraint on `event_id`.

## API routes

| Route | Method | Purpose | Auth today |
|-------|--------|---------|------------|
| `/api/billing/checkout` | POST | Checkout session | None (demo) |
| `/api/billing/portal` | POST | Customer portal | None (demo) |
| `/api/webhooks/billing` | POST | Provider webhook | Signature headers read; mock ignores |
| `/api/simulations/run` | POST | Mock runner | None (demo) |

Treat APIs as **demo/lab endpoints**, not multi-tenant production APIs.

## Auth model (MVP)

- Login/signup seed or restore demo data and write `session` into the store.
- `AppShell` waits for hydrate, then redirects if `session` is null.
- Logout clears session and returns to `/login`.
- Not cookie/JWT/Supabase Auth — by design for zero-config demos.

## Related docs

- [TECHNICAL_DECISIONS.md](./TECHNICAL_DECISIONS.md)
- [TESTING.md](./TESTING.md)
- [DEPLOYMENT.md](./DEPLOYMENT.md)
- [data-model.md](./data-model.md)
- [AUDIT_REPORT.md](./AUDIT_REPORT.md)
