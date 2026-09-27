import { MetadataRoute } from 'next';
import { CATEGORIES } from '@/lib/data/agents';
import { getAllCombinedAgents } from '@/lib/data/server-agents';

export const revalidate = 3600; // 1 hour ISR

/**
 * Dynamic XML Sitemap Generator for topagents.lol
 * Indexes homepage, first-class category landing pages, all 100+ agent profile teardowns,
 * machine-readable AI files (llms.txt, llms-full.txt, pricing.md), and submission portals.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://topagents.lol';
  const now = new Date();

  // Root & static utility routes
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
    {
      url: `${baseUrl}/advertise`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // Machine-readable AI agent context files (GEO / AEO)
  const machineReadableRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/llms.txt`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/llms-full.txt`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/pricing.md`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // First-class canonical category landing pages
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((category) => ({
    url: `${baseUrl}/category/${category.id}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  // All 100+ AI Agent technical teardowns + community-submitted agents
  const agents = await getAllCombinedAgents();
  const agentRoutes: MetadataRoute.Sitemap = agents.map((agent) => ({
    url: `${baseUrl}/agents/${agent.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  return [
    ...staticRoutes,
    ...machineReadableRoutes,
    ...categoryRoutes,
    ...agentRoutes,
  ];
}
