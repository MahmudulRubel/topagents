'use client';

import { useState, useEffect, useCallback } from 'react';
import type { VisitorStats } from '@/lib/data/visitors';

interface LiveVisitorBannerProps {
  totalAgents?: number;
  initialStats?: VisitorStats;
}

const STORAGE_KEY = 'topagents_visitor_id';

function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return 'ssr_visitor';
  try {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing && existing.length >= 8) {
      return existing;
    }
    const randomPart =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID().replace(/-/g, '')
        : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
    const newId = `usr_${randomPart}`;
    window.localStorage.setItem(STORAGE_KEY, newId);
    return newId;
  } catch {
    return `usr_${Date.now().toString(36)}`;
  }
}

export default function LiveVisitorBanner({
  totalAgents = 700,
  initialStats,
}: LiveVisitorBannerProps) {
  const [stats, setStats] = useState<VisitorStats>(
    initialStats || {
      activeNow: 1,
      today: 1,
      weekly: 1,
      monthly: 1,
      todayPageviews: 1,
      weeklyPageviews: 1,
      monthlyPageviews: 1,
      updatedAt: '',
    }
  );

  const sendHeartbeat = useCallback(async (isPageview: boolean) => {
    try {
      const visitorId = getOrCreateVisitorId();
      const res = await fetch('/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId, isPageview }),
        cache: 'no-store',
      });
      if (!res.ok) return;
      const data: VisitorStats = await res.json();
      if (data && typeof data.activeNow === 'number') {
        setStats(data);
      }
    } catch {
      // Fail silently if offline
    }
  }, []);

  useEffect(() => {
    // Record initial pageview & presence immediately on mount
    sendHeartbeat(true);

    // Keep presence alive every 25s while tab is visible
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        sendHeartbeat(false);
      }
    }, 25000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        sendHeartbeat(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [sendHeartbeat]);

  const activeCount = Math.max(1, stats.activeNow);
  const todayCount = Math.max(activeCount, stats.today);
  const weeklyCount = Math.max(todayCount, stats.weekly);
  const monthlyCount = Math.max(weeklyCount, stats.monthly);

  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-xs transition-all">
      {/* Left: Live Right Now Indicator */}
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
        <div className="flex items-baseline gap-1.5 text-xs">
          <span className="font-extrabold text-gray-900 tracking-tight text-sm font-mono">
            {activeCount.toLocaleString()}
          </span>
          <span className="text-gray-600 font-medium">
            {activeCount === 1 ? 'builder' : 'builders'} exploring agents right now
          </span>
        </div>
      </div>

      {/* Right: Real Today, Weekly, Monthly Traffic & Verified Agents Count */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <div
          className="inline-flex items-center divide-x divide-gray-200 bg-gray-50 border border-gray-200 rounded-lg overflow-hidden font-mono text-[11px]"
          title={`Pageviews — Today: ${stats.todayPageviews.toLocaleString()} | 7d: ${stats.weeklyPageviews.toLocaleString()} | 30d: ${stats.monthlyPageviews.toLocaleString()}`}
        >
          <div className="px-2.5 py-1 flex items-center gap-1.5">
            <span className="text-gray-500 font-sans font-medium">Today:</span>
            <span className="font-bold text-gray-900">{todayCount.toLocaleString()}</span>
          </div>
          <div className="px-2.5 py-1 flex items-center gap-1.5">
            <span className="text-gray-500 font-sans font-medium">Weekly:</span>
            <span className="font-bold text-gray-900">{weeklyCount.toLocaleString()}</span>
          </div>
          <div className="px-2.5 py-1 flex items-center gap-1.5">
            <span className="text-gray-500 font-sans font-medium">Monthly:</span>
            <span className="font-bold text-gray-900">{monthlyCount.toLocaleString()}</span>
          </div>
        </div>

        <span className="hidden md:inline-flex items-center gap-1.5 text-gray-700 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold">
          <span>⚡</span>
          <span>{totalAgents}+ Verified Agents</span>
        </span>
      </div>
    </div>
  );
}
