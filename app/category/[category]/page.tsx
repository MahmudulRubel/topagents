import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/data/agents';
import { getAllCombinedAgents } from '@/lib/data/server-agents';
import { generateCategoryJsonLd } from '@/lib/seo/jsonld';
import { CATEGORY_SEO_DATA } from '@/lib/data/category-seo';
import { AgentCategory } from '@/lib/data/types';
import DirectoryFeed from '@/components/directory/DirectoryFeed';
import SideSponsors from '@/components/advertise/SideSponsors';
import FaqAccordion from '@/components/agent-detail/FaqAccordion';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export const dynamicParams = false;

// 1. Static Generation for all 9 primary categories at build time
export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({
    category: c.id,
  }));
}

// 2. Programmatic Dynamic SEO Metadata for Category Pages
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = CATEGORIES.find((c) => c.id === params.category);
  if (!category) return {};

  const seoData = CATEGORY_SEO_DATA[category.id as AgentCategory];
  const title = `Top ${category.label} AI Agents (2026 Rankings & Benchmarks) | TopAgents`;
  const description = seoData
    ? `${seoData.aeoDefinition.slice(0, 155)}... Compare top ${category.label} autonomous AI agents.`
    : `Discover and compare the leading ${category.label} AI agents with verified benchmarks, architecture teardowns, and upvotes.`;

  return {
    title,
    description,
    keywords: [
      `${category.label} AI agents`,
      `${category.label} autonomous agents`,
      `best ${category.label} agents 2026`,
      'AI agents directory',
      'SWE-bench',
      'autonomous AI',
      'AI agent rankings',
    ],
    alternates: {
      canonical: `https://topagents.lol/category/${category.id}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://topagents.lol/category/${category.id}`,
      siteName: 'topagents.lol',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = CATEGORIES.find((c) => c.id === params.category);
  if (!category) notFound();

  const allAgents = await getAllCombinedAgents();
  const agentsInCategory = allAgents.filter((a) => a.category === category.id);
  const seoData = CATEGORY_SEO_DATA[category.id as AgentCategory];
  const faqs = seoData?.faqs || [];

  const jsonLd = generateCategoryJsonLd(category, agentsInCategory, faqs);

  return (
    <div className="min-h-screen bg-[#FBFBFA]">
      {/* JSON-LD Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.breadcrumbSchema) }}
      />
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.faqSchema) }}
        />
      )}

      {/* Breadcrumb Navigation */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-6">
        <nav className="text-xs text-gray-500 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-400">Categories</span>
          <span>/</span>
          <span className="font-semibold text-gray-900">{category.label}</span>
        </nav>
      </div>

      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 flex justify-center gap-8 items-start">
        {/* Left Rail Sponsors */}
        <SideSponsors position="left" />

        {/* Main Center Column */}
        <main className="flex-1 min-w-0 max-w-4xl space-y-8">
          <SideSponsors position="mobile" />

          {/* Category Hero Header */}
          <section className="space-y-4 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-[#FF6154]">
                <span>{category.icon} {category.label.toUpperCase()}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6154] animate-ping" />
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono font-bold">
                  {agentsInCategory.length} Verified Agents
                </span>
                <span>·</span>
                <span>Updated Daily</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight leading-tight">
              Top {category.label} AI Agents (2026 Rankings)
            </h1>

            <p className="text-base text-gray-600 leading-relaxed max-w-3xl">
              {seoData?.tagline || `Compare the leading ${category.label} autonomous AI agents evaluated by senior systems engineers.`}
            </p>

            {/* AEO Quick Definition & Answer Block (Princeton GEO & Featured Snippet extractable) */}
            {seoData?.aeoDefinition && (
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <span className="text-[#FF6154]">AEO Definition &amp; Market Summary</span>
                  <span className="text-gray-400">45-word direct answer</span>
                </div>
                <p className="text-sm text-gray-800 leading-relaxed font-medium">
                  {seoData.aeoDefinition}
                </p>
                <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center gap-4 text-xs text-gray-600">
                  <div>
                    <strong className="text-gray-900">Leading Benchmark:</strong>{' '}
                    <span className="text-emerald-700 font-semibold">{seoData.keyMetric}</span>
                  </div>
                  <div>
                    <strong className="text-gray-900">Featured Leaders:</strong>{' '}
                    <span className="text-indigo-700 font-semibold">{seoData.topPick}</span>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Directory Feed pre-filtered to this category */}
          <DirectoryFeed
            initialAgents={allAgents}
            initialCategory={category.id}
          />

          {/* Category FAQs Section */}
          {faqs.length > 0 && (
            <section className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <span className="text-xs font-bold text-[#FF6154] uppercase tracking-wider">
                  Developer Q&amp;A
                </span>
                <h2 className="text-xl font-black text-gray-900 mt-1">
                  Frequently Asked Questions about {category.label} AI Agents
                </h2>
              </div>
              <FaqAccordion faqs={faqs} />
            </section>
          )}
        </main>

        {/* Right Rail Sponsors */}
        <SideSponsors position="right" />
      </div>
    </div>
  );
}
