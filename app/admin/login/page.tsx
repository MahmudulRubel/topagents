'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [passcode, setPasscode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed.');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid admin passcode.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-200 shadow-xl p-8 sm:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#FF6154] flex items-center justify-center text-white font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
              ▲
            </div>
            <span className="font-black text-gray-950 text-xl tracking-tight">
              topagents<span className="text-[#FF6154]">.lol</span>
            </span>
          </Link>
          <h1 className="text-2xl font-black text-gray-950 tracking-tight">
            Admin Console
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Authenticate to manage submissions and DeepSeek editorial reviews.
          </p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold text-center">
            {errorMessage}
          </div>
        )}

        {/* Passcode Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Admin Secret Passcode
            </label>
            <input
              type="password"
              required
              autoFocus
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter ADMIN_SECRET_KEY..."
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154] transition-all"
            />
            <p className="mt-1.5 text-[11px] text-gray-400">
              Configured via <code className="font-mono text-gray-600">ADMIN_SECRET_KEY</code> in your environment.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-full bg-[#FF6154] hover:bg-[#E55347] text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading && (
              <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {isLoading ? 'Verifying...' : 'Unlock Admin Dashboard →'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <Link
            href="/"
            className="text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors"
          >
            ← Return to Public Directory
          </Link>
        </div>
      </div>
    </div>
  );
}
