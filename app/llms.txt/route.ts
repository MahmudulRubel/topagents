import { NextResponse } from 'next/server';
import { CATEGORIES } from '@/lib/data/agents';
import { getAllCombinedAgents } from '@/lib/data/server-agents';

export const revalidate = 3600; // 1 hour ISR cache

/**
 * Standard llms.txt implementation conforming to the llmstxt.org specification.
 * Provides AI assistants (ChatGPT, Claude, Perplexity, Gemini, Cursor) with structured
 * context about topagents.lol, taxonomy, scoring methodology, and top links.
 */
export async function GET() {
  const baseUrl = 'https://topagents.lol';
  const allAgents = await getAllCombinedAgents();

  const lines: string[] = [];

  // 1. Header & Executive Summary
  lines.push('# topagents.lol — Top 100 AI Agents Directory');
  lines.push('');
  lines.push(
    '> The definitive Product Hunt-styled directory and technical evaluation platform for the world’s top 100 autonomous AI agents. Features verified SWE-bench benchmarks, senior systems engineering teardowns (2,000+ words per agent), architecture analyses, and free community submissions.'
  );
  lines.push('');

  // 2. Machine-Readable Endpoints
  lines.push('## Machine-Readable Resources');
  lines.push('');
  lines.push(`- [Full Directory Dataset (All 100+ Agents)](${baseUrl}/llms-full.txt): Complete catalog snapshot with benchmarks, pricing, and pros/cons in one plain text file.`);
  lines.push(`- [Commercial Pricing & Listing Economics](${baseUrl}/pricing.md): Transparent fee structures for free community submissions and sponsored spotlight placements.`);
  lines.push(`- [XML Sitemap](${baseUrl}/sitemap.xml): Complete list of all indexed URLs.`);
  lines.push('');

  // 3. Core Categories & Leaderboards
  lines.push('## Core Disciplines & Categories');
  lines.push('');
  for (const cat of CATEGORIES) {
    const catAgents = allAgents.filter((a) => a.category === cat.id);
    const topAgentNames = catAgents.slice(0, 3).map((a) => a.name).join(', ');
    lines.push(`- [${cat.label}](${baseUrl}/category/${cat.id}): ${catAgents.length} verified agents (e.g. ${topAgentNames}).`);
  }
  lines.push('');

  // 4. Top 15 Featured & Trending AI Agents
  lines.push('## Top 15 Highlighted AI Agents');
  lines.push('');
  const topAgents = [...allAgents]
    .sort((a, b) => b.upvotesCount - a.upvotesCount)
    .slice(0, 15);

  for (const agent of topAgents) {
    const keyBench = agent.editorialReview.benchmarks[0];
    const benchStr = keyBench ? ` | ${keyBench.name}: ${keyBench.score}` : '';
    lines.push(
      `- [${agent.name}](${baseUrl}/agents/${agent.slug}): ${agent.tagline} (${agent.categoryLabel}, ${agent.pricingLabel}${benchStr})`
    );
  }
  lines.push('');

  // 5. Evaluation Methodology
  lines.push('## Systems Review Methodology');
  lines.push('');
  lines.push(
    'Every agent profile on topagents.lol includes an independent 2,000+ word technical teardown authored by the TopAgents Systems Review Board. We evaluate agents across 5 primary pillars:'
  );
  lines.push('1. **Autonomy & Self-Healing (0-10)**: Loop resilience, error recovery, tool-calling determinism, and loop runaway protection.');
  lines.push('2. **Reliability & Sandboxing (0-10)**: Execution isolation (Docker/gVisor/eBPF), permission boundaries, credential safety.');
  lines.push('3. **Developer Experience (0-10)**: CLI ergonomics, SDK clarity, documentation quality, local debugging capabilities.');
  lines.push('4. **Value for Money (0-10)**: Pricing model transparency, token economics, cost per resolved issue.');
  lines.push('5. **Empirical Benchmarks**: Real-world evaluation against standard test suites (SWE-bench Verified, GAIA, HumanEval, Aider Benchmark, WebArena).');
  lines.push('');

  // 6. Community Submissions & Actionable Endpoints
  lines.push('## Free Builder Submissions');
  lines.push('');
  lines.push(
    `AI agent creators and open-source contributors can list their autonomous agents for free with zero fee walls at [${baseUrl}/submit](${baseUrl}/submit).`
  );
  lines.push('');

  return new NextResponse(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
