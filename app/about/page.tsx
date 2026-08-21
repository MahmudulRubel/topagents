import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'About & Manifesto — topagents.lol',
  description: 'The story and mechanics behind topagents.lol — the pure pay-to-rank arena for AI agents.',
};

export default function AboutPage() {
  return (
    <main className="flex-grow max-w-[800px] w-full mx-auto px-margin-mobile md:px-margin-desktop py-8">
      {/* Header */}
      <div className="mb-8 border-b border-[#E2E2E2] pb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-xs bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE] px-2 py-0.5 font-bold uppercase tracking-wider">
            THE MANIFESTO
          </span>
        </div>
        <h1 className="font-headline-lg text-3xl font-bold text-[#1A1C1C] mb-3">
          The Arena for AI Agents
        </h1>
        <p className="font-body-md text-body-md text-[#5E5E5E] leading-relaxed">
          Why we built topagents.lol, why traditional directory algorithms are broken, and how pure economic ranking puts power back in builders' hands.
        </p>
      </div>

      {/* Narrative Section */}
      <div className="space-y-8 font-body-md text-[#333333] leading-relaxed">
        {/* Section 1: The Problem */}
        <section className="bg-white border border-[#E2E2E2] p-6 rounded-none">
          <h2 className="font-headline-md text-xl font-bold text-[#1A1C1C] mb-3">
            1. The Problem with AI Directories
          </h2>
          <p className="mb-3">
            In 2026, thousands of autonomous agents, coding assistants, voice bots, and AI workflows launch every single week. But getting discovered is broken:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#555555]">
            <li><strong>Opaque algorithms</strong> that favor incumbents with massive SEO budgets.</li>
            <li><strong>Pay-to-play review syndicates</strong> hiding behind fake "editorial picks".</li>
            <li><strong>Ad networks & affiliate bloat</strong> cluttering the user experience and slowing down page loads.</li>
          </ul>
        </section>

        {/* Section 2: The Solution */}
        <section className="bg-white border border-[#E2E2E2] p-6 rounded-none">
          <h2 className="font-headline-md text-xl font-bold text-[#1A1C1C] mb-3">
            2. The Purity of the Arena
          </h2>
          <p className="mb-3">
            <strong>topagents.lol</strong> strips away all the gatekeeping. There are no editorial boards, no algorithm updates, no secret sponsorships.
          </p>
          <p className="font-mono text-sm bg-[#F9F9F9] border border-[#E2E2E2] p-3 text-[#1A1C1C]">
            RANK = ORDER BY amount_cents DESC
          </p>
          <p className="mt-3 text-sm text-[#555555]">
            If your agent delivers real value, you can back it up with capital. Pay to claim the spotlight, capture verified clicks, and prove your conviction in what you’ve built.
          </p>
        </section>

        {/* Section 3: The 4 Core Mechanics */}
        <section className="bg-white border border-[#E2E2E2] p-6 rounded-none">
          <h2 className="font-headline-md text-xl font-bold text-[#1A1C1C] mb-4">
            3. How the Arena Works
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="border border-[#E2E2E2] p-4 bg-[#F9F9F9]">
              <div className="font-mono font-bold text-xs text-[#4F46E5] uppercase mb-1">
                01. Entry Bid
              </div>
              <div className="font-bold text-sm text-[#1A1C1C] mb-1">
                $5 Minimum Claim
              </div>
              <p className="text-xs text-[#555555]">
                Anyone can get listed on the live leaderboard for as little as $5.
              </p>
            </div>

            <div className="border border-[#E2E2E2] p-4 bg-[#F9F9F9]">
              <div className="font-mono font-bold text-xs text-[#4F46E5] uppercase mb-1">
                02. Dynamic Outbid
              </div>
              <div className="font-bold text-sm text-[#1A1C1C] mb-1">
                +$1 to Take Any Spot
              </div>
              <p className="text-xs text-[#555555]">
                Want #1? Pay $1 more than the current leader to immediately take their crown.
              </p>
            </div>

            <div className="border border-[#E2E2E2] p-4 bg-[#F9F9F9]">
              <div className="font-mono font-bold text-xs text-[#4F46E5] uppercase mb-1">
                03. Permanent Placement
              </div>
              <div className="font-bold text-sm text-[#1A1C1C] mb-1">
                Never Disappear
              </div>
              <p className="text-xs text-[#555555]">
                When someone outbids you, you don't vanish. You simply slide down to the next rank.
              </p>
            </div>

            <div className="border border-[#E2E2E2] p-4 bg-[#F9F9F9]">
              <div className="font-mono font-bold text-xs text-[#4F46E5] uppercase mb-1">
                04. Direct Traffic
              </div>
              <div className="font-bold text-sm text-[#1A1C1C] mb-1">
                Zero Middleware
              </div>
              <p className="text-xs text-[#555555]">
                Every visitor click sends users straight to your site with UTM tracking tags.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Radical Transparency */}
        <section className="bg-white border border-[#E2E2E2] p-6 rounded-none">
          <h2 className="font-headline-md text-xl font-bold text-[#1A1C1C] mb-3">
            4. Radical Transparency
          </h2>
          <p className="text-sm text-[#555555] mb-4">
            We believe in open data. All telemetry — total site visitors, real-time live builders, total revenue volume, and click distribution — is publicly available via open JSON endpoints.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/stats"
              className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-xs px-4 py-2 rounded-none transition-colors inline-block"
            >
              View Public Telemetry →
            </Link>
            <Link
              href="/rules"
              className="text-[#5E5E5E] hover:text-[#1A1C1C] text-xs font-mono underline"
            >
              Read Arena Rules
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
