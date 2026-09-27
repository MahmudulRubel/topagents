import { MetadataRoute } from 'next';

/**
 * Robots.txt configuration optimized for traditional search crawlers and
 * AI / Answer Engine crawlers (GPTBot, PerplexityBot, ClaudeBot, Google-Extended, etc.)
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/admin/', '/admin/'],
      },
      // OpenAI ChatGPT search and citation bots
      {
        userAgent: ['GPTBot', 'ChatGPT-User'],
        allow: '/',
        disallow: ['/api/admin/', '/admin/'],
      },
      // Perplexity AI search and answer engine bot
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/api/admin/', '/admin/'],
      },
      // Anthropic Claude search and retrieval bots
      {
        userAgent: ['ClaudeBot', 'anthropic-ai'],
        allow: '/',
        disallow: ['/api/admin/', '/admin/'],
      },
      // Google Gemini and AI Overviews crawler
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/api/admin/', '/admin/'],
      },
      // Microsoft Copilot & Bing search bot
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/admin/', '/admin/'],
      },
      // Apple Intelligence crawler
      {
        userAgent: 'Applebot-Extended',
        allow: '/',
        disallow: ['/api/admin/', '/admin/'],
      },
      // Cohere AI citation bot
      {
        userAgent: 'cohere-ai',
        allow: '/',
        disallow: ['/api/admin/', '/admin/'],
      },
    ],
    sitemap: 'https://topagents.lol/sitemap.xml',
    host: 'https://topagents.lol',
  };
}
