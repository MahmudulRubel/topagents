import { NextRequest, NextResponse } from 'next/server';
import { validateAdminPasscode, attachAdminCookie } from '@/lib/auth/admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { passcode } = body;

    if (!passcode || typeof passcode !== 'string') {
      return NextResponse.json(
        { error: 'Admin passcode is required.' },
        { status: 400 }
      );
    }

    if (!validateAdminPasscode(passcode)) {
      return NextResponse.json(
        { error: 'Invalid admin passcode. Access denied.' },
        { status: 401 }
      );
    }

    const res = NextResponse.json({
      success: true,
      message: 'Admin session authenticated.',
    });

    attachAdminCookie(res);
    return res;
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Server error during login.' },
      { status: 500 }
    );
  }
}
