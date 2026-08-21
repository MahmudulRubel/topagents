import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Arena Rules — topagents.lol',
  description: 'The five golden rules and fair play policies for topagents.lol.',
};

export default function RulesPage() {
  const rules = [
    {
      num: '01',
      title: 'Money Talks, Math Decides',
      desc: 'Rankings are computed dynamically on the server: ORDER BY amount_cents DESC. There are no manual overrides, secret partner boosts, or hidden algorithmic tweaks.',
    },
    {
      num: '02',
      title: 'Valid AI Agents Only',
      desc: 'Submissions must be legitimate AI products, agents, developer tools, bots, or workflows. Submissions promoting malware, phishing, fraudulent scams, or hate speech will be incinerated immediately with zero refund.',
    },
    {
      num: '03',
      title: 'Outbid Bids are Final',
      desc: 'All payments are final and non-refundable. You are purchasing immediate, high-intent traffic and rank visibility in the active arena.',
    },
    {
      num: '04',
      title: 'Strict Privacy & Zero Tracking',
      desc: 'Your receipt email is strictly private and will never be shared, sold, or displayed in public API responses. We do not inject ad trackers or trackers into outbound redirects.',
    },
    {
      num: '05',
      title: 'Permanent Placement Guarantee',
      desc: 'When outbid, your agent remains on the leaderboard indefinitely. You simply slide down to the appropriate dynamic rank as other builders place higher bids.',
    },
  ];

  return (
    <main className="flex-grow max-w-[800px] w-full mx-auto px-margin-mobile md:px-margin-desktop py-8">
      {/* Header */}
      <div className="mb-8 border-b border-[#E2E2E2] pb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-xs bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE] px-2 py-0.5 font-bold uppercase tracking-wider">
            FAIR PLAY POLICY
          </span>
        </div>
        <h1 className="font-headline-lg text-3xl font-bold text-[#1A1C1C] mb-3">
          The 5 Golden Rules of the Arena
        </h1>
        <p className="font-body-md text-body-md text-[#5E5E5E] leading-relaxed">
          Clear, immutable principles governing all bids, rankings, and listings on topagents.lol.
        </p>
      </div>

      {/* Rules List */}
      <div className="space-y-4 mb-8">
        {rules.map((rule) => (
          <div
            key={rule.num}
            className="bg-white border border-[#E2E2E2] p-5 rounded-none flex items-start gap-4"
          >
            <span className="font-mono text-base font-bold text-[#4F46E5] bg-[#EEF2FF] border border-[#C7D2FE] px-2 py-1 shrink-0">
              {rule.num}
            </span>
            <div>
              <h2 className="font-bold text-base text-[#1A1C1C] mb-1">
                {rule.title}
              </h2>
              <p className="text-sm text-[#555555] leading-relaxed">
                {rule.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Action Footer */}
      <div className="bg-[#F9F9F9] border border-[#E2E2E2] p-6 rounded-none flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-sm text-[#1A1C1C] mb-1">Ready to enter the arena?</h3>
          <p className="text-xs text-[#555555]">Check current leaderboard standings or outbid the leader.</p>
        </div>
        <Link
          href="/"
          className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-xs px-5 py-2.5 rounded-none transition-colors shrink-0"
        >
          View Live Leaderboard →
        </Link>
      </div>
    </main>
  );
}
