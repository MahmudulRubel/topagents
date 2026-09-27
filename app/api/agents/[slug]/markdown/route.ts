import { NextRequest, NextResponse } from 'next/server';
import { getAgentBySlugAsync } from '@/lib/data/server-agents';

export const revalidate = 3600; // 1 hour cache

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const agent = await getAgentBySlugAsync(params.slug);

  if (!agent) {
    return new NextResponse('Agent not found', { status: 404 });
  }

  const review = agent.editorialReview;
  const baseUrl = 'https://topagents.lol';

  const lines: string[] = [];

  lines.push(`# ${agent.name} — Technical Systems Teardown & Benchmark Review`);
  lines.push('');
  lines.push(`> **Tagline**: ${agent.tagline}`);
  lines.push(`> **Category**: ${agent.categoryLabel} | **Pricing**: ${agent.pricingLabel} | **Developer**: ${agent.developer}`);
  lines.push(`> **Rating**: ★ ${agent.overallRating.toFixed(1)} / 5.0 (${agent.reviewsCount} verified reviews, ${agent.upvotesCount} upvotes)`);
  lines.push(`> **Canonical URL**: ${baseUrl}/agents/${agent.slug}`);
  lines.push(`> **Official Website**: ${agent.websiteUrl}`);
  if (agent.githubUrl) {
    lines.push(`> **GitHub Repository**: ${agent.githubUrl}`);
  }
  lines.push('');

  lines.push('---');
  lines.push('');

  // 1. Executive Summary
  lines.push('## 1. Executive Summary & Market Thesis');
  lines.push('');
  lines.push(review.executiveSummary);
  lines.push('');

  // 2. Systems Architecture
  lines.push('## 2. System Architecture & Internal Mechanics');
  lines.push('');
  lines.push(review.architectureDeepDive);
  lines.push('');

  // 3. Core Capabilities
  lines.push('## 3. Core Capabilities');
  lines.push('');
  for (const cap of review.coreCapabilities) {
    lines.push(`- ${cap}`);
  }
  lines.push('');

  // 4. Enterprise Use Cases
  lines.push('## 4. Enterprise Production Scenarios & Case Studies');
  lines.push('');
  for (let i = 0; i < review.enterpriseUseCases.length; i++) {
    const uc = review.enterpriseUseCases[i];
    lines.push(`### Case Study ${i + 1}: ${uc.title}`);
    lines.push(`- **Operational Challenge**: ${uc.scenario}`);
    lines.push(`- **Agent Implementation**: ${uc.implementation}`);
    lines.push(`- **Quantifiable Impact**: ${uc.impact}`);
    lines.push('');
  }

  // 5. Benchmarks
  lines.push('## 5. Performance Benchmarks & Empirical Evaluation');
  lines.push('');
  for (const b of review.benchmarks) {
    lines.push(`- **${b.name}**: ${b.score}${b.baseline ? ` (Baseline: ${b.baseline})` : ''} — ${b.context}`);
  }
  lines.push('');

  // 6. Pricing Economics
  lines.push('## 6. Pricing Economics & Commercial Tiers');
  lines.push('');
  lines.push(review.pricingBreakdown);
  lines.push('');
  for (const tier of review.pricingTiers) {
    lines.push(`### ${tier.name} — ${tier.price}`);
    for (const f of tier.features) {
      lines.push(`  + ${f}`);
    }
    lines.push('');
  }

  // 7. Strengths & Limitations
  lines.push('## 7. Pros, Cons & Known Failure Modes');
  lines.push('');
  lines.push('### Strengths');
  for (const s of review.strengths) {
    lines.push(`- ${s}`);
  }
  lines.push('');
  lines.push('### Known Failure Modes & Limitations');
  for (const lim of review.failureModesAndLimitations) {
    lines.push(`- ${lim}`);
  }
  lines.push('');

  // 8. Competitors
  lines.push('## 8. Top Alternatives & Comparison Matrix');
  lines.push('');
  for (const comp of review.competitors) {
    lines.push(`### vs ${comp.competitorName} (${comp.category})`);
    lines.push(`- **Advantages**: ${comp.advantages}`);
    lines.push(`- **Drawbacks**: ${comp.drawbacks}`);
    lines.push('');
  }

  // 9. FAQs
  lines.push('## 9. Frequently Asked Questions (FAQ)');
  lines.push('');
  for (const faq of review.faqs) {
    lines.push(`### ${faq.question}`);
    lines.push(faq.answer);
    lines.push('');
  }

  // 10. Final Verdict
  lines.push('## 10. Architectural Verdict & Scorecard');
  lines.push('');
  lines.push(`- Autonomy: ${review.scorecard.autonomy} / 10`);
  lines.push(`- Reliability: ${review.scorecard.reliability} / 10`);
  lines.push(`- Developer Experience: ${review.scorecard.developerExperience} / 10`);
  lines.push(`- Value for Money: ${review.scorecard.valueForMoney} / 10`);
  lines.push('');
  lines.push(review.finalVerdict);

  return new NextResponse(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
