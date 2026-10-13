import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { getAllAgents } from '@/lib/data/agents';
import { getAgentBySlugAsync } from '@/lib/data/server-agents';
import { generateAgentJsonLd } from '@/lib/seo/jsonld';
import AgentHeader from '@/components/agent-detail/AgentHeader';
import QuickSpecsCard from '@/components/agent-detail/QuickSpecsCard';
import TableOfContents from '@/components/agent-detail/TableOfContents';
import BenchmarkTable from '@/components/agent-detail/BenchmarkTable';
import ProsConsCard from '@/components/agent-detail/ProsConsCard';
import CompetitorsMatrix from '@/components/agent-detail/CompetitorsMatrix';
import FaqAccordion from '@/components/agent-detail/FaqAccordion';
import MarkdownContent from '@/components/agent-detail/MarkdownContent';

interface PageProps {
  params: {
    slug: string;
  };
}

export const dynamicParams = true;

// 1. Static Generation for all 100 AI Agents at build time
export async function generateStaticParams() {
  const agents = getAllAgents();
  return agents.map((agent) => ({
    slug: agent.slug,
  }));
}

// 2. Programmatic Dynamic SEO Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const agent = await getAgentBySlugAsync(params.slug);
  if (!agent) return {};

  const title = `${agent.name} Review (2026): What It Does, Pricing, Pros & Cons & Best Alternatives | TopAgents`;
  const description = `What is ${agent.name}? Easy-to-read 2026 guide and review of ${agent.name} (${agent.categoryLabel}). See how it works in plain English, real-world use cases, pricing (${agent.pricingLabel}), pros & cons, and top alternatives.`;

  return {
    title,
    description,
    keywords: [
      agent.name,
      `what is ${agent.name}`,
      `${agent.name} review`,
      `how to use ${agent.name}`,
      `${agent.name} pricing`,
      `${agent.name} alternatives`,
      agent.categoryLabel,
      'AI agents directory',
      'best AI agents 2026',
    ],
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://topagents.lol/agents/${agent.slug}`,
      siteName: 'topagents.lol',
      publishedTime: new Date(agent.releaseYear, 0, 1).toISOString(),
      authors: ['TopAgents Editorial Review Team'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://topagents.lol/agents/${agent.slug}`,
    },
  };
}

