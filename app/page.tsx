import { Metadata } from 'next';
import { getAllCombinedAgents } from '@/lib/data/server-agents';
import { getVisitorStats } from '@/lib/data/visitors';
import DirectoryFeed from '@/components/directory/DirectoryFeed';
import LiveVisitorBanner from '@/components/directory/LiveVisitorBanner';
import SideSponsors from '@/components/advertise/SideSponsors';
import DirectoryFaq from '@/components/directory/DirectoryFaq';
import { DIRECTORY_HOMEPAGE_FAQS } from '@/lib/data/directory-faqs';
import { generateHomeJsonLd } from '@/lib/seo/jsonld';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Top 700+ AI Agents Directory (2026 Rankings & Benchmarks) | topagents.lol',
  description:
    'Discover, compare, and analyze 700+ autonomous AI agents across Coding, Browser Use, Multi-Agent Frameworks, Voice, Sales, and Creative. Plain-English & technical reviews, verified benchmarks, and free community submissions.',
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
    title: 'Top 700+ AI Agents Directory (2026 Rankings & Benchmarks) | topagents.lol',
    description:
      'Product Hunt-styled directory of 700+ AI agents with verified benchmarks, plain-English guides, and free community submissions.',
    url: 'https://topagents.lol',
    siteName: 'topagents.lol',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Top 700+ AI Agents Directory (2026 Rankings & Benchmarks) | topagents.lol',
    description:
      'Discover the next era of autonomous AI agents. Verified benchmarks and clear, easy-to-read reviews.',
  },
};

interface HomePageProps {
  searchParams?: {
    category?: string;
    q?: string;
  };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const [allAgents, visitorStats] = await Promise.all([
    getAllCombinedAgents(),
    getVisitorStats(),
  ]);

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

        {/* Hidden accessible title for SEO and screen readers */}
        <h1 className="sr-only">Top AI Agents Directory — Curated Daily &amp; Upvoted by Builders</h1>

        {/* Live Visitor Indicator Banner */}
        <LiveVisitorBanner totalAgents={allAgents.length} initialStats={visitorStats} />

        {/* Interactive Directory Feed (Search Bar -> Recently Added -> Category Pills -> Agent Cards) */}
        <DirectoryFeed
          initialAgents={allAgents}
          initialCategory={initialCategory}
          initialQuery={initialQuery}
          showRecentlyAdded={true}
        />

        {/* Conversational FAQ Section for AEO / GEO */}
        <DirectoryFaq />
      </main>

      {/* Right Rail Sponsors (Slots 3 & 4) */}
      <SideSponsors position="right" />
    </div>
  );
}
