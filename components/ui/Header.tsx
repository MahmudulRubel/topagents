import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-background border-b border-outline-variant w-full sticky top-0 z-50">
      <div className="flex justify-between items-center h-12 max-w-[800px] mx-auto px-margin-mobile md:px-margin-desktop w-full">
        <Link
          href="/"
          className="font-headline-md text-headline-md font-bold text-primary hover:opacity-90"
        >
          topagents.lol
        </Link>
        <nav className="flex gap-4 font-body-sm text-body-sm">
          <Link
            className="text-primary font-bold hover:text-primary transition-colors duration-200"
            href="/"
          >
            Leaderboard
          </Link>
          <Link
            className="text-secondary hover:text-primary transition-colors duration-200"
            href="/about"
          >
            About
          </Link>
          <Link
            className="text-secondary hover:text-primary transition-colors duration-200"
            href="/rules"
          >
            Rules
          </Link>
          <Link
            className="text-secondary hover:text-primary transition-colors duration-200"
            href="/stats"
          >
            Stats
          </Link>
        </nav>
      </div>
    </header>
  );
}
