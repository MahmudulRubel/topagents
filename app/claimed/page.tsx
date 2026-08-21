import React from 'react';
import Link from 'next/link';
import { completeAgentPayment } from '@/lib/insforge';

export const metadata = {
  title: 'Spot Secured — topagents.lol',
  description: 'Your AI agent is now live and ranking on topagents.lol.',
};

export default async function ClaimedPage({
  searchParams,
}: {
  searchParams: { session_id?: string; demo?: string };
}) {
  const sessionId = searchParams.session_id || 'unknown';
  const isDemo = searchParams.demo === 'true';

  if (sessionId && sessionId !== 'unknown') {
    try {
      await completeAgentPayment(sessionId);
    } catch (e) {
      console.warn('Error completing agent payment on claimed page:', e);
    }
  }

  const tweetText = encodeURIComponent(
    `Just secured my AI agent on @topagentslol arena! 🔥 Check the live leaderboard and outbid me if you dare:`
  );
  const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=https://topagents.lol`;

  return (
    <main className="flex-grow w-full max-w-[800px] mx-auto px-4 md:px-8 py-12">
      <div className="bg-white border border-[#E2E2E2] rounded-none p-8 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-[#D1FAE5] text-[#059669] rounded-none flex items-center justify-center font-mono font-bold text-2xl mb-4">
          👑
        </div>

        <h1 className="font-headline-md text-3xl font-bold text-[#1A1C1C] mb-2">
          Spot Secured. You Are Live.
        </h1>

        <p className="font-body-sm text-[#5E5E5E] max-w-[500px] mb-6">
          Payment confirmed. Your AI agent is now active in the arena, ranking live, and receiving direct outbound clicks.
        </p>

        <div className="bg-[#F9F9F9] border border-[#E2E2E2] p-4 font-mono text-xs text-[#5E5E5E] w-full max-w-[480px] mb-6 text-left rounded-none">
          <div><span className="font-semibold text-[#1A1C1C]">Session Ref:</span> {sessionId}</div>
          <div><span className="font-semibold text-[#1A1C1C]">Status:</span> Live on Leaderboard ({isDemo ? 'Dev Mode' : 'Verified'})</div>
          <div><span className="font-semibold text-[#1A1C1C]">Invariant:</span> Link stays on board permanently even when outbid</div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <a
            href={tweetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#1A1C1C] hover:bg-[#333333] text-white font-semibold text-sm px-6 py-3 rounded-none transition-colors no-underline inline-flex items-center gap-2"
          >
            <span>🚀 Flex Rank on X (Twitter)</span>
          </a>
          <Link
            href="/"
            className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-sm px-6 py-3 rounded-none transition-colors no-underline inline-block"
          >
            ← View Live Leaderboard
          </Link>
        </div>
      </div>
    </main>
  );
}

