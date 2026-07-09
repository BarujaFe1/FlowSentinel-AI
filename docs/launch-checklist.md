# Launch Checklist

## Pre-Launch

- [ ] All env vars set in Vercel
- [ ] Supabase migration applied
- [ ] Stripe/MercadoPago webhooks configured
- [ ] `NEXT_PUBLIC_DEMO_MODE=false` for production
- [ ] Custom domain configured
- [ ] SSL active

## Quality

- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run test` passes
- [ ] `npm run build` succeeds
- [ ] E2E smoke test passes (optional)

## Demo / Sales

- [ ] Pizzaria Flow demo data loads
- [ ] Login → Dashboard → Simulation replay works
- [ ] Upgrade flow redirects correctly
- [ ] Export works on Pro plan

## Marketing

- [ ] Landing page live
- [ ] Pricing page accurate
- [ ] Portfolio link (barujafe.vercel.app) in footer
- [ ] GitHub repo public

## Post-Launch

- [ ] Monitor webhook events
- [ ] Check error logs in Vercel
- [ ] First customer onboarding call scheduled
