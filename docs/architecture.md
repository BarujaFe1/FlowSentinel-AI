# Architecture

## Overview

FlowSentinel AI is a Next.js 15 App Router application for QA testing WhatsApp and AI support agents. It simulates conversations, scores risk, detects failures, and replays interactions.

## Stack

- **Frontend**: Next.js 15.5, React 19, TypeScript, Tailwind CSS v4
- **Animation**: Framer Motion (landing hero only)
- **Validation**: Zod
- **Billing**: Provider abstraction (mock / Stripe / MercadoPago)
- **Storage**: Demo local store (localStorage) + optional Supabase

## Directory Structure

```
src/
├── app/                    # App Router pages & API routes
│   ├── app/                # Authenticated dashboard shell
│   └── api/                # Billing & simulation endpoints
├── components/
│   ├── ui/                 # Manual shadcn-like primitives
│   ├── layout/             # Nav, sidebar, topbar
│   └── app/                # Domain components (replay, heatmap)
└── lib/
    ├── billing/            # Plans, entitlements, providers
    ├── demo/               # Local store, seed, simulation runner
    ├── supabase/           # Optional Supabase clients
    ├── types/              # Shared TypeScript types
    └── validation/         # Zod schemas
```

## Demo Mode

When `NEXT_PUBLIC_DEMO_MODE=true` (default), the app uses `src/lib/demo/*`:

- Data persisted in `localStorage` key `flowsentinel-demo-store`
- Pizza shop seed scenario pre-loaded
- Billing uses mock provider (no real charges)
- Auth is simulated (login/signup seed demo data)

## Billing Layer

```
BillingProvider (interface)
├── MockBillingProvider    ← default
├── StripeBillingProvider
└── MercadoPagoBillingProvider

webhook-router.ts          ← idempotent event processing
entitlements.ts            ← plan gating
plans.ts                   ← Starter/Pro/Business limits
```

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/billing/checkout` | POST | Create checkout session |
| `/api/billing/portal` | POST | Customer portal |
| `/api/webhooks/billing` | POST | Webhook handler |
| `/api/simulations/run` | POST | Mock simulation runner |

## Deployment

See [deploy-vercel.md](./deploy-vercel.md).
