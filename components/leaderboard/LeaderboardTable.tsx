'use client';

import React, { useState, useMemo, useEffect } from 'react';
import CategoryTabs, { CategoryFilter } from './CategoryTabs';
import LeaderboardRow from './LeaderboardRow';
import ClaimBox from './ClaimBox';
import ClaimModal from './ClaimModal';
import OutbidAlerts from './OutbidAlerts';
import { AgentPublic, OutbidEvent } from '@/lib/types';

interface LeaderboardTableProps {
  initialAgents?: AgentPublic[];
}

export default function LeaderboardTable({
  initialAgents = [],
}: LeaderboardTableProps) {
  const [agents, setAgents] = useState<AgentPublic[]>(initialAgents);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [targetRank, setTargetRank] = useState(1);
  const initialTopCents = initialAgents.length > 0 ? initialAgents[0].amount_cents : 0;
  const initialMinDollars = initialTopCents > 0 ? (initialTopCents + 100) / 100 : 1;
  const [targetBidDollars, setTargetBidDollars] = useState(initialMinDollars);

  const [recentOutbids, setRecentOutbids] = useState<OutbidEvent[]>([]);
  const [latestOutbid, setLatestOutbid] = useState<OutbidEvent | null>(null);

  // Refresh leaderboard from GET /api/leaderboard
  const refreshLeaderboard = async () => {
    try {
      const res = await fetch('/api/leaderboard');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setAgents(json.data);
        }
      }
    } catch (e) {
      console.warn('Failed refreshing leaderboard:', e);
    }
  };

  // Fetch stats and outbid history from GET /api/stats
  const refreshStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          if (Array.isArray(json.data.recentOutbids)) {
            setRecentOutbids(json.data.recentOutbids);
          }
        }
      }
    } catch (e) {
      console.warn('Failed refreshing stats:', e);
    }
  };

  // Send visitor heartbeat
  const pingHeartbeat = async () => {
    try {
      await fetch('/api/stats', { method: 'POST' });
    } catch (e) {
      // Ignore background ping errors
    }
  };

  useEffect(() => {
    refreshLeaderboard();
    refreshStats();
    pingHeartbeat();

    // 10s periodic polling for live outbid updates & heartbeat
    const interval = setInterval(() => {
      refreshLeaderboard();
      refreshStats();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Compute dynamic rank by sorting amount_cents DESC (Invariant #2)
  const sortedAgents = useMemo(() => {
    return [...agents]
      .sort((a, b) => b.amount_cents - a.amount_cents)
      .map((agent, index) => ({
        ...agent,
        rank: index + 1,
      }));
  }, [agents]);

  const topAgent = sortedAgents[0];
  const topAgentAmountCents = topAgent ? topAgent.amount_cents : 0;

  const [searchQuery, setSearchQuery] = useState('');

  // Filter agents by category & search query while maintaining global rank
  const filteredAgents = useMemo(() => {
    return sortedAgents.filter((a) => {
      const matchesCategory = activeCategory === 'all' || a.category === activeCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        a.agent_name.toLowerCase().includes(query) ||
        a.tagline.toLowerCase().includes(query) ||
        (a.claimed_by_handle && a.claimed_by_handle.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [sortedAgents, activeCategory, searchQuery]);

  const handleOpenClaimModal = (bidDollars?: number) => {
    const minBid = (topAgentAmountCents + 100) / 100;
    setTargetRank(1);
    setTargetBidDollars(bidDollars && bidDollars >= minBid ? bidDollars : minBid);
    setModalOpen(true);
  };

  const handleClaimSpecificRank = (rank: number, requiredBidCents: number) => {
    setTargetRank(rank);
    setTargetBidDollars(requiredBidCents / 100);
    setModalOpen(true);
  };

  return (
    <div className="w-full">
      {/* Live Outbid Alerts & Activity Ticker Banner */}
      <OutbidAlerts
        recentOutbids={recentOutbids}
        latestOutbid={latestOutbid}
      />

      {/* Claim Box Hero Banner */}
      <ClaimBox
        topAgentAmountCents={topAgentAmountCents}
        onOpenClaimModal={handleOpenClaimModal}
      />

      {/* Category Tabs Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-[#E2E2E2] pb-3">
        <CategoryTabs
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        {/* Literalist Utility Search Input */}
        <div className="relative flex items-center min-w-[200px] sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search AI agents & creators..."
            className="w-full bg-[#F9F9F9] border border-[#E2E2E2] rounded-none px-3 py-1.5 text-xs text-[#1E1E1E] placeholder-[#8E8E8E] focus:outline-none focus:border-[#4F46E5] font-sans transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 text-xs text-[#8E8E8E] hover:text-[#1E1E1E] bg-transparent border-none cursor-pointer"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Leaderboard Table / Rows */}
      <div className="flex flex-col">
        {filteredAgents.length > 0 ? (
          filteredAgents.map((agent) => (
            <LeaderboardRow
              key={agent.id}
              agent={agent}
              onClaimRank={handleClaimSpecificRank}
            />
          ))
        ) : (
          <div className="text-center py-12 border border-dashed border-[#E2E2E2] my-4 bg-white">
            <p className="font-body-md text-body-md text-[#5E5E5E] mb-2 font-medium">
              No agents have claimed territory under <strong className="capitalize text-[#1A1C1C]">{activeCategory}</strong> yet.
            </p>
            <p className="text-xs text-[#777777] mb-4">
              The category throne is wide open for the minimum claim of $1.00.
            </p>
            <button
              onClick={() => handleOpenClaimModal()}
              className="text-[#4F46E5] font-semibold text-sm hover:underline bg-transparent border-none cursor-pointer"
            >
              ⚡ Be the first to claim this category spotlight →
            </button>
          </div>
        )}
      </div>

      {/* Claim Modal */}
      <ClaimModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialBidDollars={targetBidDollars}
        targetRank={targetRank}
      />
    </div>
  );
}
