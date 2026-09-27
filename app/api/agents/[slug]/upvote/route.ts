import { NextRequest, NextResponse } from 'next/server';
import { getAgentBySlug } from '@/lib/data/agents';
import { getSubmissionBySlug } from '@/lib/data/submissions';
import { checkRateLimit, createRateLimitResponse, getClientIp } from '@/lib/security/rate-limit';
import { verifySameOrigin } from '@/lib/security/sanitize';

// 30 upvotes per minute per IP to prevent automated vote stuffing
const UPVOTE_RATE_LIMIT = 30;
const UPVOTE_WINDOW_MS = 60 * 1000;

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // 1. CSRF origin check
    if (!verifySameOrigin(req)) {
      return NextResponse.json(
        { error: 'Cross-origin request forbidden.' },
        { status: 403 }
      );
    }

    // 2. Upvote rate limiting
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(`upvote:${ip}`, UPVOTE_RATE_LIMIT, UPVOTE_WINDOW_MS);
    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit);
    }

    const { slug } = params;
    const staticAgent = getAgentBySlug(slug);
    const dynamicSubmission = !staticAgent ? await getSubmissionBySlug(slug) : null;

    if (!staticAgent && !dynamicSubmission) {
      return NextResponse.json(
        { error: `Agent with slug "${slug}" not found.` },
        { status: 404 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const action = body?.action === 'remove' ? 'remove' : 'upvote';

    const baseVotes = staticAgent ? staticAgent.upvotesCount : 10;
    const delta = action === 'upvote' ? 1 : -1;
    const currentVotes = Math.max(0, baseVotes + delta);

    return NextResponse.json({
      success: true,
      slug,
      action,
      upvotes: currentVotes,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Error updating upvote' },
      { status: 500 }
    );
  }
}
