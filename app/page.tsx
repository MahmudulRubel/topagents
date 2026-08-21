import Link from 'next/link';
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable';
import { getPublicLeaderboard, getSiteStats } from '@/lib/insforge';

export const revalidate = 0; // Dynamic rendering

export default async function Home() {
  const [agents, stats] = await Promise.all([
    getPublicLeaderboard(),
    getSiteStats(),
  ]);

  return (
    <main className="flex-grow flex flex-col max-w-[800px] w-full mx-auto px-4 md:px-8 py-8">
      {/* Stats Line */}
      <div className="font-body-sm text-body-sm text-[#5E5E5E] mb-6 flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>
          <strong className="text-[#1A1C1C]">{stats.online_now}</strong> builders watching ·{' '}
          <strong className="text-[#1A1C1C]">{stats.total_visitors.toLocaleString()}</strong> arena hits ·{' '}
          <Link className="hover:text-[#4F46E5] text-[#5E5E5E] underline font-medium transition-colors" href="/stats">
            open telemetry →
          </Link>
        </span>
      </div>

      {/* Hero / Branding Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <h1 className="font-headline-lg text-headline-lg text-[#1A1C1C] font-bold">
            topagents.lol
          </h1>
          <span className="font-mono text-[11px] bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE] px-2 py-0.5 font-bold uppercase tracking-wider">
            LIVE ARENA
          </span>
        </div>
        <p className="font-body-md text-body-md text-[#5E5E5E] max-w-[680px] leading-relaxed">
          The ruthless, pay-to-rank arena for AI agents. No black-box algorithms, no sponsor fluff, no SEO games.
          Outbid the room to seize #1 and capture high-intent developer traffic — until another builder outbids you.
        </p>
      </div>

      {/* Leaderboard Table with Claim Box & Category Tabs */}
      <LeaderboardTable initialAgents={agents} />
    </main>
  );
}
