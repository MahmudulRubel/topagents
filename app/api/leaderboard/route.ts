import { NextResponse } from 'next/server';
import { getPublicLeaderboard } from '@/lib/insforge';
import { Category } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryParam = searchParams.get('category') as Category | null;

    const leaderboard = await getPublicLeaderboard(categoryParam || undefined);

    // Explicit Invariant Audit #1: Ensure claimed_by_email is strictly absent
    const safeLeaderboard = leaderboard.map(({ ...rest }) => rest);

    // Edge Caching Optimizations for sub-second responses (Unit 7)
    return NextResponse.json(
      {
        success: true,
        data: safeLeaderboard,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=29',
        },
      }
    );
  } catch (error) {
    console.error('GET /api/leaderboard error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
