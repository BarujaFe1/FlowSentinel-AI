# Portfolio Pitch

**FlowSentinel AI** — Lab de QA para agentes de atendimento (WhatsApp/IA)

## One-liner

Cenários adversariais reproduzíveis, score de risco e replay — evidência no lab antes do go-live.

## Problem

Times colocam bots em atendimento sem harness de regressão. Falhas de política, tom e PII só aparecem com cliente real.

## Solution (o que existe de verdade)

- Flows + personas no demo store
- Suite adversarial scriptada (policy, PII, loop, tom…)
- Agent builds (ex.: vulnerável vs guardrail)
- Risk score ponderado por severidade + Δ vs baseline
- Replay + heatmap de peso de risco
- Case in-app de falha pré-produção
- Billing adapter mock + entitlements

## Não diga

- “Integração WhatsApp de produção”
- “Detecção de regressão com ML enterprise”
- “Webhooks persistentes em produção” (idempotência é in-memory)

## Demo

Pizzaria Flow — reclamação/reembolso: `refund-vulnerable-v2` vs `refund-guardrail-v3`.  
Guia: `docs/DEMO_GUIDE.md`

## Tech

Next.js 15, TypeScript, Vitest, CI, Vercel demo, localStorage lab store.

## Author

**Felipe Alírio Baruja** · [barujafe.vercel.app](https://barujafe.vercel.app) · [@BarujaFe1](https://github.com/BarujaFe1)
