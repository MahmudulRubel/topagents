'use client';

import { useState, useEffect, useRef } from 'react';

interface AgentIntentSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  resultCount: number;
  totalCount: number;
  activeCategory?: string;
  totalAcrossCategories?: number;
  onResetCategory?: () => void;
}

const ROTATING_SUGGESTIONS = [
  'coding fullstack apps autonomously',
  'automated B2B cold email outreach',
  'transcribing meetings without an AI bot',
  'scraping dynamic websites and social media',
  'scientific literature research with citations',
  'self-hosted workflow automation in Docker',
  'generating photorealistic images and videos',
  'managing calendar schedules and focus time',
];

const QUICK_PROMPTS = [
  { label: '💻 Fullstack Coding', query: 'coding fullstack' },
  { label: '📈 Cold Outbound SDR', query: 'cold email outreach' },
  { label: '🎙️ Bot-Free Meeting Notes', query: 'transcribing meetings without bot' },
  { label: '🌐 Browser & Web Scraping', query: 'browser scraping' },
  { label: '🔬 Research & Citations', query: 'scientific research citations' },
  { label: '🐳 Self-Hosted / Docker', query: 'docker self-hosted' },
  { label: '🎨 Image & Video AI', query: 'image and video generation' },
  { label: '🔓 Free & Open-Source', query: 'free open-source' },
  { label: '🧠 Claude 3.5 Sonnet', query: 'claude 3.5 sonnet' },
];

export default function AgentIntentSearchBar({
  searchQuery,
  onSearchChange,
  resultCount,
  totalCount,
  activeCategory = 'all',
  totalAcrossCategories = 0,
  onResetCategory,
}: AgentIntentSearchBarProps) {
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Rotate suggestion placeholder every 3.5 seconds if input is empty
  useEffect(() => {
    if (searchQuery) return;
    const interval = setInterval(() => {
      setSuggestionIndex((prev) => (prev + 1) % ROTATING_SUGGESTIONS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [searchQuery]);

  // Global keyboard shortcut: "/" or Cmd/Ctrl + K focuses the search bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInputFocused =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (e.key === '/' && !isInputFocused) {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        if (searchQuery) {
          onSearchChange('');
        } else {
          inputRef.current?.blur();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchQuery, onSearchChange]);

  const handlePromptClick = (promptQuery: string) => {
    if (searchQuery.toLowerCase().trim() === promptQuery.toLowerCase().trim()) {
      // Toggle off if already selected
      onSearchChange('');
    } else {
      onSearchChange(promptQuery);
      inputRef.current?.focus();
    }
  };

  const handleClear = () => {
    onSearchChange('');
    inputRef.current?.focus();
  };

  const currentSuggestion = ROTATING_SUGGESTIONS[suggestionIndex];
  const hasMoreInOtherCategories =
    searchQuery.trim().length > 0 &&
    activeCategory !== 'all' &&
    totalAcrossCategories > resultCount;

  return (
    <div className="bg-white border-2 border-gray-200/90 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-gray-300 transition-all focus-within:border-[#FF6154] focus-within:ring-4 focus-within:ring-[#FF6154]/10">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-md bg-orange-100 text-[#FF6154] text-xs font-bold">
            ⚡
          </span>
          <span className="text-xs font-extrabold uppercase tracking-wider text-gray-900">
            Smart Agent Finder
          </span>
          {!searchQuery && (
            <button
              type="button"
              onClick={() => handlePromptClick(currentSuggestion)}
              className="hidden md:inline-flex items-center gap-1 text-[11px] text-gray-500 hover:text-[#FF6154] transition-colors bg-gray-50 hover:bg-orange-50/60 px-2 py-0.5 rounded-full border border-gray-200/80"
              title="Click to search this example"
            >
              <span>💡</span>
              <span className="italic">&ldquo;{currentSuggestion}&rdquo;</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-500">
          {searchQuery.trim() ? (
            <span
              className={`px-2.5 py-0.5 rounded-full font-bold ${
                resultCount > 0
                  ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                  : 'text-amber-700 bg-amber-50 border border-amber-200'
              }`}
            >
              {resultCount} {resultCount === 1 ? 'agent matches' : 'agents match'}
            </span>
          ) : (
            <span>Search {totalCount}+ agents by task, model, or goal</span>
          )}
        </div>
      </div>

      {/* Main input bar with "I want an agent for..." prefix */}
      <div className="relative flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 bg-gray-50/80 border border-gray-200 rounded-xl p-1.5 focus-within:bg-white focus-within:border-[#FF6154]/60 transition-all">
        {/* Visual Prefix */}
        <label
          htmlFor="agent-intent-search-input"
          className="flex items-center gap-2 pl-3 pr-1 py-1 text-gray-900 font-extrabold text-sm sm:text-base shrink-0 select-none cursor-pointer"
        >
          <span className="text-base sm:text-lg">🤖</span>
          <span className="text-gray-950 font-black">I want an agent for</span>
        </label>

        {/* Input */}
        <div className="relative flex-1">
          <input
            id="agent-intent-search-input"
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={`${currentSuggestion}...`}
            aria-label="I want an agent for"
            className="w-full bg-transparent px-3 py-2 pr-9 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 focus:outline-none font-medium"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-700 text-xs w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-200/70 transition-colors"
              title="Clear search (Esc)"
            >
              ✕
            </button>
          )}
        </div>

        {/* Action button / Shortcut indicator */}
        <div className="shrink-0 flex items-center justify-end px-1 sm:px-1.5">
          {searchQuery.trim() ? (
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-1.5 text-xs font-bold text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors shadow-2xs"
            >
              Reset
            </button>
          ) : (
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono text-gray-400 bg-white border border-gray-200 rounded-md shadow-2xs select-none">
              <span>Press</span>
              <kbd className="font-sans font-bold text-gray-600">/</kbd>
              <span>or</span>
              <kbd className="font-sans font-bold text-gray-600">⌘K</kbd>
            </div>
          )}
        </div>
      </div>

      {/* Cross-category helper banner when filtered by a single category */}
      {hasMoreInOtherCategories && onResetCategory && (
        <div className="mt-2.5 flex items-center justify-between bg-indigo-50/70 border border-indigo-200/80 rounded-lg px-3 py-1.5 text-xs text-indigo-900">
          <span>
            Found <strong>{totalAcrossCategories}</strong> matching agents across all categories (currently filtered to{' '}
            <strong className="capitalize">{activeCategory}</strong>).
          </span>
          <button
            type="button"
            onClick={onResetCategory}
            className="font-bold text-indigo-700 hover:text-indigo-950 underline ml-2 shrink-0"
          >
            Search All Categories →
          </button>
        </div>
      )}

      {/* Quick Suggestions Pills */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2.5 border-t border-gray-100">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1">
          Popular Goals:
        </span>
        {QUICK_PROMPTS.map((prompt) => {
          const isSelected =
            searchQuery.toLowerCase().trim() === prompt.query.toLowerCase().trim();
          return (
            <button
              key={prompt.label}
              type="button"
              onClick={() => handlePromptClick(prompt.query)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 ${
                isSelected
                  ? 'bg-[#FF6154] text-white border-[#FF6154] font-bold shadow-2xs'
                  : 'bg-gray-50/70 hover:bg-white text-gray-700 hover:text-gray-950 border-gray-200 hover:border-gray-300 font-medium'
              }`}
            >
              <span>{prompt.label}</span>
              {isSelected && <span className="text-[10px] ml-0.5 opacity-90">✕</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
