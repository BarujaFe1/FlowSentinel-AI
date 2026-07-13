# Portfolio handoff — FlowSentinel AI

**Date:** 2026-07-13  
**Branch:** `chore/portfolio-quality-pass`  
**Repo:** https://github.com/BarujaFe1/FlowSentinel-AI  
**Workspace:** `C:\Users\BarujaFe\Projects\FlowSentinel-AI`

---

## Summary

Second quality pass focused on **evidence**, not cosmetics: adversarial scenarios, real regression metrics, agent builds, pre-prod failure case, and removal of dishonest random regression / login wipe / dead checkout upgrade.

**Recommendation:** **destaque (Tier A)** no portfólio — com framing de *lab de QA de agentes*, não de produto WhatsApp enterprise.

---

## Before → after

| Area | Before | After |
|------|--------|-------|
| Regressão | `Math.random()` theater | Δ risk vs baseline |
| Cenários | Só runner probabilístico | Suite adversarial scriptada |
| Agent version | Contador de flow | `AgentBuild` + seed vulnerável/guardrail |
| Case study | Narrativa solta | Rota `/app/cases/pre-prod-refund` + doc |
| Login | `seedDemoData()` wipe | `ensureDemoData()` preserve |
| Billing mock | `?plan=` ignorado | Aplica plano no client |
| Testes | 13 | 21 |
| Claims | Alguns oversells | README/docs alinhados ao código |

---

## Commands / gates

```bash
npm run lint      # clean
npm run typecheck # pass
npm run test      # 21 passed
npm run build     # pass (run in this pass)
```

Baseline at start of this pass: lint/typecheck/test already green (13 tests).

---

## Deploy evidence

- Public URL: https://flowsentinel-ai.vercel.app  
- **Caveat:** Vercel may still track `main` (`c02b1fd`) while this work lives on `chore/portfolio-quality-pass`. Until merge/redeploy, the public demo might **not** show adversarial UI. Local branch is source of truth for new evidence features.

---

## Limitations remaining

- No WhatsApp / LLM production runner
- Client session only; APIs ungated
- Webhook idempotency in-memory
- SVG placeholders instead of PNG screenshots
- Observability (Sentry/PostHog) not wired

---

## Next steps

1. Merge branch → redeploy Vercel
2. Capture PNGs per `docs/SCREENSHOTS.md`
3. Optional: wire Playwright path for case study + adversarial run
4. Keep card copy honest (see supermegaprompt)

---

## Key files touched

- `src/lib/demo/scoring.ts`, `adversarial-scenarios.ts`, `simulation-runner.ts`, `seed.ts`, `store.ts`
- `src/app/app/simulations/*`, `cases/pre-prod-refund`, `billing`, `login`
- `tests/scoring-adversarial.test.ts`
- `README.md`, `docs/*`

Supermegaprompt (fora do repo, **obrigatório / confirmado**):  
`C:\dev\prompts_para_port\flowsentinel-ai-supermegaprompt-portfolio.md`

### Gates re-verificados (2026-07-13, workspace `G:\dev\FlowSentinel-AI`)
- lint ✅ · typecheck ✅ · test **21/21** ✅ · build ✅  
- Demo pública https://flowsentinel-ai.vercel.app → **HTTP 200**, sem marcadores adversarial no HTML (provável build antigo de `main`).
