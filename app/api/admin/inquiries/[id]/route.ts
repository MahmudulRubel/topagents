import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedAdmin } from '@/lib/auth/admin';
import { updateInquiryStatus } from '@/lib/data/inquiries';

interface RouteContext {
  params: {
    id: string;
  };
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json(
      { error: 'Unauthorized. Admin session required.' },
      { status: 401 }
    );
  }

  try {
    const { id } = params;
    const body = await req.json().catch(() => ({}));
    const { status, notes } = body;

    const validStatuses = ['pending', 'contacted', 'confirmed'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be pending, contacted, or confirmed.' },
        { status: 400 }
      );
    }

    const updated = await updateInquiryStatus(id, status, notes);
    if (!updated) {
      return NextResponse.json(
        { error: 'Inquiry not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      inquiry: updated,
    });
  } catch (error: any) {
    console.error('[Admin Update Inquiry API Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update inquiry.' },
      { status: 500 }
    );
  }
}
