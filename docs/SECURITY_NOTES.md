# Security notes

## Scope

This document records security-relevant findings for the **portfolio MVP**. No secrets are reproduced here.

## Findings (honest)

1. **Demo auth is not production auth**  
   Login/signup validate form shape (Zod) and write a session into `localStorage`. Passwords are not hashed or verified against a user store.

2. **API routes are ungated**  
   `/api/billing/*`, `/api/webhooks/billing`, and `/api/simulations/run` do not require a session cookie/JWT. Acceptable for a public mock lab; **not** for multi-tenant SaaS.

3. **Webhook signatures**  
   Headers are read (`stripe-signature`, `x-signature`, …). The **mock** provider ignores signatures. Real Stripe/Mercado Pago verification must be completed before enabling those providers on a public URL.

4. **Webhook idempotency is process-local**  
   `routeWebhook` uses an in-memory `Set`. Cold starts reset it. Production needs durable unique `event_id` storage.

5. **No secrets found committed**  
   `.gitignore` ignores `.env*` and keeps `.env.example`. If a secret ever appears in git history, rotate it immediately and scrub history — do not paste the value into docs.

6. **Pagar.me**  
   Listed as a future provider stub only; not implemented in this MVP.

## If you find a leaked secret

1. Stop. Do not commit or reprint it.  
2. Rotate the credential at the provider.  
3. Add a dated note here describing *where* it was found (path/commit), not the value.  
4. Prefer `git filter-repo` / GitHub secret scanning follow-up over “hope nobody noticed”.

## Recommended before production

- Real auth (Supabase Auth or equivalent) + middleware protection for `/app` and APIs  
- RLS on workspace-scoped tables  
- Durable webhook idempotency  
- Provider signature verification  
- Rate limits on checkout/simulation endpoints  
- Remove or lock down public demo billing if real providers are enabled  
