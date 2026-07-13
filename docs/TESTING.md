# Testing

## Stack

- **Unit:** Vitest + jsdom (`tests/**/*.test.ts`)
- **E2E smoke:** Playwright (`tests/e2e/smoke.spec.ts`)
- **CI:** `.github/workflows/ci.yml` — lint, typecheck, test, build

## Commands

```bash
npm run lint
npm run typecheck
npm run test
npm run test:watch
npm run build
npm run test:e2e   # requires Playwright browsers installed
```

## What we cover

| Suite | Focus |
|-------|--------|
| `entitlements.test.ts` | Plan limits, export gating, usage % |
| `webhook-idempotency.test.ts` | Duplicate event skip |
| `demo-store.test.ts` | Seed-once behavior, empty workspace preserve, mock→router |
| `scoring-adversarial.test.ts` | Risk/pass formulas, regression Δ, adversarial fix vs vulnerable, seeded RNG |
| `e2e/smoke.spec.ts` | Basic navigation smoke (optional locally) |

## How to add a test when fixing a bug

1. Reproduce the invariant in a unit test (prefer pure modules under `src/lib/*`).
2. Fix the code.
3. Keep CI green — do not skip hooks.

## Known gaps

- No RTL component tests yet for flow detail / settings.
- E2E is smoke-level, not full critical-path coverage.
- API routes are not integration-tested against auth (demo APIs are open by design).

## Demo manual checklist

1. Login with `demo@pizzariaflow.com.br` / `demo123`
2. Open a flow → refresh → still loads
3. Run a simulation → usage + report appear
4. Delete all flows → refresh → flows stay empty (no forced reseed)
5. Settings → rename workspace → persists
6. Mobile width → Menu opens nav links
7. Billing → mock checkout (no charge)
