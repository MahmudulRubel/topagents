'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SubmitAgentModal from '../submit/SubmitAgentModal';

export default function Navbar() {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-[#FF6154] flex items-center justify-center text-white font-black text-base shadow-sm group-hover:scale-105 transition-transform">
                ▲
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-gray-900 tracking-tight text-lg">
                  topagents<span className="text-[#FF6154]">.lol</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold tracking-wide uppercase rounded bg-gray-100 text-gray-600 border border-gray-200">
                  Directory
                </span>
              </div>
            </Link>

            {/* Quick Category links desktop */}
            <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-600">
              <Link href="/?category=coding" className="hover:text-gray-900 transition-colors">
                Coding
              </Link>
              <Link href="/?category=autonomous" className="hover:text-gray-900 transition-colors">
                Autonomous
              </Link>
              <Link href="/?category=voice" className="hover:text-gray-900 transition-colors">
                Voice
              </Link>
              <Link href="/?category=research" className="hover:text-gray-900 transition-colors">
                Research
              </Link>
            </nav>
          </div>

          {/* Center / Search bar */}
          <div className="flex-1 max-w-md hidden sm:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 100+ AI agents (e.g. Devin, Claude Code, Vapi)..."
                className="w-full pl-9 pr-4 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-full focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154] transition-all placeholder:text-gray-400"
              />
              <span className="absolute left-3 top-2 text-gray-400 text-xs">
                🔍
              </span>
            </form>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/submit"
              className="hidden lg:inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg border border-transparent hover:border-gray-200"
            >
              Add Agent
            </Link>

            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FF6154] hover:bg-[#E55347] text-white text-xs font-bold shadow-sm transition-all hover:shadow"
            >
              <span>+ Submit Agent</span>
              <span className="px-1.5 py-0.2 text-[9px] font-black uppercase bg-white/20 rounded-full">
                Free
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Free Submission Modal */}
      <SubmitAgentModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />
    </>
  );
}
