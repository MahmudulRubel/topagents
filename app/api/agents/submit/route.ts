import { NextRequest, NextResponse } from 'next/server';
import { generateAgentEditorial, BANNED_SLOP_PHRASES } from '@/lib/ai/deepseek';
import { saveSubmission, getSubmissionBySlug, AgentSubmissionRecord } from '@/lib/data/submissions';
import { allAgents } from '@/lib/data/agents';
import { AgentCategory, CommunitySubmission, PricingModel } from '@/lib/data/types';

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

async function resolveUniqueSlug(baseSlug: string): Promise<string> {
  let candidate = baseSlug || 'agent';
  let counter = 1;

  while (true) {
    const staticExists = allAgents.some((a) => a.slug === candidate);
    const subExists = await getSubmissionBySlug(candidate);

    if (!staticExists && !subExists) {
      return candidate;
    }

    counter++;
    candidate = `${baseSlug}-${counter}`;
  }
}

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
    for (const phrase of BANNED_SLOP_PHRASES) {
      if (combinedText.includes(phrase)) {
        return NextResponse.json(
          {
            error: `Submission contains promotional AI fluff ("${phrase}"). Please use concrete engineering terminology.`,
          },
          { status: 422 }
        );
      }
    }

    const cleanCategory: AgentCategory = (category as AgentCategory) || 'coding';
    const cleanPricing: PricingModel = (pricingModel as PricingModel) || 'freemium';

    const communitySub: CommunitySubmission = {
      agentName: agentName.trim(),
      tagline: tagline.trim(),
      category: cleanCategory,
      pricingModel: cleanPricing,
      websiteUrl: websiteUrl.trim(),
      githubUrl: githubUrl ? githubUrl.trim() : undefined,
      description: description ? description.trim() : '',
      submitterHandle: submitterHandle ? submitterHandle.trim() : undefined,
    };

    // Generate unique slug
    const baseSlug = createSlug(communitySub.agentName);
    const slug = await resolveUniqueSlug(baseSlug);

    // Call DeepSeek AI Editorial Engine
    console.log(`[Submit Route] Generating DeepSeek editorial review for ${communitySub.agentName}...`);
    const { editorial, quality, source } = await generateAgentEditorial(communitySub);

    // Auto-publish if quality checks pass
    const isApproved = quality.isValid;
    const status = isApproved ? 'published' : 'flagged';

    const submissionId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const submissionRecord: AgentSubmissionRecord = {
      id: submissionId,
      slug,
      agentName: communitySub.agentName,
      tagline: communitySub.tagline,
      category: communitySub.category,
      pricingModel: communitySub.pricingModel,
      websiteUrl: communitySub.websiteUrl,
      githubUrl: communitySub.githubUrl,
      submitterHandle: communitySub.submitterHandle,
      description: communitySub.description,
      status,
      source,
      wordCount: quality.wordCount,
      editorialData: editorial,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveSubmission(submissionRecord);
    console.log(`[Submit Route] Saved submission ${submissionId} with status '${status}'.`);

    return NextResponse.json(
      {
        success: true,
        submissionId: submissionRecord.id,
        slug: submissionRecord.slug,
        status: submissionRecord.status,
        wordCount: submissionRecord.wordCount,
        source: submissionRecord.source,
        message:
          status === 'published'
            ? 'Agent published live! A comprehensive 2,000+ words technical review was generated and verified.'
            : 'Agent submitted successfully and queued for admin editorial review.',
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
