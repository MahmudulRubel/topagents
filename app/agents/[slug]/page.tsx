import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { getAllAgents, getAgentBySlug } from '@/lib/data/agents';
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

// 1. Static Generation for all 100 AI Agents at build time
export async function generateStaticParams() {
  const agents = getAllAgents();
  return agents.map((agent) => ({
    slug: agent.slug,
  }));
}

// 2. Programmatic Dynamic SEO Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const agent = getAgentBySlug(params.slug);
  if (!agent) return {};

  const title = `${agent.name} Review (2026): Architecture, Benchmarks, Pricing & Alternatives | TopAgents`;
  const description = `In-depth technical systems review of ${agent.name} (${agent.categoryLabel}). Analysis of execution loops, memory architecture, SWE-bench performance, pricing, pros/cons, and verified FAQs.`;

  return {
    title,
    description,
    keywords: [
      agent.name,
      `${agent.name} review`,
      `${agent.name} benchmarks`,
      `${agent.name} pricing`,
      `${agent.name} alternatives`,
      agent.categoryLabel,
      'AI agents directory',
      'autonomous agents',
    ],
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://topagents.lol/agents/${agent.slug}`,
      siteName: 'topagents.lol',
      publishedTime: new Date(agent.releaseYear, 0, 1).toISOString(),
      authors: ['TopAgents Systems Review Board'],
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

export default function AgentDetailPage({ params }: PageProps) {
  const agent = getAgentBySlug(params.slug);
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
          <Link href={`/?category=${agent.category}`} className="hover:text-gray-900 transition-colors">
            {agent.categoryLabel}
          </Link>
          <span>/</span>
          <span className="font-semibold text-gray-900">{agent.name}</span>
        </nav>
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
                  01 // Overview & Market Thesis
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
                  Executive Overview: What is {agent.name}?
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
                  02 // Systems Engineering
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
                  System Architecture & Internal Mechanics
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
                  03 // Key Capabilities
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
                  Core Capabilities & Developer Ergonomics
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
                  04 // Real-World Production
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
                  Enterprise Production Scenarios & Case Studies
                </h2>
              </div>
              <div className="space-y-4">
                {review.enterpriseUseCases.map((uc, idx) => (
                  <div key={idx} className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm space-y-3">
                    <h3 className="text-base font-bold text-gray-900">
                      Case Study {idx + 1}: {uc.title}
                    </h3>
                    <div className="text-xs sm:text-sm text-gray-600 space-y-2">
                      <p>
                        <strong className="text-gray-800">Operational Challenge:</strong> {uc.scenario}
                      </p>
                      <p>
                        <strong className="text-gray-800">Agent Implementation:</strong> {uc.implementation}
                      </p>
                      <p className="text-emerald-800 font-semibold bg-emerald-50 p-2.5 rounded-lg border border-emerald-200/60">
                        <strong>Quantifiable Impact:</strong> {uc.impact}
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
                  05 // Step-by-Step Tutorial
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
                  Getting Started & Installation Guide
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
                  06 // Empirical Metrics
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
                  Performance Benchmarks & Accuracy Metrics
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Empirical evaluation results and real-world task resolution metrics for {agent.name} compared against industry baselines:
              </p>
              <BenchmarkTable benchmarks={review.benchmarks} />
            </section>

            {/* Section 7: Pricing Economics */}
            <section id="pricing-economics" className="scroll-mt-24 space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <span className="text-xs font-bold text-[#FF6154] uppercase tracking-wider">
                  07 // Commercial Terms
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
                  Pricing Models, Token Economics & ROI
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
                  08 // Critical Audit
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
                  Pros, Cons & Known Failure Modes
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                An honest engineering assessment of where {agent.name} excels, alongside real failure modes, context degradation risks, and edge cases:
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
                  09 // Competitive Landscape
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
                  Top Alternatives & Comparison Matrix
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                How {agent.name} compares against primary market rivals in the {agent.categoryLabel} discipline:
              </p>
              <CompetitorsMatrix agentName={agent.name} competitors={review.competitors} />
            </section>

            {/* Section 10: Technical FAQs */}
            <section id="developer-faqs" className="scroll-mt-24 space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <span className="text-xs font-bold text-[#FF6154] uppercase tracking-wider">
                  10 // Developer Questions
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
                  Frequently Asked Questions (FAQ)
                </h2>
              </div>
              <FaqAccordion faqs={review.faqs} />
            </section>

            {/* Section 11: Final Verdict & Scorecard */}
            <section id="final-verdict" className="scroll-mt-24 space-y-6 pt-4 border-t border-gray-200">
              <div className="border-b border-gray-100 pb-3">
                <span className="text-xs font-bold text-[#FF6154] uppercase tracking-wider">
                  11 // Architectural Verdict
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
                  The Final Verdict & Scorecard
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
