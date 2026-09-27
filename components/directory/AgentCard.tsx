import Link from 'next/link';
import { Agent } from '@/lib/data/types';
import UpvoteButton from './UpvoteButton';

interface AgentCardProps {
  agent: Agent;
  rank?: number;
}

export default function AgentCard({ agent, rank }: AgentCardProps) {
  const pricingColors = {
    free: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'open-source': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    freemium: 'bg-amber-50 text-amber-700 border-amber-200',
    paid: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  return (
    <div className="group relative bg-white hover:bg-[#FAFAF9] border border-gray-200/80 hover:border-gray-300 rounded-xl p-4 transition-all duration-150 flex items-center justify-between gap-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-md">
      {/* Left: Rank + Avatar + Details */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* Rank Number */}
        {rank !== undefined && (
          <span className="font-mono text-xs font-bold text-gray-400 w-5 text-right shrink-0">
            {rank}
          </span>
        )}

        {/* Avatar / Monogram */}
        <Link
          href={`/agents/${agent.slug}`}
          className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base text-white shrink-0 shadow-sm transition-transform group-hover:scale-105"
          style={{ backgroundColor: agent.avatarBg || '#111827' }}
        >
          {agent.monogram}
        </Link>

        {/* Center Details */}
        <div className="min-w-0 flex-1">
          {/* Header row: Name + Badges */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Link
              href={`/agents/${agent.slug}`}
              className="font-bold text-base text-gray-900 group-hover:text-[#FF6154] transition-colors truncate"
            >
              {agent.name}
            </Link>

            <span className="text-blue-500 text-xs" title="Verified Agent Profile">
              ✓
            </span>

            {/* Pricing Badge */}
            <span
              className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide rounded border ${
                pricingColors[agent.pricingModel] || pricingColors.freemium
              }`}
            >
              {agent.pricingLabel.split(' ')[0]}
            </span>

            {/* Category Tag */}
            <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-medium text-gray-500 bg-gray-100 rounded">
              {agent.categoryLabel}
            </span>
          </div>

          {/* Tagline */}
          <p className="text-xs text-gray-600 line-clamp-1 mb-1.5 leading-relaxed">
            {agent.tagline}
          </p>

          {/* Bottom Meta */}
          <div className="flex items-center gap-3 text-[11px] text-gray-400 flex-wrap">
            <span className="flex items-center gap-1 text-amber-500 font-semibold">
              ★ {agent.overallRating.toFixed(1)}
              <span className="text-gray-400 font-normal">({agent.reviewsCount})</span>
            </span>

            <span className="hidden md:inline-block text-gray-300">·</span>
            <span className="hidden md:inline-block text-gray-500">by {agent.developer}</span>

            <span className="hidden lg:inline-block text-gray-300">·</span>
            <span className="hidden lg:inline-flex items-center gap-1.5">
              {agent.tags.slice(0, 2).map((t) => (
                <span key={t} className="text-gray-400">
                  #{t}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Product Hunt Upvote Button */}
      <div className="shrink-0 pl-2">
        <UpvoteButton slug={agent.slug} initialVotes={agent.upvotesCount} />
      </div>
    </div>
  );
}
