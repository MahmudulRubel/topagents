import { Metadata } from 'next';
import { getAllCombinedAgents } from '@/lib/data/server-agents';
import FeaturedSpotlight from '@/components/directory/FeaturedSpotlight';
import DirectoryFeed from '@/components/directory/DirectoryFeed';
import SideSponsors from '@/components/advertise/SideSponsors';
import DirectoryFaq from '@/components/directory/DirectoryFaq';
import { DIRECTORY_HOMEPAGE_FAQS } from '@/lib/data/directory-faqs';
import { generateHomeJsonLd } from '@/lib/seo/jsonld';

export const revalidate = 3600; // 1 hour ISR

export const metadata: Metadata = {
  title: 'Top 100 AI Agents Directory (2026 Rankings & Benchmarks) | topagents.lol',
  description:
    'Discover, compare, and analyze the top 100 autonomous AI agents across Coding, Browser Use, Multi-Agent Frameworks, Voice, and Sales. 2,000+ words technical reviews, verified SWE-bench benchmarks, and free community submissions.',
  keywords: [
    'AI agents',
    'autonomous AI agents',
    'coding agents',
    'SWE-bench verified',
    'top AI agents 2026',
    'AI agent directory',
    'multi-agent frameworks',
    'browser use agents',
    'Devin',
    'Claude Code',
    'Cursor',
  ],
  alternates: {
    canonical: 'https://topagents.lol',
  },
  openGraph: {
    title: 'Top 100 AI Agents Directory (2026 Rankings & Benchmarks) | topagents.lol',
    description:
      'Product Hunt-styled directory of the top 100 AI agents with verified SWE-bench benchmarks, architecture breakdowns, and free community submissions.',
    url: 'https://topagents.lol',
    siteName: 'topagents.lol',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Top 100 AI Agents Directory (2026 Rankings & Benchmarks) | topagents.lol',
    description:
      'Discover the next era of autonomous AI agents. Verified benchmarks and senior engineering teardowns.',
  },
};

interface HomePageProps {
  searchParams?: {
    category?: string;
    q?: string;
  };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const allAgents = await getAllCombinedAgents();
  const featuredAgent = allAgents.find((a) => a.featured) || allAgents[0];

  const initialCategory = typeof searchParams?.category === 'string' ? searchParams.category : 'all';
  const initialQuery = typeof searchParams?.q === 'string' ? searchParams.q : '';

  const jsonLd = generateHomeJsonLd(allAgents, DIRECTORY_HOMEPAGE_FAQS);

  return (
    <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-8 flex justify-center gap-8 items-start">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.faqSchema) }}
      />

      {/* Left Rail Sponsors (Slots 1 & 2) */}
      <SideSponsors position="left" />

      {/* Main Center Column */}
      <main className="flex-1 min-w-0 max-w-4xl">
        {/* Mobile & Tablet Sponsor Grid (Visible below xl screens) */}
        <SideSponsors position="mobile" />

        {/* Hero Header */}
        <section className="mb-10 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-[#FF6154]">
              <span>🚀 DISCOVER &amp; UPVOTE AUTONOMOUS AGENTS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6154] animate-ping" />
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold text-gray-500">
              <span className="hidden sm:inline-block">Updated Daily</span>
              <span className="text-gray-300">|</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono font-bold">
                100+ Active Agents
              </span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-gray-950 tracking-tight leading-tight mb-4">
            Discover the Next Era of AI Agents.
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FF6154] via-rose-600 to-indigo-600">
              Curated Daily. Upvoted by Builders.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-600 max-w-3xl leading-relaxed mb-6">
            From autonomous coding engines to multi-agent swarms and voice bots. Explore in-depth architectural profiles, compare real-world benchmarks, and launch your own agent directly to the community.
          </p>

          {/* Feature stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 px-4 bg-white border border-gray-200 rounded-xl shadow-xs text-center text-xs mb-6">
            <div>
              <div className="font-extrabold text-base text-gray-900">100+</div>
              <div className="text-gray-500 font-medium">Active Agents</div>
            </div>
            <div>
              <div className="font-extrabold text-base text-gray-900">9</div>
              <div className="text-gray-500 font-medium">Core Categories</div>
            </div>
            <div>
              <div className="font-extrabold text-base text-emerald-600">Daily</div>
              <div className="text-gray-500 font-medium">Community Upvotes</div>
            </div>
            <div>
              <div className="font-extrabold text-base text-[#FF6154]">100% Free</div>
              <div className="text-gray-500 font-medium">Builder Listing</div>
            </div>
          </div>

          {/* AEO Definition Block for Featured Snippets & Answer Engines */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-2 text-left">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
              <span className="text-[#FF6154]">AEO Definition: Autonomous AI Agents</span>
              <span className="text-gray-400">Direct Answer</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-medium">
              An <strong>autonomous AI agent</strong> is an LLM-powered software system that independently executes multi-step goals via iterative reasoning loops (e.g. ReAct), tool execution (terminals, web browsers, databases, and APIs), persistent memory, and self-healing error recovery. Unlike autocomplete tools, autonomous agents plan and complete end-to-end tasks with zero human step-by-step prompts.
            </p>
          </div>
        </section>

        {/* Featured Agent Spotlight */}
        {featuredAgent && <FeaturedSpotlight agent={featuredAgent} />}

        {/* Interactive Directory Feed (Search, Category Pills, Sort, Upvotes) */}
        <DirectoryFeed
          initialAgents={allAgents}
          initialCategory={initialCategory}
          initialQuery={initialQuery}
        />

        {/* Conversational FAQ Section for AEO / GEO */}
        <DirectoryFaq />
      </main>

      {/* Right Rail Sponsors (Slots 3 & 4) */}
      <SideSponsors position="right" />
    </div>
  );
}
