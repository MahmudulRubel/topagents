import { Agent } from './types';
import { allAgents } from './agents';
import { getSubmissionBySlug, listSubmissions, submissionToAgent } from './submissions';

/**
 * Returns all agents including community submissions that have been auto-published or approved.
 * Server-only utility.
 */
export async function getAllCombinedAgents(): Promise<Agent[]> {
  try {
    const published = await listSubmissions('published');
    const submittedAgents = published.map(submissionToAgent);
    // Return submitted agents at top of the feed followed by the core 100
    return [...submittedAgents, ...allAgents];
  } catch (err) {
    console.error('Error fetching combined agents:', err);
    return allAgents;
  }
}

/**
 * Asynchronous lookup checking both the core 100 static agents and published community submissions.
 * Server-only utility.
 */
export async function getAgentBySlugAsync(slug: string): Promise<Agent | undefined> {
  const normalized = slug.toLowerCase().trim();
  const staticFound = allAgents.find((a) => a.slug === normalized || a.id === `agent-${normalized}`);
  if (staticFound) return staticFound;

  try {
    const submission = await getSubmissionBySlug(normalized);
    if (submission && submission.status === 'published') {
      return submissionToAgent(submission);
    }
  } catch (err) {
    console.error('Error fetching dynamic agent by slug:', err);
  }

  return undefined;
}
