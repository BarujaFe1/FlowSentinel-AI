# Deployment

## Live demo

- **URL:** https://flowsentinel-ai.vercel.app  
- **Provider:** Vercel  
- **Billing:** `BILLING_PROVIDER=mock`  
- **SSO / Deployment Protection:** must stay **off** for public portfolio access

## Recommended env (Production / Preview)

```bash
NEXT_PUBLIC_APP_URL=https://flowsentinel-ai.vercel.app
NEXT_PUBLIC_DEMO_MODE=true
BILLING_PROVIDER=mock
```

Do **not** set real Stripe/Mercado Pago secrets on the public demo unless webhooks and signature verification are fully wired and tested.

## Deploy steps (Vercel)

1. Link the GitHub repo `BarujaFe1/FlowSentinel-AI`
2. Framework preset: Next.js
3. Build command: `npm run build`
4. Install: `npm ci` / `npm install`
5. Set env vars above
6. Disable Deployment Protection for the alias used in the README

CLI alternative:

```bash
npx vercel --prod
```

See also [deploy-vercel.md](./deploy-vercel.md).

## Local production check

```bash
npm install
cp .env.example .env.local
npm run build
npm start
```

## Optional: real billing later

1. Set `BILLING_PROVIDER=stripe` (or `mercadopago`)
2. Fill secrets from `.env.example`
3. Point webhook endpoint to `/api/webhooks/billing`
4. Replace in-memory idempotency with durable storage
5. Add auth on checkout/portal routes

## Optional: Supabase

Follow [supabase-setup.md](./supabase-setup.md). Until then, demo store remains the source of truth in the browser.
