import { MetadataRoute } from 'next';
import { getAllAgents, CATEGORIES } from '@/lib/data/agents';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://topagents.lol';
  const now = new Date();

  // Root & core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // Category routes
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((category) => ({
    url: `${baseUrl}/?category=${category.id}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  // All 100 AI Agent profile routes
  const agents = getAllAgents();
  const agentRoutes: MetadataRoute.Sitemap = agents.map((agent) => ({
    url: `${baseUrl}/agents/${agent.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  return [...staticRoutes, ...categoryRoutes, ...agentRoutes];
}
