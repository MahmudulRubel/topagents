'use client';

import { useState, useMemo } from 'react';
import { Agent } from '@/lib/data/types';
import AgentCard from './AgentCard';
import CategoryFilter from './CategoryFilter';

interface DirectoryFeedProps {
  initialAgents: Agent[];
  initialCategory?: string;
  initialQuery?: string;
}

type SortOption = 'upvotes' | 'rating' | 'rank' | 'open-source';

export default function DirectoryFeed({
  initialAgents,
  initialCategory = 'all',
  initialQuery = '',
}: DirectoryFeedProps) {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [sortBy, setSortBy] = useState<SortOption>('upvotes');
  const [displayCount, setDisplayCount] = useState<number>(25);

  const filteredAgents = useMemo(() => {
    let list = [...initialAgents];

    // Filter by Category
    if (activeCategory !== 'all') {
      list = list.filter((a) => a.category === activeCategory);
    }

    // Filter by Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.tagline.toLowerCase().includes(q) ||
          a.categoryLabel.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q)) ||
          a.developer.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'upvotes') {
      list.sort((a, b) => b.upvotesCount - a.upvotesCount);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.overallRating - a.overallRating);
    } else if (sortBy === 'rank') {
      list.sort((a, b) => a.launchRank - b.launchRank);
    } else if (sortBy === 'open-source') {
      list = list.filter((a) => a.pricingModel === 'open-source');
      list.sort((a, b) => b.upvotesCount - a.upvotesCount);
    }

    return list;
  }, [initialAgents, activeCategory, searchQuery, sortBy]);

  const visibleAgents = filteredAgents.slice(0, displayCount);
  const hasMore = visibleAgents.length < filteredAgents.length;

  return (
    <div className="space-y-6">
      {/* Category Pills Header */}
      <div className="space-y-4">
        <CategoryFilter
          activeCategory={activeCategory}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            setDisplayCount(25);
          }}
        />

        {/* Filter Controls Row: Search + Sort options */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-gray-100">
          {/* Search bar inside feed */}
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setDisplayCount(25);
              }}
              placeholder="Filter agents by name, tag, or tech..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154]"
            />
            <span className="absolute left-3 top-2 text-gray-400 text-xs">
              🔍
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1.5 text-gray-400 hover:text-gray-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Tabs */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 overflow-x-auto">
            <span className="text-[11px] uppercase tracking-wider text-gray-400 mr-1 hidden sm:inline">
              Sort:
            </span>

            <button
              onClick={() => setSortBy('upvotes')}
              className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
                sortBy === 'upvotes'
                  ? 'bg-gray-100 text-gray-900 font-bold'
                  : 'hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              ▲ Most Upvoted
            </button>

            <button
              onClick={() => setSortBy('rating')}
              className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
                sortBy === 'rating'
                  ? 'bg-gray-100 text-gray-900 font-bold'
                  : 'hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              ★ Top Rated
            </button>

            <button
              onClick={() => setSortBy('open-source')}
              className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
                sortBy === 'open-source'
                  ? 'bg-gray-100 text-gray-900 font-bold'
                  : 'hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Open Source
            </button>

            <button
              onClick={() => setSortBy('rank')}
              className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
                sortBy === 'rank'
                  ? 'bg-gray-100 text-gray-900 font-bold'
                  : 'hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Launch Rank
            </button>
          </div>
        </div>
      </div>

      {/* Directory Count Header */}
      <div className="flex items-center justify-between text-xs text-gray-500 px-1">
        <span>
          Showing <strong>{visibleAgents.length}</strong> of{' '}
          <strong>{filteredAgents.length}</strong> AI agents
        </span>
        {activeCategory !== 'all' && (
          <button
            onClick={() => setActiveCategory('all')}
            className="text-[#FF6154] hover:underline font-semibold"
          >
            Clear category filter
          </button>
        )}
      </div>

      {/* Agent Cards Stack */}
      {visibleAgents.length > 0 ? (
        <div className="space-y-3">
          {visibleAgents.map((agent, index) => (
            <AgentCard key={agent.id} agent={agent} rank={index + 1} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500 text-sm mb-3">
            No agents found matching &ldquo;{searchQuery}&rdquo; in this category.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
            className="px-4 py-2 rounded-full bg-gray-900 text-white text-xs font-semibold"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center pt-6 pb-4">
          <button
            onClick={() => setDisplayCount((prev) => prev + 25)}
            className="px-6 py-2.5 rounded-full border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-sm transition-all"
          >
            Load More Agents ({filteredAgents.length - visibleAgents.length} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
