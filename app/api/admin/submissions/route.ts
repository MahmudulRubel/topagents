import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedAdmin } from '@/lib/auth/admin';
import { listSubmissions } from '@/lib/data/submissions';

export async function GET(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json(
      { error: 'Unauthorized. Admin session required.' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'all';

    const all = await listSubmissions('all');
    const filtered = status === 'all' ? all : all.filter((s) => s.status === status);

    const stats = {
      total: all.length,
      published: all.filter((s) => s.status === 'published').length,
      flagged: all.filter((s) => s.status === 'flagged').length,
      pending: all.filter((s) => s.status === 'pending_review').length,
      rejected: all.filter((s) => s.status === 'rejected').length,
      averageWordCount:
        all.length > 0
          ? Math.round(all.reduce((acc, s) => acc + (s.wordCount || 0), 0) / all.length)
          : 0,
      deepseekModel: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
      hasApiKey: !!(process.env.DEEPSEEK_API_KEY && process.env.DEEPSEEK_API_KEY !== 'demo_key'),
    };

    return NextResponse.json({
      success: true,
      stats,
      submissions: filtered,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to list submissions.' },
      { status: 500 }
    );
  }
}
