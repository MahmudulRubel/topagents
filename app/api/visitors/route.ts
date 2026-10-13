import { NextRequest, NextResponse } from 'next/server';
import {
  deriveFallbackVisitorId,
  getVisitorStats,
  recordVisitorHeartbeat,
} from '@/lib/data/visitors';
import { checkRateLimit, createRateLimitResponse, getClientIp } from '@/lib/security/rate-limit';
import { verifySameOrigin } from '@/lib/security/sanitize';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// 60 heartbeats per minute per IP (allows multiple open tabs while blocking flood bots)
const HEARTBEAT_RATE_LIMIT = 60;
const HEARTBEAT_WINDOW_MS = 60 * 1000;

export async function GET() {
  try {
    const stats = await getVisitorStats();
    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to read visitor stats' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!verifySameOrigin(req)) {
      return NextResponse.json(
        { error: 'Cross-origin request forbidden.' },
        { status: 403 }
      );
    }

    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(`visitor-hb:${ip}`, HEARTBEAT_RATE_LIMIT, HEARTBEAT_WINDOW_MS);
    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit);
    }

    const body = await req.json().catch(() => ({}));
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const rawVisitorId =
      typeof body?.visitorId === 'string' && body.visitorId.trim().length >= 6
        ? body.visitorId.trim()
        : deriveFallbackVisitorId(ip, userAgent);
    const isPageview = Boolean(body?.isPageview);

    const stats = await recordVisitorHeartbeat(rawVisitorId, isPageview);

    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to record visitor heartbeat' },
      { status: 500 }
    );
  }
}
