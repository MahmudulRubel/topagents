import { NextRequest, NextResponse } from 'next/server';

const BANNED_SLOP = [
  "in today's fast-paced digital landscape",
  'delve into',
  'testament to',
  'game-changer',
  'revolutionize',
  'seamlessly blend',
  'beacon of innovation',
  'tapestry of',
  'crucial role',
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      agentName,
      tagline,
      category,
      pricingModel,
      websiteUrl,
      githubUrl,
      description,
      submitterHandle,
    } = body;

    if (!agentName || typeof agentName !== 'string' || agentName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Agent name is required (minimum 2 characters).' },
        { status: 400 }
      );
    }

    if (!tagline || typeof tagline !== 'string' || tagline.trim().length < 10) {
      return NextResponse.json(
        { error: 'A concise technical tagline is required (minimum 10 characters).' },
        { status: 400 }
      );
    }

    if (!websiteUrl || typeof websiteUrl !== 'string' || !websiteUrl.startsWith('http')) {
      return NextResponse.json(
        { error: 'A valid website or repository URL is required (must start with http:// or https://).' },
        { status: 400 }
      );
    }

    // Slop check on submission content
    const combinedText = `${tagline} ${description || ''}`.toLowerCase();
    for (const phrase of BANNED_SLOP) {
      if (combinedText.includes(phrase)) {
        return NextResponse.json(
          {
            error: `Submission contains promotional AI fluff ("${phrase}"). Please use concrete engineering terminology.`,
          },
          { status: 422 }
        );
      }
    }

    // Submission sanitized record
    const submission = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      agentName: agentName.trim(),
      tagline: tagline.trim(),
      category: category || 'coding',
      pricingModel: pricingModel || 'freemium',
      websiteUrl: websiteUrl.trim(),
      githubUrl: githubUrl ? githubUrl.trim() : null,
      description: description ? description.trim() : '',
      submitterHandle: submitterHandle ? submitterHandle.trim() : 'anonymous',
      submittedAt: new Date().toISOString(),
      status: 'pending_editorial_review',
    };

    console.log('[Free Agent Submission Received]', submission);

    return NextResponse.json(
      {
        success: true,
        message: 'Agent submitted successfully! Our editorial team reviews every submission for technical rigor within 24-48 hours.',
        submissionId: submission.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error processing agent submission:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error processing submission.' },
      { status: 500 }
    );
  }
}
