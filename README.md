<div align="center">
  <img src="./assets/icon.svg" alt="FlowSentinel AI" width="120" height="120" />

  <h1>FlowSentinel AI</h1>
  <p><em>QA lab, simulation & risk scoring for WhatsApp / AI support agents.</em></p>
  <p>Laboratório de QA, simulação e score de risco para agentes de atendimento.</p>

  <p>
    <a href="https://flowsentinel-ai.vercel.app"><img alt="Live Demo" src="https://img.shields.io/badge/Live%20Demo-flowsentinel--ai.vercel.app-00C7B7?style=for-the-badge&logo=vercel&logoColor=white" /></a>
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
    <img alt="Billing" src="https://img.shields.io/badge/Billing-Mock%20Provider-F59E0B?style=for-the-badge" />
    <img alt="CI" src="https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white" />
  </p>
</div>

<p align="center">
  <img src="./assets/screenshots/dashboard.svg" alt="FlowSentinel dashboard placeholder" width="100%" />
</p>

> **Status:** MVP de portfólio / lab demo — utilizável sem secrets. Billing = mock (sem cobrança). Não é integração WhatsApp de produção.

---

## Live demo

| | |
|---|---|
| **URL** | [https://flowsentinel-ai.vercel.app](https://flowsentinel-ai.vercel.app) |
| **Login** | `demo@pizzariaflow.com.br` |
| **Senha** | qualquer senha com **6+** caracteres (ex. `demo123`) |
| **Billing** | `BILLING_PROVIDER=mock` |

1. Login → lab `/app`  
2. Flows → abrir um fluxo → refresh (deve continuar carregando)  
3. Simulations → rodar / abrir replay  
4. Billing → checkout mock  

---

## Problem

Teams ship WhatsApp/AI support agents that look fine on the happy path and break on tone, loops, missing confirmations, and prompt regressions — with no structured QA, risk score, or evidence pack to prioritize fixes.

## Solution

FlowSentinel is a **QA lab SaaS**: versioned flows, personas, simulation runs, failure reports, risk ranking, replay/heatmap UX, and plan entitlements behind a billing-provider abstraction (mock → Stripe/Mercado Pago).

---

## Main features

- Risk dashboard (KPIs + recent sims)
- Flows CRUD with steps / versions
- Personas for realistic scenarios
- Simulation runner (mock today; AI adapter hooks planned)
- Replay + failure heatmap UI
- Reports derived from simulations
- Plan entitlements (limits / export gates)
- Billing adapters + webhook idempotency **pattern** (in-memory in demo)
- Zero-secret demo via `localStorage` seed (Pizzaria Flow)

---

## Architecture

```text
Browser (demo store)          Optional later
┌─────────────────────┐       ┌──────────────────┐
│ localStorage seed   │       │ Supabase Auth+RLS│
│ DemoProvider / CRUD │       │ Postgres schema  │
│ Simulation runner   │       └──────────────────┘
└─────────┬───────────┘
          │
   Next.js App Router + API routes
          │
   BillingProvider: mock | stripe | mercadopago
```

Details: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) · decisions: [docs/TECHNICAL_DECISIONS.md](./docs/TECHNICAL_DECISIONS.md)

---

## Stack

| Layer | Choice |
|-------|--------|
| App | Next.js 15 App Router, React 19, TypeScript |
| UI | Tailwind CSS v4, local UI primitives, Lucide, Framer Motion |
| Validation | Zod |
| Demo data | `src/lib/demo/*` + localStorage |
| Billing | Provider interface + mock default |
| Tests | Vitest + Playwright smoke |
| Deploy | Vercel |

---

## Local demo

```bash
git clone https://github.com/BarujaFe1/FlowSentinel-AI.git
cd FlowSentinel-AI
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → Login with the demo credentials above.

### Commands

```bash
npm run dev          # Turbopack dev server
npm run lint
npm run typecheck
npm run test         # Vitest
npm run build
npm start
npm run test:e2e     # Playwright (browsers required)
```

### Environment

Copy `.env.example` → `.env.local`. Minimum for demo:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEMO_MODE=true
BILLING_PROVIDER=mock
```

