import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedAdmin } from '@/lib/auth/admin';
import { getInquiries } from '@/lib/data/inquiries';

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

    const all = await getInquiries();
    const filtered = status === 'all' ? all : all.filter((i) => i.status === status);

    const stats = {
      total: all.length,
      pending: all.filter((i) => i.status === 'pending').length,
      contacted: all.filter((i) => i.status === 'contacted').length,
      confirmed: all.filter((i) => i.status === 'confirmed').length,
      // Estimated total pipeline value based on pricing ($49/mo, $89/2mo, $149/3mo)
      estimatedValue: all.reduce((sum, i) => {
        if (i.slotDuration.includes('3-month') || i.slotDuration.includes('1-month-legacy')) return sum + 149;
        if (i.slotDuration.includes('2-month') || i.slotDuration.includes('2-week')) return sum + 89;
        return sum + 49;
      }, 0),
    };

    return NextResponse.json({
      success: true,
      stats,
      inquiries: filtered,
    });
  } catch (error: any) {
    console.error('[Admin Inquiries API Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to list inquiries.' },
      { status: 500 }
    );
  }
}
