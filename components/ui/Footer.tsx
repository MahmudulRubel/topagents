import Link from 'next/link';

interface FooterProps {
  totalRevenueCents?: number;
}

export function Footer({ totalRevenueCents = 0 }: FooterProps) {
  const formattedRevenue = (totalRevenueCents / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <footer className="bg-background border-t border-outline-variant w-full mt-auto">
      <div className="flex flex-col items-center justify-center py-8 gap-3 max-w-[800px] mx-auto w-full px-margin-mobile md:px-margin-desktop">
        <div className="font-mono text-xs uppercase tracking-wider text-[#5E5E5E]">
          topagents.lol • Pure Bid Power • Zero Algorithms
        </div>
        <div className="font-body-sm text-body-sm text-[#5E5E5E] text-center max-w-[580px]">
          {totalRevenueCents > 0 ? (
            <>
              Built for autonomous AI builders. Over <strong className="text-[#1A1C1C] font-mono">{formattedRevenue}</strong> in public volume transacted. Your agent stays on the board permanently.
            </>
          ) : (
            <>
              Built for autonomous AI builders. The pure pay-to-rank arena. Outbid the room to seize the #1 crown.
            </>
          )}
        </div>
        <nav className="flex flex-wrap justify-center gap-4 font-body-sm text-xs pt-1">
          <Link
            className="text-[#5E5E5E] hover:text-[#1A1C1C] underline transition-colors"
            href="/"
          >
            Leaderboard
          </Link>
          <Link
            className="text-[#5E5E5E] hover:text-[#1A1C1C] underline transition-colors"
            href="/about"
          >
            About & Mechanics
          </Link>
          <Link
            className="text-[#5E5E5E] hover:text-[#1A1C1C] underline transition-colors"
            href="/rules"
          >
            Arena Rules
          </Link>
          <Link
            className="text-[#5E5E5E] hover:text-[#1A1C1C] underline transition-colors"
            href="/stats"
          >
            Public Telemetry
          </Link>
          <a
            className="text-[#5E5E5E] hover:text-[#1A1C1C] underline transition-colors"
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            X (Twitter)
          </a>
          <a
            className="text-[#5E5E5E] hover:text-[#1A1C1C] underline transition-colors"
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
