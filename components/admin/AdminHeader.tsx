'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      router.push('/admin/login');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[#FF6154] flex items-center justify-center text-white font-black text-sm shadow-sm group-hover:scale-105 transition-transform">
              ▲
            </div>
            <span className="font-black text-gray-950 text-base tracking-tight">
              topagents<span className="text-[#FF6154]">.lol</span>
            </span>
          </Link>
          <div className="h-4 w-[1px] bg-gray-200" />
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded bg-gray-900 text-white">
              Admin Console
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:text-gray-950 hover:bg-gray-50 transition-colors"
          >
            <span>Live Directory</span>
            <span className="text-[10px]">↗</span>
          </Link>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