export default async function AgentDetailPage({ params }: PageProps) {
  const agent = await getAgentBySlugAsync(params.slug);
  if (!agent) notFound();

  const { editorialReview: review } = agent;
  const jsonLd = generateAgentJsonLd(agent);

  return (
    <div className="min-h-screen bg-[#FBFBFA]">
      {/* JSON-LD Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.softwareAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.reviewSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.breadcrumbSchema) }}
      />

      {/* Header Banner */}
      <AgentHeader agent={agent} />

      {/* Breadcrumb Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-6">
        <nav className="text-xs text-gray-500 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href={`/category/${agent.category}`} className="hover:text-gray-900 transition-colors">
            {agent.categoryLabel}
          </Link>
          <span>/</span>
          <span className="font-semibold text-gray-900">{agent.name}</span>
        </nav>
      </div>

      {/* AEO Fast Answer & Entity Grounding Box */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8">
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
            <span className="text-[#FF6154]">AEO Fast Answer: What is {agent.name}?</span>
            <span className="text-gray-400">Plain-English Summary</span>
          </div>
          <p className="text-sm text-gray-800 leading-relaxed font-medium">
            <strong>{agent.name}</strong> is a {agent.categoryLabel.toLowerCase()} AI agent built by <strong>{agent.developer}</strong> that helps users {agent.tagline.charAt(0).toLowerCase() + agent.tagline.slice(1)} Powered by {agent.primaryModel}, it offers {agent.pricingLabel.toLowerCase()} access ({agent.pricingModel}) and holds a verified user &amp; editorial rating of ★ {agent.overallRating.toFixed(1)}/5.0.
          </p>
          <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center gap-4 text-xs text-gray-500">
            <span>✓ Easy-to-Read Complete Guide</span>
            <span>·</span>
            <span>Updated October 2026</span>
            <span>·</span>
            <Link href={`/category/${agent.category}`} className="text-indigo-600 hover:underline font-semibold">
              Explore all {agent.categoryLabel} agents →
            </Link>
          </div>
        </div>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content Area (8 Cols on Desktop) */}
          <article className="lg:col-span-8 space-y-12 bg-white p-6 sm:p-10 rounded-2xl border border-gray-200 shadow-sm leading-relaxed text-gray-800">
            {/* Section 1: Executive Summary */}
            <section id="executive-summary" className="scroll-mt-24 space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <span className="text-xs font-bold text-[#FF6154] uppercase tracking-wider">
                  01 // Plain-English Overview
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
                  What is {agent.name} and Who Is It For?
                </h2>
              </div>
              <div className="text-sm sm:text-base leading-relaxed text-gray-700">
                <MarkdownContent content={review.executiveSummary} />
              </div>
            </section>

            {/* Section 2: Architecture Deep Dive */}
            <section id="architecture-deep-dive" className="scroll-mt-24 space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <span className="text-xs font-bold text-[#FF6154] uppercase tracking-wider">
                  02 // How It Works
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
                  How Does {agent.name} Work Step by Step?
                </h2>
              </div>
              <div className="text-sm sm:text-base leading-relaxed text-gray-700">
                <MarkdownContent content={review.architectureDeepDive} />
              </div>
            </section>

            {/* Section 3: Core Capabilities */}
            <section id="core-capabilities" className="scroll-mt-24 space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <span className="text-xs font-bold text-[#FF6154] uppercase tracking-wider">
                  03 // Key Features
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
                  What Can {agent.name} Do? (Top Features &amp; Capabilities)
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-3.5 pt-2">
                {review.coreCapabilities.map((cap, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-gray-150 bg-gray-50/70 flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                      {cap}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 4: Enterprise Use Cases */}
            <section id="enterprise-use-cases" className="scroll-mt-24 space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <span className="text-xs font-bold text-[#FF6154] uppercase tracking-wider">
                  04 // Practical Examples
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
                  Real-World Use Cases &amp; Everyday Examples
                </h2>
              </div>
              <div className="space-y-4">
                {review.enterpriseUseCases.map((uc, idx) => (
                  <div key={idx} className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm space-y-3">
                    <h3 className="text-base font-bold text-gray-900">
                      Example {idx + 1}: {uc.title}
                    </h3>
                    <div className="text-xs sm:text-sm text-gray-600 space-y-2">
                      <p>
                        <strong className="text-gray-800">The Problem:</strong> {uc.scenario}
                      </p>
                      <p>
                        <strong className="text-gray-800">How {agent.name} Helps:</strong> {uc.implementation}
                      </p>
                      <p className="text-emerald-800 font-semibold bg-emerald-50 p-2.5 rounded-lg border border-emerald-200/60">
                        <strong>Real-World Result:</strong> {uc.impact}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 5: Quickstart Guide */}
            <section id="quickstart-guide" className="scroll-mt-24 space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <span className="text-xs font-bold text-[#FF6154] uppercase tracking-wider">
                  05 // Beginner Guide
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
                  How to Get Started with {agent.name} (Step-by-Step)
                </h2>
              </div>
              <div className="space-y-4">
                {review.quickstartGuide.map((step, idx) => (
                  <div key={idx} className="space-y-2">
                    <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#FF6154] text-white text-[11px] font-black flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span>{step.title}</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 pl-7 leading-relaxed">
                      {step.instructions}
                    </p>
                    {step.codeSnippet && (
                      <div className="pl-7 pt-1">
                        <pre className="p-3.5 rounded-xl bg-gray-950 text-gray-200 text-xs font-mono overflow-x-auto border border-gray-800">
                          <code>{step.codeSnippet}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Section 6: Benchmarks & Empirical Evaluation */}
            <section id="benchmarks-evaluation" className="scroll-mt-24 space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <span className="text-xs font-bold text-[#FF6154] uppercase tracking-wider">
                  06 // Speed &amp; Accuracy
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
                  {agent.name} Performance, Speed &amp; Reliability Benchmarks
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Real-world performance numbers, accuracy rates, and speed comparisons for {agent.name} compared against standard baselines:
              </p>
              <BenchmarkTable benchmarks={review.benchmarks} />
              <div className="p-3 bg-gray-50 border border-gray-150 rounded-xl text-xs text-gray-500 leading-relaxed">
                <strong className="text-gray-700">How We Test:</strong> Benchmark scores are compiled from official product documentation, public industry benchmarks (such as SWE-bench and GAIA), and real-world task testing.
              </div>
            </section>

            {/* Section 7: Pricing Economics */}
            <section id="pricing-economics" className="scroll-mt-24 space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <span className="text-xs font-bold text-[#FF6154] uppercase tracking-wider">
                  07 // Pricing &amp; Plans
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
                  How Much Does {agent.name} Cost? (Pricing &amp; Value Guide)
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                <MarkdownContent content={review.pricingBreakdown} />
              </div>

              {/* Pricing Tiers Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {review.pricingTiers.map((tier, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border ${
                      tier.highlighted
                        ? 'border-[#FF6154] bg-[#FFF8F7]'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-sm text-gray-900">{tier.name}</h4>
                      {tier.highlighted && (
                        <span className="text-[10px] uppercase tracking-wide font-black px-1.5 py-0.5 rounded bg-[#FF6154] text-white">
                          Popular
                        </span>
                      )}
                    </div>
                    <div className="text-xl font-black text-gray-900 font-mono mb-2.5">
                      {tier.price}
                    </div>
                    <ul className="space-y-1.5 text-xs text-gray-600">
                      {tier.features.map((f, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-1.5">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 8: Strengths & Pitfalls */}
            <section id="strengths-and-pitfalls" className="scroll-mt-24 space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <span className="text-xs font-bold text-[#FF6154] uppercase tracking-wider">
                  08 // Honest Pros &amp; Cons
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
                  {agent.name} Pros, Cons &amp; Things to Watch Out For
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                A balanced, plain-English look at what {agent.name} does best and where it still has limitations:
              </p>
              <ProsConsCard
                strengths={review.strengths}
                limitations={review.failureModesAndLimitations}
              />
            </section>

            {/* Section 9: Competitor Matrix */}
            <section id="competitor-comparison" className="scroll-mt-24 space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <span className="text-xs font-bold text-[#FF6154] uppercase tracking-wider">
                  09 // Alternatives Compared
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
                  Best {agent.name} Alternatives &amp; Competitors (2026)
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                How {agent.name} stacks up against the top competing tools in {agent.categoryLabel}:
              </p>
              <CompetitorsMatrix agentName={agent.name} competitors={review.competitors} />
            </section>

            {/* Section 10: Technical FAQs */}
            <section id="developer-faqs" className="scroll-mt-24 space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <span className="text-xs font-bold text-[#FF6154] uppercase tracking-wider">
                  10 // Common Questions
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
                  Frequently Asked Questions About {agent.name}
                </h2>
              </div>
              <FaqAccordion faqs={review.faqs} />
            </section>

            {/* Section 11: Final Verdict & Scorecard */}
            <section id="final-verdict" className="scroll-mt-24 space-y-6 pt-4 border-t border-gray-200">
              <div className="border-b border-gray-100 pb-3">
                <span className="text-xs font-bold text-[#FF6154] uppercase tracking-wider">
                  11 // Final Recommendation
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
                  Final Verdict: Is {agent.name} Worth It?
                </h2>
              </div>

              {/* Scorecard Visual Bars */}
              <div className="p-6 rounded-xl bg-gray-50 border border-gray-200 space-y-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                  TopAgents Evaluation Scorecard
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Autonomy & Self-Healing</span>
                      <span className="font-mono">{review.scorecard.autonomy} / 10</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${review.scorecard.autonomy * 10}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Reliability & Sandboxing</span>
                      <span className="font-mono">{review.scorecard.reliability} / 10</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${review.scorecard.reliability * 10}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Developer Experience</span>
                      <span className="font-mono">{review.scorecard.developerExperience} / 10</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${review.scorecard.developerExperience * 10}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Value for Money</span>
                      <span className="font-mono">{review.scorecard.valueForMoney} / 10</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${review.scorecard.valueForMoney * 10}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-sm sm:text-base text-gray-700 leading-relaxed">
                <MarkdownContent content={review.finalVerdict} />
              </div>
            </section>
          </article>

          {/* Sticky Sidebar (4 Cols on Desktop) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
            <QuickSpecsCard agent={agent} />
            <TableOfContents />
          </aside>
        </div>
      </main>
    </div>
  );
}
