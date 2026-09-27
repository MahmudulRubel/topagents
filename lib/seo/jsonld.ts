import { Agent } from '../data/types';

export function generateAgentJsonLd(agent: Agent) {
  const baseUrl = 'https://topagents.lol';
  const url = `${baseUrl}/agents/${agent.slug}`;

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
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'AI Agents Directory',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: agent.categoryLabel,
        item: `${baseUrl}/category/${agent.category}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: agent.name,
        item: url,
      },
    ],
  };

  return {
    softwareAppSchema,
    faqSchema,
    breadcrumbSchema,
  };
}
