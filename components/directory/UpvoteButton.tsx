'use client';

import { useState, useEffect } from 'react';

interface UpvoteButtonProps {
  slug: string;
  initialVotes: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function UpvoteButton({
  slug,
  initialVotes,
  size = 'md',
  showLabel = false,
}: UpvoteButtonProps) {
  const [votes, setVotes] = useState(initialVotes);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    try {
      const upvotedSlugs = JSON.parse(localStorage.getItem('topagents_upvotes') || '[]');
      if (Array.isArray(upvotedSlugs) && upvotedSlugs.includes(slug)) {
        setHasUpvoted(true);
      }
    } catch {
      // Ignore local storage error
    }
  }, [slug]);

  const handleToggleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 400);

    const nextState = !hasUpvoted;
    const nextVotes = nextState ? votes + 1 : Math.max(initialVotes, votes - 1);

    setHasUpvoted(nextState);
    setVotes(nextVotes);

    try {
      const stored: string[] = JSON.parse(localStorage.getItem('topagents_upvotes') || '[]');
      let updated: string[];
      if (nextState) {
        updated = Array.from(new Set([...stored, slug]));
      } else {
        updated = stored.filter((s) => s !== slug);
      }
      localStorage.setItem('topagents_upvotes', JSON.stringify(updated));

      // Trigger non-blocking backend sync
      fetch(`/api/agents/${slug}/upvote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: nextState ? 'upvote' : 'remove' }),
      }).catch(() => {
        // Fallback silently
      });
    } catch {
      // Ignore local storage write errors
    }
  };

  if (size === 'lg') {
    return (
      <button
        onClick={handleToggleUpvote}
        aria-label={`Upvote (${votes})`}
        className={`flex items-center gap-2.5 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all border shadow-sm ${
          hasUpvoted
            ? 'bg-[#FF6154] text-white border-[#FF6154] hover:bg-[#E55347]'
            : 'bg-white text-gray-800 border-gray-200 hover:border-[#FF6154] hover:text-[#FF6154] hover:bg-[#FFF5F5]'
        } ${isAnimating ? 'scale-105' : 'scale-100'}`}
      >
        <span className="text-base leading-none">▲</span>
        <span>{showLabel ? 'UPVOTE' : ''}</span>
        <span className={`font-mono font-bold ${hasUpvoted ? 'text-white' : 'text-gray-900'}`}>
          {votes.toLocaleString()}
        </span>
      </button>
    );
  }

  // Card view: compact vertical pill
  return (
    <button
      onClick={handleToggleUpvote}
      aria-label={`Upvote (${votes})`}
      className={`flex flex-col items-center justify-center min-w-[54px] w-[54px] h-[58px] rounded-lg border transition-all ${
        hasUpvoted
          ? 'bg-[#FF6154] text-white border-[#FF6154] shadow-sm'
          : 'bg-white text-gray-700 border-gray-200 hover:border-[#FF6154] hover:text-[#FF6154] hover:bg-[#FFF8F7]'
      } ${isAnimating ? 'scale-110' : 'scale-100'}`}
    >
      <span className="text-xs leading-none mb-1">▲</span>
      <span className={`text-[12px] font-bold font-mono ${hasUpvoted ? 'text-white' : 'text-gray-800'}`}>
        {votes.toLocaleString()}
      </span>
    </button>
  );
}
