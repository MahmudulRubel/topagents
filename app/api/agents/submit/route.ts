import { NextRequest, NextResponse } from 'next/server';
import { generateAgentEditorial, BANNED_SLOP_PHRASES } from '@/lib/ai/deepseek';
import { saveSubmission, getSubmissionBySlug, AgentSubmissionRecord } from '@/lib/data/submissions';
import { allAgents } from '@/lib/data/agents';
import { AgentCategory, CommunitySubmission, PricingModel } from '@/lib/data/types';
import { checkRateLimit, createRateLimitResponse, getClientIp } from '@/lib/security/rate-limit';
import { sanitizeString, isValidSafeUrl, verifySameOrigin } from '@/lib/security/sanitize';

// 5 agent submissions per hour per IP to protect AI compute and storage
const SUBMIT_RATE_LIMIT = 5;
const SUBMIT_WINDOW_MS = 60 * 60 * 1000;

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
    // 1. CSRF origin verification
    if (!verifySameOrigin(req)) {
      return NextResponse.json(
        { error: 'Cross-origin request forbidden.' },
        { status: 403 }
      );
    }

    // 2. Rate limiting check
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(`submit:${ip}`, SUBMIT_RATE_LIMIT, SUBMIT_WINDOW_MS);
    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit);
    }

    // 3. Body parsing with size/type guard
    const body = await req.json().catch(() => ({}));
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

    // 4. Strict input sanitization and length limits
    const cleanAgentName = sanitizeString(agentName, 80);
    const cleanTagline = sanitizeString(tagline, 200);
    const cleanDescription = sanitizeString(description, 3000);
    const cleanSubmitterHandle = sanitizeString(submitterHandle, 60);

    if (!cleanAgentName || cleanAgentName.length < 2) {
      return NextResponse.json(
        { error: 'Agent name is required (2 to 80 characters).' },
        { status: 400 }
      );
    }

    if (!cleanTagline || cleanTagline.length < 10) {
      return NextResponse.json(
        { error: 'A concise technical tagline is required (10 to 200 characters).' },
        { status: 400 }
      );
    }

    // 5. SSRF & URL safety validation for websiteUrl
    const websiteCheck = isValidSafeUrl(websiteUrl);
    if (!websiteCheck.valid) {
      return NextResponse.json(
        { error: `Invalid official website URL: ${websiteCheck.reason}` },
        { status: 400 }
      );
    }

    // 6. SSRF & URL safety validation for githubUrl if provided
    let cleanGithubUrl: string | undefined;
    if (githubUrl) {
      const githubCheck = isValidSafeUrl(githubUrl);
      if (!githubCheck.valid) {
        return NextResponse.json(
          { error: `Invalid GitHub repository URL: ${githubCheck.reason}` },
          { status: 400 }
        );
      }
      cleanGithubUrl = githubCheck.sanitizedUrl;
    }

    // 7. Slop check on submission content
    const combinedText = `${cleanTagline} ${cleanDescription}`.toLowerCase();
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
      agentName: cleanAgentName,
      tagline: cleanTagline,
      category: cleanCategory,
      pricingModel: cleanPricing,
      websiteUrl: websiteCheck.sanitizedUrl!,
      githubUrl: cleanGithubUrl,
      description: cleanDescription,
      submitterHandle: cleanSubmitterHandle || undefined,
    };

    // 8. Generate unique slug
    const baseSlug = createSlug(communitySub.agentName);
    const slug = await resolveUniqueSlug(baseSlug);

    // 9. Call DeepSeek AI Editorial Engine
    console.log(`[Submit Route] Generating DeepSeek editorial review for ${communitySub.agentName}...`);
    const { editorial, quality, source } = await generateAgentEditorial(communitySub);

    // 10. Auto-publish if quality checks pass
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
