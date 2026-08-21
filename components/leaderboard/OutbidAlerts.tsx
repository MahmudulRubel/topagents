'use client';

import React, { useEffect, useState } from 'react';
import { AgentPublic } from '@/lib/types';
import { formatCurrency, formatTimeAgo } from '@/lib/utils';

export interface OutbidEvent {
  id: string;
  agent_name: string;
  amount_cents: number;
  rank: number;
  timestamp: string;
}

interface OutbidAlertsProps {
  recentOutbids?: OutbidEvent[];
  latestOutbid?: OutbidEvent | null;
}

export default function OutbidAlerts({
  recentOutbids = [],
  latestOutbid,
}: OutbidAlertsProps) {
  const [toast, setToast] = useState<OutbidEvent | null>(null);

  useEffect(() => {
    if (latestOutbid) {
      setToast(latestOutbid);
      const timer = setTimeout(() => setToast(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [latestOutbid]);

  return (
    <div className="w-full mb-4 flex flex-col gap-2">
      {/* Active Toast Notification */}
      {toast && (
        <div className="bg-[#1A1C1C] text-white px-4 py-2.5 rounded-none border border-[#1A1C1C] flex items-center justify-between text-xs font-mono animate-fade-in shadow-none">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-emerald-400 uppercase tracking-wider">ARENA OUTBID:</span>
            <span>
              <strong>{toast.agent_name}</strong> seized #{toast.rank} with a{' '}
              <strong className="text-indigo-300">{formatCurrency(toast.amount_cents)}</strong> bid!
            </span>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-gray-400 hover:text-white ml-4 font-sans text-sm bg-transparent border-none cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Ticker / Feed Banner if outbids exist */}
      {recentOutbids.length > 0 && (
        <div className="bg-white border border-[#E2E2E2] px-3.5 py-2 text-xs flex items-center justify-between text-[#5E5E5E]">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <span className="font-semibold text-[#1A1C1C] uppercase tracking-wider text-[11px] font-mono">
              Live Battle:
            </span>
            <span className="text-[#1A1C1C]">
              <strong>{recentOutbids[0].agent_name}</strong> claimed #{recentOutbids[0].rank} ({formatCurrency(recentOutbids[0].amount_cents)})
            </span>
            <span className="text-gray-400">•</span>
            <span>{formatTimeAgo(recentOutbids[0].timestamp)}</span>
          </div>
          <span className="text-[11px] font-mono text-[#4F46E5] font-semibold flex-shrink-0 ml-2">
            {recentOutbids.length} arena battles
          </span>
        </div>
      )}
    </div>
  );
}
