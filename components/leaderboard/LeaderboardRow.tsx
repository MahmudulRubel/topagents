'use client';

import React from 'react';
import { AgentPublic } from '@/lib/types';

interface LeaderboardRowProps {
  agent: AgentPublic;
  onClaimRank?: (targetRank: number, requiredBidCents: number) => void;
}

const PASTEL_STYLES = [
  { bg: 'bg-[#E0F2FE]', text: 'text-[#0284C7]' }, // Blue
  { bg: 'bg-[#FEF3C7]', text: 'text-[#D97706]' }, // Amber
  { bg: 'bg-[#D1FAE5]', text: 'text-[#059669]' }, // Emerald
  { bg: 'bg-[#E2DFFF]', text: 'text-[#3323CC]' }, // Purple
];

function getPastelStyle(name: string) {
  let charCodeSum = 0;
  for (let i = 0; i < name.length; i++) {
    charCodeSum += name.charCodeAt(i);
  }
  return PASTEL_STYLES[charCodeSum % PASTEL_STYLES.length];
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

export default function LeaderboardRow({
  agent,
  onClaimRank,
}: LeaderboardRowProps) {
  const pastel = getPastelStyle(agent.agent_name);
  const initials = getInitials(agent.agent_name);
  const outbidCents = agent.amount_cents + 100;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Fire-and-forget click beacon
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const data = new Blob([JSON.stringify({ agent_id: agent.id })], {
        type: 'application/json',
      });
      navigator.sendBeacon('/api/click', data);
    } else {
      fetch('/api/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_id: agent.id }),
      }).catch(() => {});
    }
  };

  const formattedUrl = agent.url.includes('?')
    ? `${agent.url}&utm_source=topagents`
    : `${agent.url}?utm_source=topagents`;

  return (
    <div className="group flex items-center justify-between border-b border-[#E2E2E2] py-3 hover:bg-[#EEEEEE] transition-colors rounded-none px-2 -mx-2">
      {/* Left section: Rank + Avatar + Name & Info */}
      <div className="flex items-center gap-3 min-w-0 pr-4">
        {/* Rank */}
        <span className="font-mono text-[#5E5E5E] font-bold text-sm w-6 text-right shrink-0">
          #{agent.rank}
        </span>

        {/* Square Initial Avatar */}
        <div
          className={`w-10 h-10 shrink-0 rounded-none flex items-center justify-center font-bold text-sm ${pastel.bg} ${pastel.text}`}
        >
          {agent.logo_url ? (
            <img
              src={agent.logo_url}
              alt={agent.agent_name}
              className="w-full h-full object-cover rounded-none"
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>

        {/* Agent Details */}
        <div className="min-w-0 flex flex-col">
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={formattedUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClick}
              className="font-headline-md text-body-lg text-[#1A1C1C] font-semibold hover:text-[#4F46E5] hover:underline truncate"
            >
              {agent.agent_name}
            </a>
            <span className="text-[11px] px-1.5 py-0.5 bg-[#E8E8E8] text-[#5E5E5E] uppercase tracking-wider rounded-none font-medium">
              {agent.category}
            </span>
          </div>

          <p className="font-body-sm text-body-sm text-[#5E5E5E] truncate max-w-[420px]">
            {agent.tagline}
          </p>

          <div className="font-body-sm text-[12px] text-[#5E5E5E] mt-0.5">
            {formatRelativeTime(agent.claimed_at)} · <span className="font-medium text-[#1A1C1C]">{agent.clicks.toLocaleString()} clicks</span>
            {agent.claimed_by_handle && (
              <span> · by @{agent.claimed_by_handle}</span>
            )}
          </div>
        </div>
      </div>

      {/* Right section: Pricing & Outbid hover trigger */}
      <div className="flex flex-col items-end shrink-0 ml-2">
        <span className="font-mono font-bold text-body-lg text-[#1A1C1C]">
          {formatCurrency(agent.amount_cents)}
        </span>

        {onClaimRank && (
          <button
            onClick={() => onClaimRank(agent.rank, outbidCents)}
            className="text-[12px] text-[#4F46E5] hover:underline bg-transparent border-none p-0 cursor-pointer opacity-90 group-hover:opacity-100 mt-0.5 font-medium"
          >
            ⚡ outbid for {formatCurrency(outbidCents)}
          </button>
        )}
      </div>
    </div>
  );
}
