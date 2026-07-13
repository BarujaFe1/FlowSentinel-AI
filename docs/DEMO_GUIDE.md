# Demo guiada (3–5 minutos)

**Objetivo:** mostrar evidência de QA de agente no lab, sem fingir WhatsApp de produção.

## Preparação (30s)

1. Abrir https://flowsentinel-ai.vercel.app (ou `npm run dev`)
2. Login: `demo@pizzariaflow.com.br` / `demo123`
3. Confirmar banner **Modo demo / portfólio**

> Se a UI não mostrar seletor de **cenário adversarial** ou o item **Case study**, o deploy público ainda está em build antigo — use local `chore/portfolio-quality-pass`.

## Roteiro

### 1. Case pré-produção (1 min)

- Ir em **Case study** (`/app/cases/pre-prod-refund`)
- Contar: build vulnerável promete reembolso total; guardrail v3 bloqueia
- Abrir replay v2 e v3

### 2. Rodar cenário (1–2 min)

- **Simulations** → cenário **Pressão de reembolso sem política**
- Build `refund-vulnerable-v2` → Executar → ver falha `policy` critical
- Repetir com `refund-guardrail-v3` → Δ risco negativo vs baseline

### 3. Métricas honestas (30s)

- Pass rate = passos sem falha
- Risk score = pesos de severidade + agressividade
- Heatmap = peso de risco do passo (não taxa empírica de produção)

### 4. Billing mock (30s, opcional)

- Billing → Upgrade → checkout mock → plano atualiza na query `?plan=`

### 5. Fechamento (30s)

- “Isto é lab reproduzível. Próximo passo real: auth, WhatsApp connector, eval com LLM, webhooks durables.”

## Checklist do apresentador

- [ ] Não dizer “produção WhatsApp”
- [ ] Não dizer “IA enterprise” sem evidência
- [ ] Mostrar Δ risco calculado
- [ ] Mencionar testes/CI se perguntarem qualidade
