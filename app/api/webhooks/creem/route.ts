import { NextResponse } from 'next/server';
import { verifyCreemSignature } from '@/lib/creem';
import { completeAgentPayment } from '@/lib/insforge';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-creem-signature');

    // Invariant #4: Webhook Security - Verify signature
    const isValid = verifyCreemSignature(rawBody, signature);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing webhook signature' },
        { status: 401 }
      );
    }

    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    const checkoutId = payload.checkout_id || payload.data?.id || payload.id;
    const status = payload.status || payload.event;

    if (checkoutId && (status === 'completed' || status === 'checkout.completed' || status === 'paid')) {
      await completeAgentPayment(checkoutId);
      return NextResponse.json({
        success: true,
        message: `Payment reconciled for checkout ${checkoutId}`,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook received, no payment action required',
    });
  } catch (error) {
    console.error('POST /api/webhooks/creem error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing webhook' },
      { status: 500 }
    );
  }
}
