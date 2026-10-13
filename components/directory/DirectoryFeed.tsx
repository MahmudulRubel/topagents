'use client';

import { useState, useMemo, useEffect } from 'react';
import { Agent } from '@/lib/data/types';
import { searchAgents } from '@/lib/search/agent-search';
import AgentCard from './AgentCard';
import CategoryFilter from './CategoryFilter';
import AgentIntentSearchBar from './AgentIntentSearchBar';
import NewAgentsSection from './NewAgentsSection';

interface DirectoryFeedProps {
  initialAgents: Agent[];
  initialCategory?: string;
  initialQuery?: string;
  showRecentlyAdded?: boolean;
}

type SortOption = 'relevance' | 'newest' | 'upvotes' | 'rating' | 'rank' | 'open-source';

export default function DirectoryFeed({
  initialAgents,
  initialCategory = 'all',
  initialQuery = '',
  showRecentlyAdded = false,
}: DirectoryFeedProps) {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [sortBy, setSortBy] = useState<SortOption>(initialQuery.trim() ? 'relevance' : 'upvotes');
  const [displayCount, setDisplayCount] = useState<number>(25);

  // Sync URL query / category changes (e.g. from Navbar search)
  useEffect(() => {
    setSearchQuery(initialQuery);
    if (initialQuery.trim()) {
      setSortBy('relevance');
    }
  }, [initialQuery]);

  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setDisplayCount(25);
    if (query.trim()) {
      setSortBy('relevance');
    } else if (sortBy === 'relevance') {
      setSortBy('upvotes');
    }
  };

  // Run multi-signal search & scoring
  const searchResult = useMemo(() => {
    return searchAgents(initialAgents, searchQuery, activeCategory);
  }, [initialAgents, searchQuery, activeCategory]);

  const filteredAgents = useMemo(() => {
    let list = [...searchResult.results];
    const isSearching = searchQuery.trim().length > 0;

    // If user selected 'relevance' and is actively searching, preserve the semantic score order
    if (sortBy === 'relevance' && isSearching) {
      return list;
    }

    // Apply user-selected sort
    if (sortBy === 'newest') {
      list.sort((a, b) => {
        const aIsSub = a.id.startsWith('sub_') ? 1 : 0;
        const bIsSub = b.id.startsWith('sub_') ? 1 : 0;
        if (aIsSub !== bIsSub) return bIsSub - aIsSub;
        return (b.releaseYear || 2026) - (a.releaseYear || 2026);
      });
    } else if (sortBy === 'upvotes' || (sortBy === 'relevance' && !isSearching)) {
      list.sort((a, b) => b.upvotesCount - a.upvotesCount);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.overallRating - a.overallRating);
    } else if (sortBy === 'rank') {
      list.sort((a, b) => a.launchRank - b.launchRank);
    } else if (sortBy === 'open-source') {
      list = list.filter((a) => a.pricingModel === 'open-source');
      if (!isSearching) {
        list.sort((a, b) => b.upvotesCount - a.upvotesCount);
      }
    }

    return list;
  }, [searchResult.results, searchQuery, sortBy]);

  const visibleAgents = filteredAgents.slice(0, displayCount);
  const hasMore = visibleAgents.length < filteredAgents.length;
  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* Advanced "I want an agent for..." Search Bar (Top of feed, above Recently Added) */}
      <AgentIntentSearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        resultCount={filteredAgents.length}
        totalCount={initialAgents.length}
        activeCategory={activeCategory}
        totalAcrossCategories={searchResult.totalMatchesAcrossAllCategories}
        onResetCategory={() => {
          setActiveCategory('all');
          setDisplayCount(25);
        }}
      />

      {/* Recently Added Agents (Shown below Search Bar when not actively searching) */}
      {showRecentlyAdded && !isSearching && (
        <div className="pt-2">
          <NewAgentsSection agents={initialAgents} />
        </div>
      )}

      {/* Category Pills Header */}
      <div className="space-y-4">
        <CategoryFilter
          activeCategory={activeCategory}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            setDisplayCount(25);
          }}
        />

        {/* Filter Controls Row: Result count & Sort options */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium flex-wrap">
            <span>
              Showing <strong className="text-gray-900">{visibleAgents.length}</strong> of{' '}
              <strong className="text-gray-900">{filteredAgents.length}</strong> agents
              {isSearching && searchResult.cleanedQuery && (
                <span className="text-gray-500">
                  {' '}
                  for <strong className="text-[#FF6154]">&ldquo;{searchResult.cleanedQuery}&rdquo;</strong>
                </span>
              )}
            </span>
            {isSearching && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="text-xs text-[#FF6154] hover:underline font-bold ml-1"
              >
                Clear search
              </button>
            )}
            {activeCategory !== 'all' && (
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className="text-xs text-[#FF6154] hover:underline font-bold ml-1"
              >
                Clear category filter
              </button>
            )}
          </div>

          {/* Sort Tabs */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 overflow-x-auto">
            <span className="text-[11px] uppercase tracking-wider text-gray-400 mr-1 hidden sm:inline">
              Sort:
            </span>

            {isSearching && (
              <button
                type="button"
                onClick={() => setSortBy('relevance')}
                className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 flex items-center gap-1 ${
                  sortBy === 'relevance'
                    ? 'bg-orange-50 text-[#FF6154] border border-orange-200 font-bold'
                    : 'hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span>🎯 Best Match</span>
              </button>
            )}

            <button
              type="button"
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
              type="button"
              onClick={() => setSortBy('newest')}
              className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 flex items-center gap-1.5 ${
                sortBy === 'newest'
                  ? 'bg-gray-100 text-gray-900 font-bold'
                  : 'hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span>⚡ Newest</span>
            </button>

            <button
              type="button"
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
              type="button"
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
              type="button"
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

      {/* Agent Cards Stack */}
      {visibleAgents.length > 0 ? (
        <div className="space-y-3">
          {visibleAgents.map((agent, index) => (
            <AgentCard key={agent.id} agent={agent} rank={index + 1} />
          ))}
        </div>
      ) : (
        <div className="p-10 sm:p-12 text-center bg-white rounded-2xl border border-gray-200 space-y-4">
          <div className="text-3xl">🔎</div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-gray-900">
              No agents found matching &ldquo;{searchQuery}&rdquo;
              {activeCategory !== 'all' ? ` in ${activeCategory}` : ''}
            </h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              {activeCategory !== 'all' && searchResult.totalMatchesAcrossAllCategories > 0
                ? `We found ${searchResult.totalMatchesAcrossAllCategories} matching agents in other categories.`
                : 'Try searching by task (e.g., "coding", "cold email", "scraping", "meeting notes") or model name.'}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2.5 flex-wrap pt-1">
            {activeCategory !== 'all' && searchResult.totalMatchesAcrossAllCategories > 0 && (
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className="px-4 py-2 rounded-full bg-[#FF6154] hover:bg-[#E55347] text-white text-xs font-bold shadow-xs transition-all"
              >
                Show {searchResult.totalMatchesAcrossAllCategories} Matches in All Categories
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                handleSearchChange('');
                setActiveCategory('all');
              }}
              className="px-4 py-2 rounded-full bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold transition-all"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center pt-6 pb-4">
          <button
            type="button"
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
