import { NextResponse } from 'next/server';
import { recordClick } from '@/lib/insforge';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { agent_id } = body;

    if (!agent_id) {
      return NextResponse.json(
        { success: false, error: 'agent_id is required' },
        { status: 400 }
      );
    }

    await recordClick(agent_id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST /api/click error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record click' },
      { status: 500 }
    );
  }
}
