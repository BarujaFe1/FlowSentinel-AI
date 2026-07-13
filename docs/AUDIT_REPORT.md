# Audit Report — FlowSentinel AI

**Date:** 2026-07-13  
**Branch:** `chore/portfolio-quality-pass`  
**Auditor roles:** senior architect, full-stack, QA, product design, DX, tech recruiter, security

---

## Executive summary

FlowSentinel AI is a credible **portfolio SaaS MVP**: Next.js 15 App Router, TypeScript, Tailwind v4, demo store (localStorage), simulation + risk scoring UX, and a billing provider abstraction defaulting to **mock**. The live demo at [flowsentinel-ai.vercel.app](https://flowsentinel-ai.vercel.app) is usable without secrets.

Before this pass the product scored ~**6.5/10** for public portfolio: strong narrative and structure, but real bugs (flow detail hydrate), oversold claims (webhook “persistence”, gated `/app`), broken README image paths, incomplete simulation→usage/report wiring, and stale docs/CI gaps.

**Target after this pass:** ~**8.0–8.5/10** as an honest, runnable portfolio piece (not a production WhatsApp product).

---

## Current score (pre-fix baseline)

| Dimension | Score | Notes |
|-----------|-------|-------|
| Product clarity | 8/10 | Clear QA-lab story |
| Architecture | 7/10 | Good billing adapters; demo store is intentional |
| Reliability | 5/10 | Hydrate bug, reseed wipe, incomplete sims |
| Docs / README | 6/10 | Strong copy, broken assets, overselling |
| Tests / CI | 4/10 | Few unit tests, no CI |
| Security honesty | 6/10 | Mock OK; APIs ungated; webhook sig gaps |
| UX polish | 6.5/10 | Dark UI good; settings/mobile gaps |
| **Overall** | **6.5/10** | |

---

## Main risks

1. **P0 — Flow detail “não encontrado” after refresh** — `useState(flow)` stuck `undefined` while store hydrates.
2. **P0 — README broken images** — references missing PNGs; repo only has SVGs under `assets/`.
3. **P1 — `addSimulation` didn’t bump usage or create reports** — billing/usage UX lied.
4. **P1 — `ensureDemoData` reseeds when `flows.length === 0`** — deleting all flows wiped workspace.
5. **P1 — Mock webhook skipped `routeWebhook`** — idempotency theater.
6. **P1 — Ungated `/app/**` + signup ignored form fields** — weak demo auth story.
7. **P1 — Settings inputs didn’t save; mobile Menu no `onClick`**.
8. **Security** — billing APIs unauthenticated; MercadoPago signature not verified; webhook idempotency in-memory only (cold start resets).
9. **Portfolio honesty** — README claimed durable webhook persistence and “auth+RLS” as if live.

---

## Quick wins (done in this pass)

- Fix flow detail hydrate + loading skeleton.
- Wire `addSimulation` → usage counter + failure report.
- Seed only when storage key missing.
- Mock provider → `routeWebhook`.
- Client session gate + demo banner.
- Settings save; mobile nav drawer; signup personalizes session/workspace.
- Fix README asset paths to existing SVGs; honest billing/webhook claims.
- Add Vitest coverage for seed + mock webhook; GitHub Actions CI.
- Refresh architecture / testing / deployment / HANDOFF docs.

---

## Structural improvements

- Keep demo localStorage as first-class path; Supabase remains optional schema.
- Document in-memory webhook Set as process-lifetime only.
- Prefer router navigation over `window.location`.
- CI: lint → typecheck → test → build on PR/push.

---

## Bugs found

| ID | Severity | Status |
|----|----------|--------|
| Flow hydrate empty state | P0 | Fixed |
| README PNG 404s | P0 | Fixed (SVG paths) |
| Simulation usage/reports | P1 | Fixed |
| Reseed on empty flows | P1 | Fixed |
| Mock webhook bypass | P1 | Fixed |
| Settings no-op | P1 | Fixed |
| Mobile menu dead | P1 | Fixed |
| Signup ignores form | P1 | Fixed |
| `/app` ungated | P1 | Soft gate (client session) |
| Webhook persistence oversell | Docs | Documented honestly |

---

## Execution plan

1. Branch `chore/portfolio-quality-pass` ✅  
2. Audit → `docs/AUDIT_REPORT.md` ✅  
3. Run install / lint / typecheck / test / build  
4. Fix P0/P1 + tests + CI + docs + README  
5. Handoff + commit + push  

---

## Final checklist

- [x] Install works  
- [ ] Lint / typecheck / test / build verified on this machine  
- [x] Main bugs fixed or documented  
- [x] README portfolio-ready (assets honest)  
- [x] Docs created/updated  
- [x] CI added  
- [x] `.env.example` + `.gitignore` protect secrets  
- [x] Essential tests expanded  
- [x] UX reviewed (banner, settings, mobile menu, hydrate)  
- [ ] `docs/HANDOFF.md` + commit/push  

---

## Recruiter lens

**Say this:** “I built a sellable QA lab MVP with plan entitlements, billing adapters, and a zero-secret demo path.”  
**Don’t say:** “Production WhatsApp integration with durable webhook store and real auth.”  
The gap between those sentences is intentional MVP scope — call it out in interviews.
