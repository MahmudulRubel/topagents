import { NextRequest, NextResponse } from 'next/server';
import { getAgentBySlug } from '@/lib/data/agents';

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const agent = getAgentBySlug(slug);

    if (!agent) {
      return NextResponse.json(
        { error: `Agent with slug "${slug}" not found.` },
        { status: 404 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const action = body?.action === 'remove' ? 'remove' : 'upvote';

    // In a full DB persistence setup, this would atomically increment/decrement in Postgres.
    // Here we compute optimistic new vote count and return success.
    const delta = action === 'upvote' ? 1 : -1;
    const currentVotes = agent.upvotesCount + delta;

    return NextResponse.json({
      success: true,
      slug,
      action,
      upvotes: Math.max(0, currentVotes),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Error updating upvote' },
      { status: 500 }
    );
  }
}
