import React from 'react';
import Link from 'next/link';
import { getSiteStats, getRecentOutbids, getPublicLeaderboard } from '@/lib/insforge';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Public Analytics — topagents.lol',
  description: 'Real-time open web analytics, traffic statistics, and bidding metrics for topagents.lol.',
};

export default async function StatsPage() {
  const [stats, recentOutbids, agents] = await Promise.all([
    getSiteStats(),
    getRecentOutbids(),
    getPublicLeaderboard(),
  ]);

  const totalClicks = agents.reduce((sum, a) => sum + (a.clicks || 0), 0);
  const formattedRevenue = ((stats.total_revenue_cents || 0) / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <main className="flex-grow max-w-[800px] w-full mx-auto px-margin-mobile md:px-margin-desktop py-6">
      {/* Page Header */}
      <div className="mb-6 border-b border-[#E2E2E2] pb-4">
        <div className="flex items-center justify-between gap-4 mb-1">
          <h1 className="font-bold text-2xl text-[#1E1E1E]">Public Telemetry</h1>
          <div className="flex items-center gap-2 bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE] px-2.5 py-1 text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4F46E5] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4F46E5]"></span>
            </span>
            LIVE TELEMETRY
          </div>
        </div>
        <p className="text-sm text-[#555555]">
          Radical transparency. Zero third-party trackers, zero inflated vanity metrics. Every bid, outbound click, and dollar transacted is verified live on-chain/in-db.
        </p>
      </div>

      {/* Overview Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="bg-white border border-[#E2E2E2] rounded-none p-4">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#777777] mb-1">
            Arena Hits
          </div>
          <div className="text-2xl font-bold text-[#1E1E1E] font-mono">
            {stats.total_visitors.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#888888] mt-0.5">Unique sessions</div>
        </div>

        <div className="bg-white border border-[#E2E2E2] rounded-none p-4">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#777777] mb-1">
            Builders Live
          </div>
          <div className="text-2xl font-bold text-[#4F46E5] font-mono flex items-center gap-2">
            {stats.online_now}
          </div>
          <div className="text-[10px] text-[#888888] mt-0.5">Active right now</div>
        </div>

        <div className="bg-white border border-[#E2E2E2] rounded-none p-4">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#777777] mb-1">
            Public Volume
          </div>
          <div className="text-2xl font-bold text-[#166534] font-mono">
            {formattedRevenue}
          </div>
          <div className="text-[10px] text-[#888888] mt-0.5">Gross transacted</div>
        </div>

        <div className="bg-white border border-[#E2E2E2] rounded-none p-4">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#777777] mb-1">
            Outbound Clicks
          </div>
          <div className="text-2xl font-bold text-[#1E1E1E] font-mono">
            {totalClicks.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#888888] mt-0.5">Delivered to agents</div>
        </div>
      </div>

      {/* Agent Traffic Performance Table */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg text-[#1E1E1E]">Agent Attention & Click Share</h2>
          <span className="text-xs font-mono text-[#777777]">
            Sorted by outbound clicks
          </span>
        </div>

        <div className="bg-white border border-[#E2E2E2] rounded-none overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F3F3F3] border-b border-[#E2E2E2] font-mono text-[#555555] uppercase">
                <tr>
                  <th className="py-2.5 px-3 w-12">#</th>
                  <th className="py-2.5 px-3">Agent</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-right">Clicks Dispatched</th>
                  <th className="py-2.5 px-3 text-right">Bid Volume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E2E2]">
                {agents.length > 0 ? (
                  agents
                    .slice()
                    .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
                    .map((agent, index) => (
                      <tr key={agent.id} className="hover:bg-[#F9F9F9] transition-colors">
                        <td className="py-3 px-3 font-mono text-[#777777]">{index + 1}</td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-[#1E1E1E]">{agent.agent_name}</div>
                          <div className="text-[11px] text-[#777777] truncate max-w-[200px]">
                            {agent.tagline}
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono capitalize text-[#555555]">
                          {agent.category}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-[#4F46E5]">
                          {agent.clicks.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-[#1E1E1E]">
                          ${(agent.amount_cents / 100).toFixed(2)}
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-[#777777] font-mono">
                      No agents claimed yet. All telemetry updates in real-time as claims and clicks occur.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Live Bid History Log */}
      <div className="mb-8">
        <h2 className="font-bold text-lg text-[#1E1E1E] mb-3">Recent Arena Bids</h2>
        <div className="bg-white border border-[#E2E2E2] rounded-none p-4 divide-y divide-[#E2E2E2]">
          {recentOutbids.length > 0 ? (
            recentOutbids.map((evt) => (
              <div key={evt.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[#4F46E5] font-bold">
                    ${(evt.amount_cents / 100).toFixed(2)}
                  </span>
                  <span className="text-[#1E1E1E]">
                    claimed <strong className="font-bold">{evt.agent_name}</strong> at Rank #{evt.rank}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-[#777777]">
                  {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-xs text-[#777777] font-mono">
              No arena bids recorded yet. Bids appear here live when transactions clear.
            </div>
          )}
        </div>
      </div>

      {/* Public API Endpoint Callout */}
      <div className="bg-[#EEF2FF] border border-[#C7D2FE] rounded-none p-4 text-xs">
        <div className="font-bold text-[#4F46E5] uppercase tracking-wider font-mono mb-1">
          Open Telemetry JSON Endpoints
        </div>
        <p className="text-[#374151] mb-2">
          Build your own analytics dashboard, Telegram notification bot, or arena tracker using our open public endpoints:
        </p>
        <div className="flex flex-wrap gap-3 font-mono">
          <a
            href="/api/stats"
            target="_blank"
            className="bg-white border border-[#C7D2FE] px-2.5 py-1 text-[#4F46E5] hover:bg-[#E0E7FF] transition-colors"
          >
            GET /api/stats
          </a>
          <a
            href="/api/leaderboard"
            target="_blank"
            className="bg-white border border-[#C7D2FE] px-2.5 py-1 text-[#4F46E5] hover:bg-[#E0E7FF] transition-colors"
          >
            GET /api/leaderboard
          </a>
        </div>
      </div>
    </main>
  );
}

