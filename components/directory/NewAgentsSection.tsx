import Link from 'next/link';
import { Agent } from '@/lib/data/types';
import AgentAvatar from './AgentAvatar';

interface NewAgentsSectionProps {
  agents: Agent[];
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  coding:       { bg: 'bg-indigo-50',  text: 'text-indigo-700',  dot: 'bg-indigo-500' },
  autonomous:   { bg: 'bg-orange-50',  text: 'text-orange-700',  dot: 'bg-orange-500' },
  frameworks:   { bg: 'bg-violet-50',  text: 'text-violet-700',  dot: 'bg-violet-500' },
  voice:        { bg: 'bg-sky-50',     text: 'text-sky-700',     dot: 'bg-sky-500' },
  support:      { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  sales:        { bg: 'bg-rose-50',    text: 'text-rose-700',    dot: 'bg-rose-500' },
  research:     { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500' },
  productivity: { bg: 'bg-teal-50',    text: 'text-teal-700',    dot: 'bg-teal-500' },
  workflow:     { bg: 'bg-cyan-50',    text: 'text-cyan-700',    dot: 'bg-cyan-500' },
  creative:     { bg: 'bg-pink-50',    text: 'text-pink-700',    dot: 'bg-pink-500' },
};

const PRICING_LABELS: Record<string, { label: string; color: string }> = {
  free:          { label: 'Free',        color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  freemium:      { label: 'Freemium',    color: 'text-blue-700 bg-blue-50 border-blue-200' },
  paid:          { label: 'Paid',        color: 'text-slate-700 bg-slate-100 border-slate-200' },
  'open-source': { label: 'Open Source', color: 'text-violet-700 bg-violet-50 border-violet-200' },
};

export default function NewAgentsSection({ agents }: NewAgentsSectionProps) {
  // Show the 8 most recently added agents (community submissions surface first)
  const newAgents = agents.slice(0, 8);
  if (newAgents.length === 0) return null;

  return (
    <section className="mb-10">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6154] opacity-60" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF6154]" />
            </span>
            <span className="text-[11px] font-black uppercase tracking-widest text-[#FF6154]">New</span>
          </div>
          <h2 className="text-base sm:text-lg font-black text-gray-950 tracking-tight">
            Recently Added Agents
          </h2>
        </div>
        <Link
          href="/?category=all"
          className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1"
        >
          View all <span>→</span>
        </Link>
      </div>

      {/* ── Mobile: horizontal scrollable cards ── */}
      <div
        className="flex sm:hidden items-stretch gap-3 overflow-x-auto pb-2"
        style={{ scrollbarWidth: 'none' } as React.CSSProperties}
      >
        {newAgents.map((agent) => {
          const cat = CATEGORY_COLORS[agent.category] ?? { bg: 'bg-slate-50', text: 'text-slate-600', dot: 'bg-slate-400' };
          const pricing = PRICING_LABELS[agent.pricingModel] ?? { label: agent.pricingModel, color: 'text-slate-600 bg-slate-100 border-slate-200' };
          return (
            <Link
              key={agent.id}
              href={`/agents/${agent.slug}`}
              className="shrink-0 w-56 flex flex-col bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all p-3.5 group"
            >
              {/* Avatar + name */}
              <div className="flex items-center gap-2.5 mb-2">
                <AgentAvatar agent={agent} />
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 text-sm truncate group-hover:text-[#FF6154] transition-colors">
                    {agent.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">{agent.developer}</div>
                </div>
              </div>

              {/* Tagline */}
              <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2 mb-3 flex-1">
                {agent.tagline}
              </p>

              {/* Footer badges */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`inline-flex items-center gap-1 text-[9.5px] font-bold px-1.5 py-0.5 rounded-full ${cat.bg} ${cat.text}`}>
                  <span className={`w-1 h-1 rounded-full ${cat.dot}`} />
                  {agent.categoryLabel}
                </span>
                <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-full border ${pricing.color}`}>
                  {pricing.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── sm+: 2-column compact list grid ── */}
      <div className="hidden sm:grid grid-cols-2 gap-3">
        {newAgents.map((agent) => {
          const cat = CATEGORY_COLORS[agent.category] ?? { bg: 'bg-slate-50', text: 'text-slate-600', dot: 'bg-slate-400' };
          const pricing = PRICING_LABELS[agent.pricingModel] ?? { label: agent.pricingModel, color: 'text-slate-600 bg-slate-100 border-slate-200' };
          return (
            <Link
              key={agent.id}
              href={`/agents/${agent.slug}`}
              className="flex items-start gap-3 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all p-3.5 group"
            >
              {/* Logo / Avatar */}
              <AgentAvatar agent={agent} />

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="font-bold text-slate-900 text-sm truncate group-hover:text-[#FF6154] transition-colors">
                    {agent.name}
                  </span>
                  <span className="shrink-0 text-[8px] font-black uppercase tracking-wider text-white bg-[#FF6154] px-1.5 py-0.5 rounded-full">
                    NEW
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug line-clamp-1 mb-2">
                  {agent.tagline}
                </p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`inline-flex items-center gap-1 text-[9.5px] font-bold px-1.5 py-0.5 rounded-full ${cat.bg} ${cat.text}`}>
                    <span className={`w-1 h-1 rounded-full ${cat.dot}`} />
                    {agent.categoryLabel}
                  </span>
                  <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-full border ${pricing.color}`}>
                    {pricing.label}
                  </span>
                  <span className="ml-auto text-[10px] font-bold text-amber-600 flex items-center gap-0.5">
                    ★ {agent.overallRating.toFixed(1)}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
