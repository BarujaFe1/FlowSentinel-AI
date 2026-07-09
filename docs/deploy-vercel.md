# Deploy to Vercel

## Prerequisites

- GitHub repo: https://github.com/BarujaFe1/FlowSentinel-AI
- Vercel account

## Steps

1. Import the GitHub repository in Vercel
2. Set root directory to project root
3. Framework preset: **Next.js**
4. Add environment variables from `.env.example`
5. Deploy

## Required Env Vars (Demo)

```
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_DEMO_MODE=true
BILLING_PROVIDER=mock
```

## Production Env Vars

Add Supabase and billing credentials when ready:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
BILLING_PROVIDER=stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

## Build Settings

- Build command: `npm run build`
- Output: Next.js default
- Node.js: 20.x

## Post-Deploy

1. Configure Stripe/MercadoPago webhook URL: `https://your-domain/api/webhooks/billing`
2. Run Supabase migration: `supabase db push`
3. Set `NEXT_PUBLIC_DEMO_MODE=false` when going live
