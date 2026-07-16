<div align="center">
  <img src="./assets/icon.png" alt="FlowSentinel AI Logo" width="120" height="120" />

  <h1>FlowSentinel AI</h1>

  <p><strong>Lab de QA para agentes conversacionais — cenários adversariais, risk scoring, regressão e billing mock.</strong></p>
  <p><strong>QA lab for conversational agents — adversarial scenarios, risk scoring, regression and mock billing.</strong></p>

  <p>
    <a href="#pt-br">PT-BR</a> ·
    <a href="#en">English</a> ·
    <a href="#live-demo">Live Demo</a> ·
    <a href="#stack--tecnologias">Stack</a> ·
    <a href="#arquitetura--architecture">Architecture</a> ·
    <a href="#quick-start--início-rápido">Quick Start</a> ·
    <a href="#autor--author">Author</a>
  </p>

  <p>
    <a href="https://flowsentinel-ai.vercel.app"><img alt="Live Demo" src="https://img.shields.io/badge/Live%20Demo-flowsentinel--ai.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white" /></a>
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-React-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
    <img alt="Tailwind" src="https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
    <img alt="Supabase" src="https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
    <img alt="Lab Demo" src="https://img.shields.io/badge/Status-Lab%20demo-2563EB?style=for-the-badge" />
    <img alt="MIT" src="https://img.shields.io/badge/License-MIT-111827?style=for-the-badge" />
  </p>

  <p>
    <a href="https://flowsentinel-ai.vercel.app"><strong>Live Demo</strong></a> ·
    <a href="https://github.com/BarujaFe1/FlowSentinel-AI"><strong>Repositório</strong></a> ·
    <a href="https://barujafe.vercel.app/"><strong>Portfólio</strong></a> ·
    <a href="https://www.linkedin.com/in/barujafe/"><strong>LinkedIn</strong></a>
  </p>
</div>

<p align="center">
  <img src="./assets/hero-cover.png" alt="FlowSentinel AI overview" width="100%" />
</p>

---

<a id="pt-br"></a>

## PT-BR

## Visão geral

**FlowSentinel AI** é um lab de QA para agentes conversacionais: cenários adversariais, scoring de risco, regressão de agent-build e billing mock. Demo sintética — não é WhatsApp de produção.

> **Aviso de lab:** demo de portfólio com dados sintéticos/amostra. Não é produto em produção com SLA, integrações reais de clientes ou garantia operacional.

---

## Problema

Agentes conversacionais sobem sem rito de QA: prompts mudam, regressões passam e risco operacional só aparece no cliente.

---

## Para quem

- Builders de agentes / chatbots
- QA de produto conversacional
- Founders avaliando risco antes do go-live

---

## Funcionalidades

- Cenários adversariais
- Risk scoring
- Regressão de agent-build
- Billing mock (Stripe/MercadoPago adapters)
- Modo demo (NEXT_PUBLIC_DEMO_MODE)
- Testes Vitest + Playwright

---

## Escopo e limites

- **É:** lab de QA/risco para agentes, com dados sintéticos.
- **Não é:** provedor WhatsApp, SOC2, monitoramento 24/7 de produção, gateway de pagamento real na demo.

---

<a id="en"></a>

## English

## Overview

**FlowSentinel AI** is a QA lab for conversational agents: adversarial scenarios, risk scoring, agent-build regression and mock billing. Synthetic demo — not production WhatsApp.

> **Lab notice:** portfolio demo with synthetic/sample data. Not a production product with SLA, real customer integrations, or operational guarantees.

---

## Problem

Conversational agents ship without QA ritual: prompts change, regressions slip and operational risk only shows up with customers.

---

## Who it is for

- Agent / chatbot builders
- Conversational product QA
- Founders assessing risk before go-live

---

## Features

- Adversarial scenarios
- Risk scoring
- Agent-build regression
- Mock billing (Stripe/MercadoPago adapters)
- Demo mode (NEXT_PUBLIC_DEMO_MODE)
- Vitest + Playwright tests

---

## Scope and limits

- **Is:** agent QA/risk lab with synthetic data.
- **Is not:** WhatsApp provider, SOC2, 24/7 production monitoring, real payment gateway in the demo.

---

<a id="live-demo"></a>

## Live Demo

**URL:** [https://flowsentinel-ai.vercel.app](https://flowsentinel-ai.vercel.app)

Demo hospedada para avaliação de portfólio / Hosted for portfolio review.

> Lab demo — synthetic / sample data unless noted. Not a production SLA product.

---

<a id="stack--tecnologias"></a>

## Stack / Tecnologias

| Tecnologia | Uso no projeto |
|---|---|
| Next.js 15.5 / React 19 / TypeScript | App |
| Tailwind CSS 4 / Framer Motion / Lucide | UI |
| Supabase JS | Backend opcional |
| Stripe SDK (adapters) | Billing (mock por padrão) |
| Zod / Vitest / Playwright | Validação e testes |

---

<a id="arquitetura--architecture"></a>

## Arquitetura / Architecture

App Next.js único com src/app, src/components, src/lib, migrations Supabase e testes e2e.

`	xt
FlowSentinel-AI/
├── src/
│   ├── app/
│   ├── components/
│   └── lib/
├── supabase/migrations/
├── tests/
├── assets/
├── docs/
├── .env.example
├── package.json
└── vercel.json
`

---

<a id="quick-start--início-rápido"></a>

## Quick Start / Início rápido

### Pré-requisitos / Requirements

- Node.js 20+
- npm
- (Opcional) projeto Supabase para modo não-demo

### Clonar / Clone

`ash
git clone https://github.com/BarujaFe1/FlowSentinel-AI.git
cd FlowSentinel-AI
`

### Setup

`ash
cp .env.example .env.local
# Mantenha NEXT_PUBLIC_DEMO_MODE=true e BILLING_PROVIDER=mock para lab local
npm install
npm run dev
`

Abra http://localhost:3000

`ash
npm run test
npm run typecheck
# e2e (opcional)
npm run test:e2e
`

Não commit secrets — use apenas placeholders do .env.example.


---

## Technical decisions / Decisões técnicas

- **Demo mode + billing mock** por padrão para portfólio sem secrets.
- **Adapters de billing** (Stripe/MP) sem forçar produção.
- **Testes de entitlements/webhooks** para disciplina SaaS.

---

## Roadmap

### Implementado
- Cenários, risk score, regressão, billing mock, demo Vercel

### Planejado
- Mais suites adversariais
- Relatório de regressão exportável
- Hardening de webhooks

---

<a id="autor--author"></a>

## Autor / Author

Developed by **Felipe Alirio Baruja**.

- **Portfolio:** [https://barujafe.vercel.app/](https://barujafe.vercel.app/)
- **GitHub:** [github.com/BarujaFe1](https://github.com/BarujaFe1)
- **LinkedIn:** [linkedin.com/in/barujafe](https://www.linkedin.com/in/barujafe/)
- **Repository:** [github.com/BarujaFe1/FlowSentinel-AI](https://github.com/BarujaFe1/FlowSentinel-AI)

---

## License / Licença

MIT License.

See [LICENSE](./LICENSE) for details.

---

<div align="center">
  <p><strong>FlowSentinel AI</strong></p>
  <p>QA de agentes com risco explícito — lab sintético.</p>
  <p><em>Agent QA with explicit risk — synthetic lab.</em></p>
</div>
