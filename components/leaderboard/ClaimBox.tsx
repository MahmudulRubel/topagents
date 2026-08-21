'use client';

import React, { useState } from 'react';

interface ClaimBoxProps {
  topAgentAmountCents?: number;
  onOpenClaimModal: (bidDollars?: number) => void;
}

export default function ClaimBox({
  topAgentAmountCents = 0,
  onOpenClaimModal,
}: ClaimBoxProps) {
  const minRequiredCents = topAgentAmountCents > 0 ? topAgentAmountCents + 100 : 100;
  const minRequiredDollars = (minRequiredCents / 100).toFixed(2);
  const [inputBid, setInputBid] = useState<string>(minRequiredDollars);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(inputBid);
    const validBid = !isNaN(parsed) && parsed >= parseFloat(minRequiredDollars)
      ? parsed
      : parseFloat(minRequiredDollars);
    onOpenClaimModal(validBid);
  };

  return (
    <div className="border border-[#E2E2E2] bg-white p-4 md:p-5 rounded-none mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left side info */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold bg-[#E2DFFF] text-[#3323CC] px-2 py-0.5 uppercase tracking-wider rounded-none">
              👑 Claim #1 Spotlight
            </span>
            <span className="font-body-sm text-body-sm text-[#5E5E5E]">
              Min bid to reign: <strong className="font-mono text-[#1A1C1C] font-bold">${minRequiredDollars}</strong>
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-[#5E5E5E]">
            Steal 100% of top-of-fold traffic. Outbid the current leader to rank #1 instantly.
          </p>
        </div>

        {/* Right side form */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-[#5E5E5E]">
              $
            </span>
            <input
              type="number"
              step="1"
              min={minRequiredDollars}
              value={inputBid}
              onChange={(e) => setInputBid(e.target.value)}
              className="w-28 pl-7 pr-3 py-2 font-mono text-sm border border-[#E2E2E2] rounded-none focus:outline-none focus:border-[#4F46E5] bg-[#F9F9F9]"
              placeholder={minRequiredDollars}
            />
          </div>
          <button
            type="submit"
            className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-sm px-5 py-2 rounded-none transition-colors cursor-pointer border-none shadow-none"
          >
            ⚡ Take #1 Rank
          </button>
        </form>
      </div>
    </div>
  );
}
