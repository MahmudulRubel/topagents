import { NextRequest, NextResponse } from 'next/server';
import { detachAdminCookie } from '@/lib/auth/admin';

export async function POST(req: NextRequest) {
  const res = NextResponse.json({
    success: true,
    message: 'Logged out successfully.',
  });

  detachAdminCookie(res);
  return res;
}
