import Link from 'next/link';
import { Agent } from '@/lib/data/types';
import UpvoteButton from './UpvoteButton';
import AgentAvatar from './AgentAvatar';

interface FeaturedSpotlightProps {
  agent: Agent;
}

export default function FeaturedSpotlight({ agent }: FeaturedSpotlightProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-900 to-slate-800 text-white p-6 sm:p-8 border border-gray-800 shadow-xl mb-10">
      {/* Background glowing gradient accent */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#FF6154]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Content & Identity */}
        <div className="flex-1 min-w-0">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold tracking-wider uppercase text-amber-300 mb-3">
            <span>⭐ AGENT OF THE DAY</span>
          </div>

          {/* Title & Tagline with Logo */}
          <div className="flex items-center gap-3.5 mb-2">
            <AgentAvatar agent={agent} size="lg" className="shadow-md" />
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {agent.name}
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-white/20 text-white border border-white/20">
                {agent.categoryLabel}
              </span>
              <span className="text-amber-400 font-semibold text-sm">
                ★ {agent.overallRating.toFixed(1)} ({agent.reviewsCount} reviews)
              </span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-gray-300 max-w-2xl leading-relaxed mb-5">
            {agent.tagline}
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href={`/agents/${agent.slug}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF6154] hover:bg-[#E55347] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all"
            >
              <span>Read Full Deep-Dive (2,000+ Words)</span>
              <span>→</span>
            </Link>

            <a
              href={agent.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white text-xs sm:text-sm font-semibold transition-colors border border-white/10"
            >
              <span>Visit Official Site</span>
              <span className="text-xs">↗</span>
            </a>
          </div>
        </div>

        {/* Right: Upvote Card */}
        <div className="shrink-0 flex items-center md:flex-col justify-start md:justify-center p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <UpvoteButton slug={agent.slug} initialVotes={agent.upvotesCount} size="lg" showLabel />
        </div>
      </div>
    </div>
  );
}
