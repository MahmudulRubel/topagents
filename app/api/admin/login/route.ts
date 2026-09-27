import { NextRequest, NextResponse } from 'next/server';
import { validateAdminPasscode, attachAdminCookie } from '@/lib/auth/admin';
import { checkRateLimit, createRateLimitResponse, getClientIp } from '@/lib/security/rate-limit';
import { verifySameOrigin } from '@/lib/security/sanitize';

// 5 attempts per 15 minutes per IP
const LOGIN_RATE_LIMIT = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    // 1. CSRF origin check
    if (!verifySameOrigin(req)) {
      return NextResponse.json(
        { error: 'Cross-origin request forbidden.' },
        { status: 403 }
      );
    }

    // 2. Brute-force rate limiting
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(`login:${ip}`, LOGIN_RATE_LIMIT, LOGIN_WINDOW_MS);
    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit);
    }

    const body = await req.json().catch(() => ({}));
    const { passcode } = body;

    if (!passcode || typeof passcode !== 'string' || passcode.length > 128) {
      return NextResponse.json(
        { error: 'Valid admin passcode is required.' },
        { status: 400 }
      );
    }

    if (!validateAdminPasscode(passcode)) {
      return NextResponse.json(
        {
          error: 'Invalid admin passcode. Access denied.',
          remainingAttempts: rateLimit.remaining,
        },
        { status: 401 }
      );
    }

    const res = NextResponse.json({
      success: true,
      message: 'Admin session authenticated successfully.',
    });

    attachAdminCookie(res);
    return res;
  } catch (error: any) {
    console.error('Error during admin login:', error);
    return NextResponse.json(
      { error: 'Internal server error during authentication.' },
      { status: 500 }
    );
  }
}
