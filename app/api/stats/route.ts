import { NextResponse } from 'next/server';
import { getSiteStats, getRecentOutbids, recordVisitorHeartbeat } from '@/lib/insforge';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [stats, recentOutbids] = await Promise.all([
      getSiteStats(),
      getRecentOutbids(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        stats,
        recentOutbids,
      },
    });
  } catch (error) {
    console.error('GET /api/stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch site statistics' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const updatedStats = await recordVisitorHeartbeat();
    return NextResponse.json({
      success: true,
      data: updatedStats,
    });
  } catch (error) {
    console.error('POST /api/stats heartbeat error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update visitor heartbeat' },
      { status: 500 }
    );
  }
}
