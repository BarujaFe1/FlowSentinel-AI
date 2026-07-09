# Stripe Setup

## 1. Create Products

In Stripe Dashboard → Products, create:

| Plan | Price (BRL/month) | Env Var |
|------|-------------------|---------|
| Starter | R$ 79 | `STRIPE_PRICE_STARTER` |
| Pro | R$ 199 | `STRIPE_PRICE_PRO` |
| Business | R$ 499 | `STRIPE_PRICE_BUSINESS` |

## 2. Environment Variables

```
BILLING_PROVIDER=stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_BUSINESS=price_...
```

## 3. Webhook

1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain/api/webhooks/billing`
3. Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
4. Copy signing secret to `STRIPE_WEBHOOK_SECRET`

## 4. Customer Portal

Enable Customer Portal in Stripe Dashboard → Settings → Billing → Customer portal.

## 5. Test Mode

Use `sk_test_` keys and Stripe CLI for local webhook testing:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/billing
```
