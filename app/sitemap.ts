import { MetadataRoute } from 'next';
import { CATEGORIES } from '@/lib/data/agents';
import { getAllCombinedAgents } from '@/lib/data/server-agents';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  // All core AI Agents + auto-published community submitted agents
  const agents = await getAllCombinedAgents();
  const agentRoutes: MetadataRoute.Sitemap = agents.map((agent) => ({
    url: `${baseUrl}/agents/${agent.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  return [...staticRoutes, ...categoryRoutes, ...agentRoutes];
}