Never commit `.env.local` or real keys (`.gitignore` blocks `.env*`, keeps `.env.example`).

---

## Tests

- Entitlements (plan limits / export)
- Webhook idempotency
- Demo seed-once + mock webhook routing

See [docs/TESTING.md](./docs/TESTING.md). CI: `.github/workflows/ci.yml`.

---

## Technical decisions & trade-offs

| Decision | Trade-off |
|----------|-----------|
| Demo localStorage first | Instant demo; no multi-device sync |
| Mock billing default | Safe public URL; not real payments |
| In-memory webhook Set | Shows pattern; not durable across cold starts |
| Client session gate | Fits demo store; APIs still open (lab mode) |
| Soft “auth” | Password validated for format only in demo |

Full write-up: [docs/TECHNICAL_DECISIONS.md](./docs/TECHNICAL_DECISIONS.md)

---

## Roadmap

- **Now (MVP):** landing, demo auth, CRUD, sims, risk UI, mock billing, docs, CI  
- **Next:** durable webhook store, real auth on APIs, AI runner adapters, WhatsApp connectors  
- **Later:** admin, automation packs, multi-language, marketplace  

---

## Current status

| Item | State |
|------|--------|
| Public demo | Live on Vercel |
| Billing | Mock only on public demo |
| Supabase | Schema prepared; not required to run |
| CI | GitHub Actions (lint/typecheck/test/build) |
| Portfolio quality pass | Branch `chore/portfolio-quality-pass` |

---

## What this project demonstrates

- End-to-end SaaS product thinking (pricing → entitlements → lab UX)
- Clean TypeScript domain layer + Zod validation
- Billing adapter architecture without charging demo users
- Honest demo mode suitable for recruiters
- Testing + CI as part of the portfolio artifact
- Documentation that separates MVP from production claims

---

## How I’d present this in an interview

1. **Hook (30s):** “QA for WhatsApp/AI agents — risk score and replay so ops teams stop guessing.”  
2. **Demo (2–3 min):** Login → risk dashboard → simulation replay → billing mock upgrade path.  
3. **Architecture (2 min):** Demo store vs Supabase path; `BillingProvider`; entitlements; why mock is default.  
4. **Trade-offs (1 min):** What is intentionally fake (auth cookies, durable webhooks, WhatsApp) and what I’d ship next.  
5. **Close:** Point to [docs/AUDIT_REPORT.md](./docs/AUDIT_REPORT.md) and [docs/HANDOFF.md](./docs/HANDOFF.md) as evidence of engineering judgment.

Pitch notes: [docs/portfolio-pitch.md](./docs/portfolio-pitch.md)

---

## Screenshots / placeholders

| Asset | Path |
|-------|------|
| Icon | [`assets/icon.svg`](./assets/icon.svg) |
| Dashboard | [`assets/screenshots/dashboard.svg`](./assets/screenshots/dashboard.svg) |
| Replay | [`assets/screenshots/simulation-replay.svg`](./assets/screenshots/simulation-replay.svg) |

PNG marketing shots can be added later under `assets/screenshots/` without changing the product.

---

## Docs index

- [AUDIT_REPORT.md](./docs/AUDIT_REPORT.md)
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- [TECHNICAL_DECISIONS.md](./docs/TECHNICAL_DECISIONS.md)
- [TESTING.md](./docs/TESTING.md)
- [DEPLOYMENT.md](./docs/DEPLOYMENT.md)
- [HANDOFF.md](./docs/HANDOFF.md)
- [SECURITY_NOTES.md](./docs/SECURITY_NOTES.md)

---

## Author

**Felipe Alirio Baruja** · [Portfolio](https://barujafe.vercel.app/) · [GitHub](https://github.com/BarujaFe1) · [LinkedIn](https://www.linkedin.com/in/barujafe/)

## License

MIT © 2026 Felipe Alirio Baruja
