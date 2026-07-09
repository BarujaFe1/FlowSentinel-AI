# MercadoPago Setup

## 1. Create Application

1. Go to [mercadopago.com.br/developers](https://www.mercadopago.com.br/developers)
2. Create an application
3. Get Production/Sandbox Access Token

## 2. Environment Variables

```
BILLING_PROVIDER=mercadopago
MERCADOPAGO_ACCESS_TOKEN=APP_USR-...
MERCADOPAGO_WEBHOOK_SECRET=your_secret
```

## 3. Webhook

Configure IPN/Webhook URL: `https://your-domain/api/webhooks/billing`

Events: payment, payment.updated

## 4. Plans

MercadoPago uses preference-based checkout. Amounts are configured in `mercadopago-provider.ts`:

- Starter: R$ 79
- Pro: R$ 199
- Business: R$ 499

## 5. Sandbox Testing

Use test credentials from MercadoPago Developers panel. Test cards available in their documentation.

## Note

Customer portal for MercadoPago is simplified in MVP — redirects to return URL with demo params. Full subscription management requires MercadoPago Subscriptions API integration.
