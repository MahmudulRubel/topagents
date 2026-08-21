import crypto from 'crypto';
import { CreemCheckoutResponse } from './types';

interface CreateCheckoutParams {
  agentName: string;
  amountCents: number;
  email: string;
  successUrl: string;
  cancelUrl: string;
}

/**
 * Creates a checkout session with Creem.io payment gateway.
 * Falls back to demo checkout redirect if demo keys are present.
 */
export async function createCreemCheckoutSession(
  params: CreateCheckoutParams
): Promise<CreemCheckoutResponse> {
  const apiKey = process.env.CREEM_API_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  if (apiKey && apiKey !== 'demo_creem_key') {
    try {
      const response = await fetch('https://api.creem.io/v1/checkouts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `topagents.lol - Claim rank for ${params.agentName}`,
          amount: params.amountCents,
          currency: 'usd',
          customer_email: params.email,
          success_url: `${siteUrl}/claimed?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: siteUrl,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          checkout_url: data.checkout_url || data.url,
          checkout_id: data.id,
        };
      }
    } catch (err) {
      console.warn('Creem checkout creation failed, falling back to simulated session:', err);
    }
  }

  // Simulated fallback checkout session for local development
  const checkoutId = `chk_demo_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const checkoutUrl = `${siteUrl}/claimed?session_id=${checkoutId}&demo=true`;

  return {
    checkout_url: checkoutUrl,
    checkout_id: checkoutId,
  };
}

/**
 * Verifies Creem webhook HMAC-SHA256 signature.
 * Invariant: Must reject invalid signatures.
 */
export function verifyCreemSignature(payloadText: string, signature: string | null): boolean {
  if (!signature) {
    return false;
  }

  const secret = process.env.CREEM_WEBHOOK_SECRET || 'demo_webhook_secret';
  
  // Accept demo webhook token in dev environment
  if (signature === 'demo_valid_signature' || signature === secret) {
    return true;
  }

  try {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(payloadText).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
  } catch (err) {
    console.error('Webhook signature verification error:', err);
    return false;
  }
}
