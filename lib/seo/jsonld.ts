import { Agent } from '../data/types';
import { CategoryItem } from '../data/agents';

const BASE_URL = 'https://topagents.lol';

/**
 * Generates comprehensive Schema.org JSON-LD structured data for an individual agent profile.
 * Emits SoftwareApplication, Review, FAQPage, and BreadcrumbList schemas.
 */
export function generateAgentJsonLd(agent: Agent) {
  const url = `${BASE_URL}/agents/${agent.slug}`;

  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: agent.name,
    description: agent.tagline,
    applicationCategory: agent.categoryLabel,
    operatingSystem: 'Cloud, Web, Linux, macOS, Windows',
    url: url,
    offers: {
      '@type': 'Offer',
      price: agent.pricingModel === 'free' || agent.pricingModel === 'open-source' ? '0' : '20.00',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    author: {
      '@type': 'Organization',
      name: agent.developer,
      url: agent.websiteUrl,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: agent.overallRating.toFixed(1),
      ratingCount: agent.reviewsCount,
      bestRating: '5',
      worstRating: '1',
    },
    featureList: agent.editorialReview.coreCapabilities.slice(0, 8),
  };

  const reviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    name: `${agent.name} Technical Architecture & Benchmark Systems Review`,
    itemReviewed: {
      '@type': 'SoftwareApplication',
      name: agent.name,
      applicationCategory: agent.categoryLabel,
      operatingSystem: 'Cloud, Web, Linux, macOS, Windows',
      url: url,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: agent.overallRating.toFixed(1),
      bestRating: '5',
      worstRating: '1',
    },
    author: {
      '@type': 'Organization',
      name: 'TopAgents Systems Review Board',
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'topagents.lol',
      url: BASE_URL,
    },
    datePublished: new Date(agent.releaseYear, 0, 1).toISOString(),
    dateModified: new Date().toISOString(),
    reviewBody: agent.editorialReview.executiveSummary.replace(/[#*`_]/g, '').slice(0, 300) + '...',
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: agent.editorialReview.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: agent.categoryLabel,
        item: `${BASE_URL}/category/${agent.category}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: agent.name,
        item: url,
      },
    ],
  };

  return {
    softwareAppSchema,
    reviewSchema,
    faqSchema,
    breadcrumbSchema,
  };
}

/**
 * Generates Schema.org structured data for the Homepage.
 * Emits WebSite (with Sitelinks SearchAction), Organization, ItemList (Top 10 leaderboard), and FAQPage.
 */
export function generateHomeJsonLd(topAgents: Agent[], faqs: { question: string; answer: string }[]) {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'topagents.lol',
    alternateName: 'TopAgents AI Directory',
    url: BASE_URL,
    description:
      'Product Hunt-styled directory and technical evaluation platform for the world’s top 100 autonomous AI agents with verified SWE-bench benchmarks.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'topagents.lol',
    url: BASE_URL,
    logo: `${BASE_URL}/favicon.ico`,
    description:
      'The leading directory and technical benchmark board cataloging autonomous AI agents, multi-agent frameworks, and developer tools.',
    sameAs: ['https://x.com/topagents_lol', 'https://github.com/MahmudulRubel/topagents'],
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Top 10 Autonomous AI Agents Leaderboard',
    description: 'The highest-ranked autonomous AI agents based on community upvotes and technical benchmarks.',
    itemListElement: topAgents.slice(0, 10).map((agent, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: agent.name,
        url: `${BASE_URL}/agents/${agent.slug}`,
        applicationCategory: agent.categoryLabel,
        description: agent.tagline,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: agent.overallRating.toFixed(1),
          ratingCount: agent.reviewsCount,
        },
      },
    })),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return {
    websiteSchema,
    orgSchema,
    itemListSchema,
    faqSchema,
  };
}

/**
 * Generates Schema.org structured data for a Category landing page.
 * Emits CollectionPage, ItemList, BreadcrumbList, and FAQPage.
 */
export function generateCategoryJsonLd(
  category: CategoryItem,
  agents: Agent[],
  faqs: { question: string; answer: string }[]
) {
  const categoryUrl = `${BASE_URL}/category/${category.id}`;

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Top ${category.label} AI Agents (2026 Rankings)`,
    description: `Compare and evaluate the leading ${category.label} autonomous AI agents with verified SWE-bench benchmarks, architecture breakdowns, and upvotes.`,
    url: categoryUrl,
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Top ${category.label} AI Agents`,
    description: `Rankings of all verified ${category.label} agents cataloged on topagents.lol.`,
    itemListElement: agents.map((agent, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: agent.name,
        url: `${BASE_URL}/agents/${agent.slug}`,
        applicationCategory: agent.categoryLabel,
        description: agent.tagline,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: agent.overallRating.toFixed(1),
          ratingCount: agent.reviewsCount,
        },
      },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: `${category.label} Agents`,
        item: categoryUrl,
      },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return {
    collectionSchema,
    itemListSchema,
    breadcrumbSchema,
    faqSchema,
  };
}
