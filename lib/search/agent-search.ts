import { Agent, AgentCategory } from '../data/types';

/**
 * Natural language intent prefixes to strip so conversational inputs like
 * "I want an agent for coding" or "find me an agent that does cold email"
 * resolve cleanly to the core intent.
 */
const INTENT_PREFIX_REGEX = /^(?:i want an? (?:ai )?agent (?:for|that|to|which)|i need an? (?:ai )?agent (?:for|that|to|which)|i'm looking for an? (?:ai )?agent (?:for|that|to|which)|looking for an? (?:ai )?agent (?:for|that|to|which)|find me an? (?:ai )?agent (?:for|that|to|which)|find an? (?:ai )?agent (?:for|that|to|which)|show me (?:ai )?agents? (?:for|that|to|which)|best (?:ai )?agents? (?:for|that|to|which)|agents? (?:for|that|to|which)|tools? (?:for|that|to|which)|i want to|how to)\s+/i;

/**
 * Common English stop words and generic verbs that shouldn't dilute multi-token matching
 */
const STOP_WORDS = new Set([
  'and', 'or', 'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'without', 
  'by', 'from', 'as', 'is', 'are', 'be', 'can', 'all', 'any', 'about', 'that', 'this',
  'into', 'which', 'who', 'whom', 'whose', 'where', 'when', 'why', 'how', 'does', 'do',
  'me', 'my', 'we', 'our', 'you', 'your', 'it', 'its', 'their', 'them', 'some', 'than',
  'apps', 'app', 'tool', 'tools', 'using', 'autonomously', 'automated', 'dynamic',
  'generating', 'managing', 'websites', 'website'
]);

/**
 * Technical compound phrase normalizations (preserves hyphens so compound concepts stay atomic)
 */
const COMPOUND_INTENTS: Array<[RegExp, string]> = [
  [/without\s+(?:an?\s+)?(?:ai\s+)?bots?/gi, 'bot-free'],
  [/no\s+(?:ai\s+)?bots?/gi, 'bot-free'],
  [/open\s+source/gi, 'open-source'],
  [/self\s+hosted/gi, 'self-hosted'],
  [/cold\s+emails?/gi, 'cold-email'],
  [/web\s+scraping/gi, 'scraping browser'],
  [/social\s+media/gi, 'social-media'],
  [/full\s*stack/gi, 'fullstack'],
  [/pull\s+requests?/gi, 'pull-request'],
  [/code\s+reviews?/gi, 'code-review'],
  [/focus\s+time/gi, 'calendar focus'],
];

/**
 * Common technical abbreviations and domain synonyms to expand intent coverage
 */
const SYNONYM_MAP: Record<string, string[]> = {
  sdr: ['sales', 'outbound', 'cold-email', 'prospecting'],
  b2b: ['sales', 'outbound', 'leads', 'crm', 'prospecting'],
  outreach: ['cold-email', 'sales', 'outbound', 'sequencing'],
  oss: ['open-source', 'free', 'self-hosted', 'github'],
  pr: ['pull-request', 'code-review', 'github'],
  tts: ['voice', 'speech', 'audio', 'phone'],
  stt: ['transcription', 'meeting', 'audio', 'speech'],
  scrape: ['scraper', 'scraping', 'crawl', 'crawler', 'browser'],
  scraper: ['scrape', 'scraping', 'crawl', 'crawler', 'browser'],
  scraping: ['scrape', 'scraper', 'crawl', 'crawler', 'browser'],
  'social-media': ['scraping', 'browser', 'automation', 'data-extraction', 'crawl'],
  docker: ['self-hosted', 'local', 'container'],
  paper: ['research', 'citations', 'academic', 'arxiv', 'literature'],
  papers: ['research', 'citations', 'academic', 'arxiv', 'literature'],
  scientific: ['research', 'academic', 'citations', 'arxiv', 'science'],
  literature: ['research', 'academic', 'citations', 'papers'],
  video: ['creative', 'ai-video', 'cinematic', 'text-to-video'],
  videos: ['creative', 'ai-video', 'cinematic', 'video'],
  image: ['creative', 'ai-image', 'photorealistic', 'image-generation'],
  images: ['creative', 'ai-image', 'photorealistic', 'image'],
  photorealistic: ['image', 'creative', 'visual', 'design'],
  creative: ['image', 'video', 'design', 'audio', 'art'],
  transcribing: ['transcription', 'meeting', 'notes', 'voice'],
  meetings: ['meeting', 'transcription', 'notes', 'zoom'],
  schedules: ['calendar', 'scheduling', 'productivity', 'time-blocking'],
};

/**
 * Maps intent keywords to their primary native AgentCategory for domain-specific ranking boosts
 */
const CATEGORY_AFFINITY: Record<string, AgentCategory[]> = {
  coding: ['coding'],
  fullstack: ['coding'],
  ide: ['coding'],
  'pull-request': ['coding'],
  'code-review': ['coding'],
  browser: ['autonomous'],
  scraping: ['autonomous'],
  scraper: ['autonomous'],
  'cold-email': ['sales'],
  outreach: ['sales'],
  sdr: ['sales'],
  b2b: ['sales'],
  voice: ['voice', 'productivity'],
  transcribing: ['productivity', 'voice'],
  meetings: ['productivity'],
  'bot-free': ['productivity'],
  calendar: ['productivity'],
  schedules: ['productivity'],
  focus: ['productivity'],
  research: ['research'],
  citations: ['research'],
  scientific: ['research'],
  literature: ['research'],
  workflow: ['workflow'],
  automation: ['workflow', 'autonomous'],
  image: ['creative'],
  images: ['creative'],
  video: ['creative'],
  videos: ['creative'],
  photorealistic: ['creative'],
  creative: ['creative'],
};

/**
 * Strips conversational fluff while preserving user keywords and normalizing compound intents.
 */
export function cleanSearchIntent(rawQuery: string): string {
  if (!rawQuery) return '';
  let cleaned = rawQuery.trim();
  // Strip leading natural language prefix
  cleaned = cleaned.replace(INTENT_PREFIX_REGEX, '');
  // Normalize compound phrases
  for (const [pattern, replacement] of COMPOUND_INTENTS) {
    cleaned = cleaned.replace(pattern, replacement);
  }
  // Normalize whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  return cleaned;
}

export interface ScoredAgent {
  agent: Agent;
  score: number;
  highlightReason: string | null;
}

export interface AgentSearchResult {
  results: Agent[];
  scored: ScoredAgent[];
  totalMatchesInCurrentFilter: number;
  totalMatchesAcrossAllCategories: number;
  categoryBreakdown: Record<string, number>;
  cleanedQuery: string;
}

/**
 * Advanced multi-signal semantic scoring algorithm:
 * - Preserves hyphenated compounds (e.g. "bot-free", "self-hosted", "open-source", "cold-email")
 * - Exact name matches receive top tier weighting (2500+ pts)
 * - Category affinity boost ensures domain-native tools rank above tangential tools
 * - Token overlap across tags, capabilities, taglines, and descriptions
 */
export function searchAgents(
  agents: Agent[],
  rawQuery: string,
  activeCategory: string = 'all'
): AgentSearchResult {
  const cleanedQuery = cleanSearchIntent(rawQuery);
  const normalizedRaw = cleanedQuery.toLowerCase().trim();

  // If query is empty, return unfiltered or category-filtered agents
  if (!normalizedRaw) {
    const filtered = activeCategory === 'all' 
      ? agents 
      : agents.filter((a) => a.category === activeCategory);

    return {
      results: filtered,
      scored: filtered.map((a) => ({ agent: a, score: 0, highlightReason: null })),
      totalMatchesInCurrentFilter: filtered.length,
      totalMatchesAcrossAllCategories: agents.length,
      categoryBreakdown: {},
      cleanedQuery: '',
    };
  }

  // Tokenize query words WITHOUT splitting hyphenated terms like "bot-free" or "self-hosted"
  const allTokens = normalizedRaw.split(/[\s,+/]+/).filter((t) => t.length > 0);
  const meaningfulTokens = allTokens.filter((t) => !STOP_WORDS.has(t));
  const queryTokens = meaningfulTokens.length > 0 ? meaningfulTokens : allTokens;

  const categoryBreakdown: Record<string, number> = {};
  const allScoredMatches: ScoredAgent[] = [];
  const filteredScoredMatches: ScoredAgent[] = [];

  for (const agent of agents) {
    let score = 0;
    let highlightReason: string | null = null;
    let matchedTokenCount = 0;
    let hasPrimaryFieldMatch = false;

    const agentNameLower = agent.name.toLowerCase();
    const agentTaglineLower = agent.tagline.toLowerCase();
    const agentCategoryLower = agent.category.toLowerCase();
    const agentCategoryLabelLower = agent.categoryLabel.toLowerCase();
    const agentDeveloperLower = agent.developer.toLowerCase();
    const agentModelLower = (agent.primaryModel || '').toLowerCase();
    const agentPricingLower = agent.pricingModel.toLowerCase();
    const agentTagsLower = agent.tags.map((t) => t.toLowerCase());
    const agentSummaryLower = (agent.editorialReview?.executiveSummary || '').toLowerCase();

    // 1. Exact Name Matches (Highest Weight)
    if (agentNameLower === normalizedRaw) {
      score += 2500;
      hasPrimaryFieldMatch = true;
      highlightReason = `Exact match for "${agent.name}"`;
    } else if (agentNameLower.startsWith(normalizedRaw)) {
      score += 1200;
      hasPrimaryFieldMatch = true;
      highlightReason = `Name starts with "${normalizedRaw}"`;
    } else if (agentNameLower.includes(normalizedRaw)) {
      score += 800;
      hasPrimaryFieldMatch = true;
      highlightReason = `Name contains "${normalizedRaw}"`;
    }

    // 2. Full Phrase in Tagline or Tags
    if (agentTaglineLower.includes(normalizedRaw)) {
      score += 500;
      hasPrimaryFieldMatch = true;
      if (!highlightReason) highlightReason = 'Matched tagline';
    }

    const exactMatchingTag = agent.tags.find((t) => t.toLowerCase() === normalizedRaw);
    if (exactMatchingTag) {
      score += 600;
      hasPrimaryFieldMatch = true;
      if (!highlightReason) highlightReason = `Matched tag: ${exactMatchingTag}`;
    }

    // 3. Category match
    if (agentCategoryLower === normalizedRaw || agentCategoryLabelLower === normalizedRaw) {
      score += 450;
      hasPrimaryFieldMatch = true;
      if (!highlightReason) highlightReason = `${agent.categoryLabel} category`;
    }

    // 4. Token-by-Token Match Verification (including token-level synonyms)
    for (const token of queryTokens) {
      let tokenMatched = false;
      const tokenVariants = [token, ...(SYNONYM_MAP[token] || [])];

      // Category affinity bonus if token strongly implies a category
      const preferredCategories = CATEGORY_AFFINITY[token];
      if (preferredCategories && preferredCategories.includes(agent.category)) {
        score += 220;
      }

      // Check direct token first
      if (agentNameLower.includes(token)) {
        score += 300;
        tokenMatched = true;
        hasPrimaryFieldMatch = true;
      }

      if (agentTaglineLower.includes(token)) {
        score += 150;
        tokenMatched = true;
        hasPrimaryFieldMatch = true;
      }

      if (agentCategoryLower.includes(token) || agentCategoryLabelLower.includes(token)) {
        score += 180;
        tokenMatched = true;
        hasPrimaryFieldMatch = true;
      }

      const matchedTag = agent.tags.find((t) => t.toLowerCase().includes(token));
      if (matchedTag) {
        score += 180;
        tokenMatched = true;
        hasPrimaryFieldMatch = true;
        if (!highlightReason) highlightReason = `Tag: ${matchedTag}`;
      }

      const matchedCap = (agent.editorialReview?.coreCapabilities || []).find((c) =>
        c.toLowerCase().includes(token)
      );
      if (matchedCap) {
        score += 90;
        tokenMatched = true;
        if (!highlightReason) highlightReason = `Capability: ${matchedCap.slice(0, 42)}...`;
      }

      if (agentModelLower.includes(token)) {
        score += 100;
        tokenMatched = true;
        hasPrimaryFieldMatch = true;
        if (!highlightReason) highlightReason = `Powered by ${agent.primaryModel}`;
      }

      if (agentDeveloperLower.includes(token)) {
        score += 90;
        tokenMatched = true;
        hasPrimaryFieldMatch = true;
      }

      if (
        agentPricingLower === token ||
        (token === 'open-source' && agentPricingLower === 'open-source') ||
        (token === 'free' && (agentPricingLower === 'free' || agentPricingLower === 'open-source'))
      ) {
        score += 150;
        tokenMatched = true;
        hasPrimaryFieldMatch = true;
      }

      // If direct token didn't match, check its domain synonyms in primary fields
      if (!tokenMatched && tokenVariants.length > 1) {
        for (const syn of tokenVariants.slice(1)) {
          const matchedSynTag = agent.tags.find((t) => t.toLowerCase().includes(syn));
          if (
            matchedSynTag ||
            agentTaglineLower.includes(syn) ||
            agentCategoryLower.includes(syn)
          ) {
            score += 90;
            tokenMatched = true;
            hasPrimaryFieldMatch = true;
            if (!highlightReason && matchedSynTag) {
              highlightReason = `Tag: ${matchedSynTag}`;
            }
            break;
          }
        }
      }

      // Secondary match in executive summary
      if (!tokenMatched && agentSummaryLower.includes(token)) {
        score += 20;
        tokenMatched = true;
      }

      if (tokenMatched) {
        matchedTokenCount++;
      }
    }

    // 5. Multi-token Precision Gate:
    // For 2+ token queries, require matching at least 2 tokens (or all tokens if 2),
    // UNLESS the agent matched a strong primary phrase or name.
    const requiredTokens = queryTokens.length >= 2 ? Math.min(2, queryTokens.length) : 1;

    if (matchedTokenCount < requiredTokens && score < 550) {
      score = 0;
    } else if (!hasPrimaryFieldMatch && score < 180) {
      score = 0;
    } else if (queryTokens.length > 1 && matchedTokenCount === queryTokens.length) {
      score += 500; // Full multi-token match bonus
    }

    // Qualify agent if it passes threshold
    if (score >= 120) {
      // Add small tie-breaker based on organic upvotes
      const upvoteTieBreaker = Math.min(agent.upvotesCount / 100, 30);
      score += upvoteTieBreaker;

      // Track distribution across all categories
      categoryBreakdown[agent.category] = (categoryBreakdown[agent.category] || 0) + 1;

      const scoredItem: ScoredAgent = {
        agent,
        score,
        highlightReason,
      };

      allScoredMatches.push(scoredItem);

      if (activeCategory === 'all' || agent.category === activeCategory) {
        filteredScoredMatches.push(scoredItem);
      }
    }
  }

  // Sort by highest score first
  filteredScoredMatches.sort((a, b) => b.score - a.score);
  allScoredMatches.sort((a, b) => b.score - a.score);

  return {
    results: filteredScoredMatches.map((s) => s.agent),
    scored: filteredScoredMatches,
    totalMatchesInCurrentFilter: filteredScoredMatches.length,
    totalMatchesAcrossAllCategories: allScoredMatches.length,
    categoryBreakdown,
    cleanedQuery,
  };
}
