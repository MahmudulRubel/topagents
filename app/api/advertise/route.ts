import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, createRateLimitResponse, getClientIp } from '@/lib/security/rate-limit';
import { sanitizeString, isValidSafeUrl, isValidEmail, verifySameOrigin } from '@/lib/security/sanitize';
import { saveInquiry, SponsorInquiry } from '@/lib/data/inquiries';
import { sendInquiryNotification } from '@/lib/email/send-inquiry-notification';

// 10 sponsor inquiries per hour per IP
const ADVERTISE_RATE_LIMIT = 10;
const ADVERTISE_WINDOW_MS = 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    // 1. CSRF origin check
    if (!verifySameOrigin(req)) {
      return NextResponse.json(
        { error: 'Cross-origin request forbidden.' },
        { status: 403 }
      );
    }

    // 2. Rate limiting check
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(`advertise:${ip}`, ADVERTISE_RATE_LIMIT, ADVERTISE_WINDOW_MS);
    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit);
    }

    const body = await req.json().catch(() => ({}));
    const { productName, websiteUrl, email, slotDuration, preferredSlot, tagline, notes } = body;

    // 3. Input sanitization and length bounds
    const cleanProductName = sanitizeString(productName, 80);
    const cleanTagline = sanitizeString(tagline, 200);
    const cleanNotes = sanitizeString(notes, 1000);
    const cleanSlotDuration = sanitizeString(slotDuration, 40) || '1-week';
    const cleanPreferredSlot = sanitizeString(preferredSlot, 60) || 'Side Rail Slot';

    if (!cleanProductName || cleanProductName.length < 2) {
      return NextResponse.json(
        { error: 'Product or agent name is required (2 to 80 characters).' },
        { status: 400 }
      );
    }

    // 4. URL safety & SSRF prevention
    const urlCheck = isValidSafeUrl(websiteUrl);
    if (!urlCheck.valid) {
      return NextResponse.json(
        { error: `Invalid website or demo URL: ${urlCheck.reason}` },
        { status: 400 }
      );
    }

    // 5. Email format validation
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'A valid contact email address is required.' },
        { status: 400 }
      );
    }

    const inquiry: SponsorInquiry = {
      id: `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      productName: cleanProductName,
      websiteUrl: urlCheck.sanitizedUrl!,
      email: String(email).trim().toLowerCase(),
      slotDuration: cleanSlotDuration,
      preferredSlot: cleanPreferredSlot,
      tagline: cleanTagline || undefined,
      notes: cleanNotes || undefined,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    await saveInquiry(inquiry);

    // Dispatch instant email notification to site owner (mahomudulhasanrubel@gmail.com)
    try {
      await sendInquiryNotification(inquiry);
    } catch (emailErr) {
      console.error('[Advertise Route] Email notification error:', emailErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Sponsorship inquiry received. Confirmation sent to your email.',
        inquiryId: inquiry.id,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('Failed to process sponsor inquiry:', err);
    return NextResponse.json(
      { error: 'Server error processing inquiry. Please contact advertise@topagents.lol' },
      { status: 500 }
    );
  }
}
