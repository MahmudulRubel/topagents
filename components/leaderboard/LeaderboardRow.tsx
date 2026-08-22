'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AgentPublic, AgentTier } from '@/lib/types';

interface LeaderboardRowProps {
  agent: AgentPublic;
  onClaimRank?: (targetRank: number, requiredBidCents: number) => void;
  onOpenShareModal?: (agent: AgentPublic) => void;
  onOpenCommentModal?: (agent: AgentPublic) => void;
  onLikeAgent?: (agentId: string) => void;
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

function getTierBadgeStyle(tier: AgentTier) {
  switch (tier) {
    case 'diamond':
      return {
        label: '💎 DIAMOND',
        className: 'bg-indigo-950 text-cyan-300 border border-cyan-400 font-bold',
      };
    case 'gold':
      return {
        label: '🥇 GOLD',
        className: 'bg-amber-100 text-amber-900 border border-amber-300 font-bold',
      };
    case 'silver':
      return {
        label: '🥈 SILVER',
        className: 'bg-slate-100 text-slate-800 border border-slate-300 font-semibold',
      };
    case 'bronze':
    default:
      return {
        label: '🥉 BRONZE',
        className: 'bg-orange-50 text-amber-800 border border-amber-200 font-medium',
      };
  }
}

export default function LeaderboardRow({
  agent,
  onClaimRank,
  onOpenShareModal,
  onOpenCommentModal,
  onLikeAgent,
}: LeaderboardRowProps) {
  const pastel = getPastelStyle(agent.agent_name);
  const initials = getInitials(agent.agent_name);
  const outbidCents = agent.amount_cents + 100;
  const tierStyle = getTierBadgeStyle(agent.tier_badge || 'bronze');

  const [likesCount, setLikesCount] = useState<number>(agent.likes_count || 0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);

  // Viewport tracking state
  const rowRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);
  const [showPointToast, setShowPointToast] = useState<boolean>(false);

  // IntersectionObserver for active viewport visibility (>50% visible)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    if (rowRef.current) {
      observer.observe(rowRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Send view pulse when row is in viewport and tab is focused
  useEffect(() => {
    if (!isIntersecting) return;

    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return;

      fetch('/api/points/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'view', agent_id: agent.id }),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.pointsAwarded > 0) {
            setShowPointToast(true);
            setTimeout(() => setShowPointToast(false), 900);
          }
        })
        .catch(() => {});
    }, 5000); // 5-second pulse interval

    return () => clearInterval(interval);
  }, [isIntersecting, agent.id]);

  const handleClickProductLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Record click beacon and award +500 points
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

  const handleLike = async () => {
    if (hasLiked) return;
    setHasLiked(true);
    setLikesCount((prev) => prev + 1);

    try {
      await fetch('/api/points/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like', agent_id: agent.id }),
      });
      if (onLikeAgent) {
        onLikeAgent(agent.id);
      }
    } catch (err) {
      console.warn('Like point error:', err);
    }
  };

  const formattedUrl = agent.url.includes('?')
    ? `${agent.url}&utm_source=topagents`
    : `${agent.url}?utm_source=topagents`;

  return (
    <div
      ref={rowRef}
      className="group relative flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E2E2E2] py-3.5 hover:bg-[#EEEEEE] transition-colors rounded-none px-2 -mx-2 gap-3"
    >
      {/* Live Viewpoint Toast Badge */}
      {showPointToast && (
        <span className="absolute top-1 right-2 text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-1.5 py-0.5 animate-bounce z-10">
          ⚡ +1 PT VIEW
        </span>
      )}
      {/* Left section: Rank + Avatar + Name & Info */}
      <div className="flex items-start gap-3 min-w-0 pr-2">
        {/* Rank */}
        <span className="font-mono text-[#5E5E5E] font-bold text-sm w-6 text-right shrink-0 pt-1">
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
              onClick={handleClickProductLink}
              className="font-headline-md text-body-lg text-[#1A1C1C] font-bold hover:text-[#4F46E5] hover:underline truncate"
            >
              {agent.agent_name}
            </a>

            <span className="text-[10px] px-1.5 py-0.5 bg-[#E8E8E8] text-[#5E5E5E] uppercase tracking-wider rounded-none font-bold">
              {agent.category}
            </span>

            <span className={`text-[10px] px-1.5 py-0.5 rounded-none font-mono uppercase tracking-wider ${tierStyle.className}`}>
              {tierStyle.label}
            </span>
          </div>

          <p className="font-body-sm text-body-sm text-[#5E5E5E] truncate max-w-[420px] mt-0.5">
            {agent.tagline}
          </p>

          <div className="font-body-sm text-[12px] text-[#5E5E5E] mt-1 flex items-center gap-2 flex-wrap">
            <span>{formatRelativeTime(agent.claimed_at)}</span>
            <span>·</span>
            <span className="font-medium text-[#1A1C1C]">{agent.clicks.toLocaleString()} clicks (+500 pts)</span>
            {agent.claimed_by_handle && (
              <>
                <span>·</span>
                <span>by @{agent.claimed_by_handle}</span>
              </>
            )}
          </div>

          {/* Points & Interactive Engagement Actions */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <button
              onClick={handleLike}
              disabled={hasLiked}
              className={`text-[11px] font-mono px-2 py-0.5 border cursor-pointer transition-colors ${
                hasLiked
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
                  : 'bg-white text-[#1A1C1C] border-[#CCCCCC] hover:bg-[#EAEAEA]'
              }`}
            >
              👍 {likesCount} Likes (+100)
            </button>

            <button
              onClick={() => onOpenCommentModal && onOpenCommentModal(agent)}
              className="text-[11px] font-mono bg-white text-[#1A1C1C] border border-[#CCCCCC] hover:bg-[#EAEAEA] px-2 py-0.5 cursor-pointer transition-colors"
            >
              💬 {agent.comments_count || 0} Reviews (+200)
            </button>

            <button
              onClick={() => onOpenShareModal && onOpenShareModal(agent)}
              className="text-[11px] font-mono bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE] hover:bg-[#E0E7FF] px-2 py-0.5 font-bold cursor-pointer transition-colors"
            >
              📢 Share (+500)
            </button>

            <a
              href={formattedUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClickProductLink}
              className="text-[11px] font-mono bg-[#1A1C1C] text-white hover:bg-black px-2.5 py-0.5 font-bold cursor-pointer transition-colors no-underline"
            >
              🚀 Visit Product (+500)
            </a>
          </div>
        </div>
      </div>

      {/* Right section: Points Display */}
      <div className="flex sm:flex-col items-end justify-center shrink-0 ml-2 pt-1 sm:pt-0">
        <span className="font-mono font-extrabold text-lg text-[#4F46E5]">
          {(agent.points_total || 0).toLocaleString()} PTS
        </span>
      </div>
    </div>
  );
}

