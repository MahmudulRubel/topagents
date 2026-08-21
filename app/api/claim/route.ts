import { NextResponse } from 'next/server';
import { getMinBidForRank, createPendingAgent } from '@/lib/insforge';
import { createCreemCheckoutSession } from '@/lib/creem';
import { ClaimPayload } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ClaimPayload;

    const {
      agent_name,
      tagline,
      url,
      category,
      logo_url,
      claimed_by_handle,
      claimed_by_email,
      amount_cents,
      target_rank = 1,
    } = body;

    // 1. Basic Payload Validation
    if (!agent_name || !tagline || !url || !category || !claimed_by_email) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields (agent_name, tagline, url, category, email).' },
        { status: 400 }
      );
    }

    if (amount_cents <= 0) {
      return NextResponse.json(
        { success: false, error: 'Bid amount must be greater than $0.' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(claimed_by_email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address provided.' },
        { status: 400 }
      );
    }

    // 2. Server-Side Bid Re-Validation (Invariant #3)
    const minRequiredCents = await getMinBidForRank(target_rank);
    if (amount_cents < minRequiredCents) {
      const minDollars = (minRequiredCents / 100).toFixed(2);
      return NextResponse.json(
        {
          success: false,
          error: `Bid amount $${(amount_cents / 100).toFixed(2)} is too low. Minimum required bid for rank #${target_rank} is $${minDollars}.`,
          min_required_cents: minRequiredCents,
        },
        { status: 400 }
      );
    }

    // 3. Create Creem Checkout Session
    const checkoutSession = await createCreemCheckoutSession({
      agentName: agent_name,
      amountCents: amount_cents,
      email: claimed_by_email,
      successUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/claimed`,
      cancelUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}`,
    });

    // 4. Create Pending Agent Record in InsForge DB
    await createPendingAgent(
      {
        agent_name,
        tagline,
        url,
        category,
        logo_url,
        claimed_by_handle,
        claimed_by_email,
        amount_cents,
      },
      checkoutSession.checkout_id
    );

    return NextResponse.json({
      success: true,
      checkout_url: checkoutSession.checkout_url,
      checkout_id: checkoutSession.checkout_id,
    });
  } catch (error) {
    console.error('POST /api/claim error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing claim.' },
      { status: 500 }
    );
  }
}
