import { Agent, AgentCategory } from '../types';
import { codingAgents } from './coding-agents';
import { browserAutonomousAgents } from './browser-autonomous';
import { multiAgentFrameworks } from './multi-agent';
import { voiceAgents } from './voice-agents';
import { supportAgents } from './support-agents';
import { salesAgents } from './sales-agents';
import { researchAgents } from './research-agents';
import { productivityAgents } from './productivity-agents';
import { workflowAgents } from './workflow-agents';

// Combine all 100 verified AI agents across the 9 primary categories
export const allAgents: Agent[] = [
  ...codingAgents,            // 20
  ...browserAutonomousAgents, // 12
  ...multiAgentFrameworks,    // 12
  ...voiceAgents,             // 10
  ...supportAgents,           // 10
  ...salesAgents,             // 10
  ...researchAgents,          // 10
  ...productivityAgents,      // 8
  ...workflowAgents,          // 8
];

export function getAllAgents(): Agent[] {
  return allAgents;
}

export function getAgentBySlug(slug: string): Agent | undefined {
  const normalized = slug.toLowerCase().trim();
  return allAgents.find((a) => a.slug === normalized || a.id === `agent-${normalized}`);
}

export function getAgentsByCategory(category: AgentCategory): Agent[] {
  return allAgents.filter((a) => a.category === category);
}

export function getFeaturedAgent(): Agent {
  return allAgents.find((a) => a.featured) || allAgents[0];
}

export function getTrendingAgents(limit = 10): Agent[] {
  return [...allAgents]
    .sort((a, b) => b.upvotesCount - a.upvotesCount)
    .slice(0, limit);
}

export function searchAgents(query: string): Agent[] {
  if (!query || query.trim() === '') return allAgents;
  const q = query.toLowerCase().trim();
  return allAgents.filter(
    (a) =>
      a.name.toLowerCase().includes(q) ||
      a.tagline.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.categoryLabel.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q)) ||
      a.developer.toLowerCase().includes(q)
  );
}

export interface CategoryItem {
  id: AgentCategory;
  label: string;
  icon: string;
}

export const CATEGORIES: CategoryItem[] = [
  { id: 'coding', label: 'Coding & Dev', icon: '💻' },
  { id: 'autonomous', label: 'Autonomous & Browser', icon: '🌐' },
  { id: 'frameworks', label: 'Multi-Agent Frameworks', icon: '🧩' },
  { id: 'voice', label: 'Voice & Telephony', icon: '🎙️' },
  { id: 'support', label: 'Customer Support', icon: '🎧' },
  { id: 'sales', label: 'Sales & SDR', icon: '📈' },
  { id: 'research', label: 'Research & Search', icon: '🔬' },
  { id: 'productivity', label: 'Productivity & Meetings', icon: '⚡' },
  { id: 'workflow', label: 'Workflow & Automation', icon: '⚙️' },
];

export const CATEGORIES_CONFIG: { id: AgentCategory | 'all'; label: string; count: number }[] = [
  { id: 'all', label: 'All Agents', count: allAgents.length },
  { id: 'coding', label: 'Coding & Dev', count: codingAgents.length },
  { id: 'autonomous', label: 'Autonomous & Browser', count: browserAutonomousAgents.length },
  { id: 'frameworks', label: 'Multi-Agent Frameworks', count: multiAgentFrameworks.length },
  { id: 'voice', label: 'Voice & Phone', count: voiceAgents.length },
  { id: 'support', label: 'Customer Support', count: supportAgents.length },
  { id: 'sales', label: 'Sales & SDR', count: salesAgents.length },
  { id: 'research', label: 'Research & Search', count: researchAgents.length },
  { id: 'productivity', label: 'Meeting & Productivity', count: productivityAgents.length },
  { id: 'workflow', label: 'Workflow & Automation', count: workflowAgents.length },
];

