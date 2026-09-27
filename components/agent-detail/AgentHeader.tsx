import Link from 'next/link';
import { Agent } from '@/lib/data/types';
import UpvoteButton from '../directory/UpvoteButton';

interface AgentHeaderProps {
  agent: Agent;
}

export default function AgentHeader({ agent }: AgentHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 py-8 px-4 sm:px-6 mb-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Avatar + Title + Tagline */}
        <div className="flex items-start gap-4">
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-black text-2xl text-white shrink-0 shadow-md"
            style={{ backgroundColor: agent.avatarBg || '#111827' }}
          >
            {agent.monogram}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                {agent.name}
              </h1>

              <span className="text-blue-500 text-base" title="Verified Profile">
                ✓
              </span>

              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                {agent.pricingLabel}
              </span>

              <Link
                href={`/category/${agent.category}`}
                className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                {agent.categoryLabel}
              </Link>
            </div>

            <p className="text-sm sm:text-base text-gray-600 max-w-2xl leading-relaxed mb-3">
              {agent.tagline}
            </p>

            {/* Meta row */}
            <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
              <span className="flex items-center gap-1 text-amber-500 font-bold">
                ★ {agent.overallRating.toFixed(1)} ({agent.reviewsCount} verified reviews)
              </span>
              <span>·</span>
              <span>by <strong>{agent.developer}</strong></span>
              <span>·</span>
              <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
                2,100+ Words Technical Review
              </span>
            </div>
          </div>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <UpvoteButton slug={agent.slug} initialVotes={agent.upvotesCount} size="lg" showLabel />

          <a
            href={agent.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-lg bg-gray-900 hover:bg-black text-white text-sm font-bold shadow-sm transition-all flex items-center gap-1.5"
          >
            <span>Visit Site</span>
            <span className="text-xs">↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}
