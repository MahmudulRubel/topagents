import { NextResponse } from 'next/server';
import { getAllCombinedAgents } from '@/lib/data/server-agents';

export const revalidate = 3600; // 1 hour ISR cache

/**
 * llms-full.txt: Comprehensive machine-readable snapshot of all 100+ AI agents.
 * Enables AI search engines and autonomous buying agents to ingest the entire directory
 * in a single request without crawling hundreds of individual URLs.
 */
export async function GET() {
  const baseUrl = 'https://topagents.lol';
  const allAgents = await getAllCombinedAgents();

  const lines: string[] = [];

  lines.push('# topagents.lol — Complete Autonomous AI Agent Catalog (Full Dataset)');
  lines.push('');
  lines.push(`Total Verified Agents: ${allAgents.length}`);
  lines.push(`Catalog Date: September 2026`);
  lines.push(`Base URL: ${baseUrl}`);
  lines.push('');
  lines.push('---');
  lines.push('');

  for (let i = 0; i < allAgents.length; i++) {
    const agent = allAgents[i];
    const review = agent.editorialReview;

    lines.push(`## ${i + 1}. ${agent.name} (${agent.categoryLabel})`);
    lines.push(`- **Tagline**: ${agent.tagline}`);
    lines.push(`- **Directory URL**: ${baseUrl}/agents/${agent.slug}`);
    lines.push(`- **Official Website**: ${agent.websiteUrl}`);
    if (agent.githubUrl) {
      lines.push(`- **GitHub Repository**: ${agent.githubUrl}`);
    }
    lines.push(`- **Developer / Organization**: ${agent.developer}`);
    lines.push(`- **Release Year**: ${agent.releaseYear}`);
    lines.push(`- **Pricing Model**: ${agent.pricingLabel} (${agent.pricingModel})`);
    lines.push(`- **Primary LLM Backbone**: ${agent.primaryModel}`);
    lines.push(`- **License**: ${agent.license}`);
    lines.push(`- **Community Rating**: ★ ${agent.overallRating.toFixed(1)} / 5.0 (${agent.reviewsCount} reviews, ${agent.upvotesCount} upvotes)`);

    // Benchmarks
    if (review.benchmarks && review.benchmarks.length > 0) {
      const benchmarkStrs = review.benchmarks.map(
        (b) => `${b.name}: ${b.score}${b.baseline ? ` (vs baseline ${b.baseline})` : ''}`
      );
      lines.push(`- **Key Benchmarks**: ${benchmarkStrs.join('; ')}`);
    }

    // Scorecard
    if (review.scorecard) {
      lines.push(
        `- **Evaluation Scorecard**: Autonomy ${review.scorecard.autonomy}/10, Reliability ${review.scorecard.reliability}/10, DevEx ${review.scorecard.developerExperience}/10, Value ${review.scorecard.valueForMoney}/10`
      );
    }

    // Strengths
    if (review.strengths && review.strengths.length > 0) {
      lines.push(`- **Top Strengths**:`);
      for (const s of review.strengths.slice(0, 3)) {
        lines.push(`  + ${s}`);
      }
    }

    // Limitations / Failure Modes
    if (review.failureModesAndLimitations && review.failureModesAndLimitations.length > 0) {
      lines.push(`- **Known Failure Modes & Limitations**:`);
      for (const f of review.failureModesAndLimitations.slice(0, 2)) {
        lines.push(`  - ${f}`);
      }
    }

    // Top Competitors
    if (review.competitors && review.competitors.length > 0) {
      const compNames = review.competitors.map((c) => c.competitorName).join(', ');
      lines.push(`- **Primary Alternatives**: ${compNames}`);
    }

    lines.push('');
  }

  return new NextResponse(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
