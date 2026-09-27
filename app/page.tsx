import { getAllCombinedAgents } from '@/lib/data/server-agents';
import FeaturedSpotlight from '@/components/directory/FeaturedSpotlight';
import DirectoryFeed from '@/components/directory/DirectoryFeed';

export const revalidate = 3600; // 1 hour ISR

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

  return (
    <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 px-4 bg-white border border-gray-200 rounded-xl shadow-xs text-center text-xs">
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
      </section>

      {/* Featured Agent Spotlight */}
      {featuredAgent && <FeaturedSpotlight agent={featuredAgent} />}

      {/* Interactive Directory Feed (Search, Category Pills, Sort, Upvotes) */}
      <DirectoryFeed
        initialAgents={allAgents}
        initialCategory={initialCategory}
        initialQuery={initialQuery}
      />
    </main>
  );
}
