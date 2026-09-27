import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedAdmin } from '@/lib/auth/admin';
import { getSubmissionById, updateSubmission, deleteSubmission } from '@/lib/data/submissions';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const submission = await getSubmissionById(params.id);
  if (!submission) {
    return NextResponse.json({ error: 'Submission not found.' }, { status: 404 });
  }

  return NextResponse.json({ success: true, submission });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const updates = await req.json();
    const updated = await updateSubmission(params.id, updates);

    if (!updated) {
      return NextResponse.json({ error: 'Submission not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Submission updated successfully.',
      submission: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to update submission.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const success = await deleteSubmission(params.id);
    return NextResponse.json({
      success,
      message: 'Submission deleted successfully.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to delete submission.' },
      { status: 500 }
    );
  }
}
