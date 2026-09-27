import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedAdmin } from '@/lib/auth/admin';
import { getSubmissionById, updateSubmission } from '@/lib/data/submissions';
import { generateAgentEditorial } from '@/lib/ai/deepseek';
import { CommunitySubmission } from '@/lib/data/types';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const existing = await getSubmissionById(params.id);
  if (!existing) {
    return NextResponse.json({ error: 'Submission not found.' }, { status: 404 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const customNotes = body.customNotes || '';

    const communitySub: CommunitySubmission = {
      agentName: existing.agentName,
      tagline: existing.tagline,
      category: existing.category,
      pricingModel: existing.pricingModel,
      websiteUrl: existing.websiteUrl,
      githubUrl: existing.githubUrl,
      description: customNotes
        ? `${existing.description || ''}\nAdmin Directives: ${customNotes}`
        : existing.description || '',
      submitterHandle: existing.submitterHandle,
    };

    console.log(`[Admin] Triggering DeepSeek regeneration for ${existing.agentName}...`);
    const { editorial, quality, source } = await generateAgentEditorial(communitySub);

    const updated = await updateSubmission(existing.id, {
      editorialData: editorial,
      wordCount: quality.wordCount,
      source,
      status: quality.isValid ? 'published' : 'flagged',
    });

    return NextResponse.json({
      success: true,
      message: 'Editorial review regenerated successfully.',
      submission: updated,
      quality,
    });
  } catch (error: any) {
    console.error('Error regenerating editorial review:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to regenerate editorial review.' },
      { status: 500 }
    );
  }
}
