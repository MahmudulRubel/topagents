'use client';

import React, { useState } from 'react';
import { Category } from '@/lib/types';

interface ClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBidDollars?: number;
  targetRank?: number;
}

const CATEGORIES: { label: string; value: Category }[] = [
  { label: 'Coding', value: 'coding' },
  { label: 'Voice', value: 'voice' },
  { label: 'Browser', value: 'browser' },
  { label: 'Support', value: 'support' },
  { label: 'Sales', value: 'sales' },
  { label: 'Research', value: 'research' },
  { label: 'Workflow', value: 'workflow' },
  { label: 'Other', value: 'other' },
];

export default function ClaimModal({
  isOpen,
  onClose,
  initialBidDollars = 1,
  targetRank = 1,
}: ClaimModalProps) {
  const [agentName, setAgentName] = useState('');
  const [tagline, setTagline] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState<Category>('coding');
  const [logoUrl, setLogoUrl] = useState('');
  const [claimedByHandle, setClaimedByHandle] = useState('');
  const [email, setEmail] = useState('');
  const [bidDollars, setBidDollars] = useState(initialBidDollars);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_name: agentName,
          tagline,
          url,
          category,
          logo_url: logoUrl || undefined,
          claimed_by_handle: claimedByHandle || undefined,
          claimed_by_email: email,
          amount_cents: Math.round(bidDollars * 100),
          target_rank: targetRank,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMsg(data.error || 'Failed to initialize checkout session.');
        setIsSubmitting(false);
        return;
      }

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        setErrorMsg('Checkout URL was not returned.');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Claim submission error:', err);
      setErrorMsg('Network error submitting claim. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white border border-[#E2E2E2] w-full max-w-[500px] p-6 rounded-none shadow-none relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2E2E2] pb-4 mb-5">
          <div>
            <h2 className="font-headline-md text-headline-md font-bold text-[#1A1C1C]">
              Claim Spot #{targetRank} in the Arena
            </h2>
            <p className="font-body-sm text-body-sm text-[#5E5E5E]">
              Outbid the competition. Your AI agent goes live the moment payment clears.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#5E5E5E] hover:text-[#1A1C1C] font-mono text-xl bg-transparent border-none p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block font-label-caps text-label-caps text-[#1A1C1C] mb-1">
              Agent Name *
            </label>
            <input
              type="text"
              required
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="e.g. CodeForge AI"
              className="w-full px-3 py-2 font-body-sm text-sm border border-[#E2E2E2] rounded-none focus:outline-none focus:border-[#4F46E5] bg-[#F9F9F9]"
            />
          </div>

          <div>
            <label className="block font-label-caps text-label-caps text-[#1A1C1C] mb-1">
              Tagline * (Max 120 chars)
            </label>
            <input
              type="text"
              required
              maxLength={120}
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Autonomous full-stack engineer that reviews PRs and fixes bugs"
              className="w-full px-3 py-2 font-body-sm text-sm border border-[#E2E2E2] rounded-none focus:outline-none focus:border-[#4F46E5] bg-[#F9F9F9]"
            />
          </div>

          <div>
            <label className="block font-label-caps text-label-caps text-[#1A1C1C] mb-1">
              Destination URL * (Where visitors will be sent)
            </label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youragent.ai"
              className="w-full px-3 py-2 font-body-sm text-sm border border-[#E2E2E2] rounded-none focus:outline-none focus:border-[#4F46E5] bg-[#F9F9F9]"
            />
            <span className="text-[11px] text-[#5E5E5E] mt-1 block">
              Direct link. All outbound clicks include UTM parameters and live click counts.
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-label-caps text-label-caps text-[#1A1C1C] mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3 py-2 font-body-sm text-sm border border-[#E2E2E2] rounded-none focus:outline-none focus:border-[#4F46E5] bg-[#F9F9F9]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-label-caps text-label-caps text-[#1A1C1C] mb-1">
                Twitter / X Handle
              </label>
              <input
                type="text"
                value={claimedByHandle}
                onChange={(e) => setClaimedByHandle(e.target.value.replace('@', ''))}
                placeholder="username (optional)"
                className="w-full px-3 py-2 font-body-sm text-sm border border-[#E2E2E2] rounded-none focus:outline-none focus:border-[#4F46E5] bg-[#F9F9F9]"
              />
            </div>
          </div>

          <div>
            <label className="block font-label-caps text-label-caps text-[#1A1C1C] mb-1">
              Receipt Email * (Kept Strictly Private)
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="founder@agent.ai"
              className="w-full px-3 py-2 font-body-sm text-sm border border-[#E2E2E2] rounded-none focus:outline-none focus:border-[#4F46E5] bg-[#F9F9F9]"
            />
            <span className="text-[11px] text-[#5E5E5E] mt-1 block">
              🔒 Privacy Guaranteed: Email is only used for payment receipts and outbid alerts. Never public.
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-label-caps text-label-caps text-[#1A1C1C]">
                Your Bid (USD) *
              </label>
              <span className="text-[11px] font-mono text-[#5E5E5E]">
                Min to claim #{targetRank}: ${initialBidDollars}
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-[#5E5E5E]">
                $
              </span>
              <input
                type="number"
                min={initialBidDollars}
                step="1"
                required
                value={bidDollars}
                onChange={(e) => setBidDollars(parseFloat(e.target.value) || initialBidDollars)}
                className="w-full pl-7 pr-3 py-2 font-mono text-sm border border-[#E2E2E2] rounded-none focus:outline-none focus:border-[#4F46E5] bg-[#F9F9F9]"
              />
            </div>
            <span className="text-[11px] text-[#5E5E5E] mt-1 block">
              When outbid, your agent remains on the leaderboard forever at its dynamic rank.
            </span>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono rounded-none">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 mt-4 border-t border-[#E2E2E2] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-body-sm text-sm text-[#5E5E5E] hover:text-[#1A1C1C] bg-transparent border-none cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-sm px-6 py-2.5 rounded-none transition-colors cursor-pointer border-none disabled:opacity-50"
            >
              {isSubmitting ? 'Securing Spot...' : `⚡ Lock In $${bidDollars} & Claim Spot`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
