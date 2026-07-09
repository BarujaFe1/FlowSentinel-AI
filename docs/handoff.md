# Handoff Document

## Repository

- **GitHub**: https://github.com/BarujaFe1/FlowSentinel-AI
- **Local path**: `D:\dev\FlowSentinel-AI`
- **Author**: Felipe Alirio Baruja

## What's Built (MVP)

### Pages (16 routes)
Landing, Pricing, Login, Signup, Onboarding, Dashboard, Flows CRUD, Flow Detail, Personas, Simulations, Simulation Replay, Reports, Settings, Billing, Upgrade + 4 API routes.

### Core Features
- Demo mode with localStorage persistence
- Pizza shop seed scenario
- Mock simulation runner with risk scoring
- Conversation replay + failure heatmap
- Plan gating (Starter/Pro/Business)
- Billing abstraction (mock/Stripe/MercadoPago)
- Export JSON/CSV (Pro+)
- Dark premium UI (Syne + DM Sans)

### Not Yet Done
- Real Supabase auth integration (clients prepared)
- Real Stripe/MP in production (providers ready)
- README (will be replaced with premium version)
- Git push of MVP code

## Run Locally

```powershell
cd D:\dev\FlowSentinel-AI
$env:npm_config_cache="D:\npm-cache"
$env:TEMP="D:\tmp"
$env:TMP="D:\tmp"
npm install
cp .env.example .env.local
npm run dev
```

Demo login: `demo@pizzariaflow.com.br` / any password 6+ chars

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript check |
| `npm run test` | Vitest unit tests |
| `npm run test:e2e` | Playwright smoke |
| `npm run format` | Prettier |

## Next Steps

1. Push code to GitHub
2. Deploy to Vercel with demo mode
3. Connect Supabase when ready for real auth
4. Configure Stripe for production billing
5. Replace README with premium version

## Key Files

- Demo store: `src/lib/demo/`
- Billing: `src/lib/billing/`
- DB schema: `supabase/migrations/001_init.sql`
- Tests: `tests/`
