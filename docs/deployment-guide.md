# topagents.lol — Vercel & InsForge Deployment Guide

This guide outlines step-by-step instructions for deploying **topagents.lol** to production on Vercel with InsForge PostgreSQL database & Creem.io payment gateway integration.

---

## 1. Prerequisites Checklist
- [ ] Vercel Account connected to your GitHub repository.
- [ ] InsForge Backend Project (`https://rw722vwb.us-east.insforge.app`).
- [ ] Creem.io Account & API Key.

---

## 2. InsForge Database Provisioning
1. Open the [InsForge SQL Console](https://rw722vwb.us-east.insforge.app).
2. Execute the DDL script located at `file:///d:/topagents/scripts/schema.sql`.
3. Verify that the following tables exist:
   - `public.agents`
   - `public.bid_history`
   - `public.site_stats`
   - `public.increment_clicks` (RPC Function)

---

## 3. Creem.io Webhook Registration
1. In your Creem.io dashboard, navigate to **Webhooks**.
2. Register a new webhook endpoint pointing to your Vercel deployment URL:
   `https://topagents.lol/api/webhooks/creem`
3. Subscribe to the event: `checkout.completed`.
4. Copy your webhook signing secret (`whsec_...`).

---

## 4. Vercel Environment Variables Configuration
In your Vercel Project Settings -> **Environment Variables**, configure:

| Variable | Description | Example / Required Format |
| :--- | :--- | :--- |
| `INSFORGE_API_URL` | InsForge REST API Base URL | `https://rw722vwb.us-east.insforge.app` |
| `INSFORGE_API_KEY` | InsForge Project Anon API Key | `ik_...` |
| `CREEM_API_KEY` | Creem.io Secret Key | `creem_sk_...` |
| `CREEM_WEBHOOK_SECRET` | Creem.io Webhook HMAC Secret | `whsec_...` |

---

## 5. Deployment Commands
Deploy directly using Vercel CLI or via git commit to `main`:

```bash
# Verify build locally
npm run build

# Deploy to Vercel production
npx vercel --prod
```

---

## 6. Post-Deployment Verification Checklist
1. **Leaderboard Load**: Visit `https://topagents.lol` — verify sub-second leaderboard response (`Cache-Control` edge headers active).
2. **Email Privacy Audit**: Run `curl https://topagents.lol/api/leaderboard` — verify `claimed_by_email` is **never** present in payload.
3. **Claim Flow Test**: Click `Claim #1 Spot` — verify redirection to Creem checkout with server-validated minimum bid amount.
4. **Webhook Reconcile Test**: Trigger Creem checkout test payment — verify immediate agent rank update and bid history logging.
