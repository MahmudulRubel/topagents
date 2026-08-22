import { NextResponse } from 'next/server';
import { recordPointAction } from '@/lib/insforge';
import { PointActionPayload } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body: PointActionPayload = await request.json();

    if (!body || !body.action) {
      return NextResponse.json(
        { success: false, error: 'Missing required point action type' },
        { status: 400 }
      );
    }

    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    const result = await recordPointAction(body, clientIp);

    return NextResponse.json(result);
  } catch (error) {
    console.error('POST /api/points/action error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record point action' },
      { status: 500 }
    );
  }
}
