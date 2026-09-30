import fs from 'fs/promises';
import path from 'path';
import { Agent, AgentCategory, CommunitySubmission, EditorialReview, PricingModel } from './types';

export interface AgentSubmissionRecord {
  id: string;
  slug: string;
  agentName: string;
  tagline: string;
  category: AgentCategory;
  pricingModel: PricingModel;
  websiteUrl: string;
  githubUrl?: string;
  logoUrl?: string;
  submitterHandle?: string;
  description?: string;
  status: 'published' | 'pending_review' | 'flagged' | 'rejected';
  source: 'deepseek-api' | 'fallback-engine' | 'manual';
  wordCount: number;
  editorialData: EditorialReview;
  upvotesCount?: number;
  createdAt: string;
  updatedAt: string;
}

const LOCAL_STORAGE_DIR = path.join(process.cwd(), 'data');
const LOCAL_STORAGE_FILE = path.join(LOCAL_STORAGE_DIR, 'submissions.json');

// InsForge credentials
const insforgeUrl = process.env.INSFORGE_API_URL || 'https://rw722vwb.us-east.insforge.app';
const insforgeKey = process.env.INSFORGE_API_KEY || 'ik_468b60bb957ee8c453fd36e38e976153';

/**
 * Native REST query to InsForge database (PostgREST API)
 */
async function queryInsForge(endpoint: string, options: RequestInit = {}): Promise<any | null> {
  if (!insforgeUrl || !insforgeKey || insforgeKey === 'demo_key') return null;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const res = await fetch(`${insforgeUrl}/rest/v1/${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        apikey: insforgeKey,
        Authorization: `Bearer ${insforgeKey}`,
        Prefer: 'return=representation',
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return null;
    }
    return await res.json();
  } catch (err) {
    return null;
  }
}

/**
 * Ensures the local storage directory and JSON file exist.
 */
async function ensureLocalFile(): Promise<void> {
  try {
    await fs.mkdir(LOCAL_STORAGE_DIR, { recursive: true });
    try {
      await fs.access(LOCAL_STORAGE_FILE);
    } catch {
      await fs.writeFile(LOCAL_STORAGE_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('[Submissions Storage] Failed to ensure local storage file:', err);
  }
}

/**
 * Reads all records from local JSON storage.
 */
async function readLocalSubmissions(): Promise<AgentSubmissionRecord[]> {
  try {
    await ensureLocalFile();
    const data = await fs.readFile(LOCAL_STORAGE_FILE, 'utf-8');
    return JSON.parse(data) || [];
  } catch (err) {
    console.error('[Submissions Storage] Error reading local submissions:', err);
    return [];
  }
}

/**
 * Writes records to local JSON storage.
 */
async function writeLocalSubmissions(records: AgentSubmissionRecord[]): Promise<void> {
  try {
    await ensureLocalFile();
    await fs.writeFile(LOCAL_STORAGE_FILE, JSON.stringify(records, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Submissions Storage] Error writing local submissions:', err);
  }
}

/**
 * Converts a submission database record into the full directory `Agent` shape.
 */
export function submissionToAgent(sub: AgentSubmissionRecord): Agent {
  const categoryLabels: Record<AgentCategory, string> = {
    coding: 'Coding & Dev',
    autonomous: 'Autonomous & Computer Use',
    frameworks: 'Multi-Agent Frameworks',
    voice: 'Voice & Multimodal',
    support: 'Customer Support',
    sales: 'Sales & SDR',
    research: 'Research & Deep Reasoning',
    productivity: 'Productivity & Search',
    workflow: 'Enterprise Workflow',
    creative: 'Creative & Media',
  };

  const pricingLabels: Record<PricingModel, string> = {
    free: 'Free',
    freemium: 'Freemium',
    paid: 'Paid',
    'open-source': 'Open Source',
  };

  return {
    id: sub.id,
    slug: sub.slug,
    name: sub.agentName,
    tagline: sub.tagline,
    category: sub.category,
    categoryLabel: categoryLabels[sub.category] || 'Autonomous Agent',
    pricingModel: sub.pricingModel,
    pricingLabel: pricingLabels[sub.pricingModel] || 'Freemium',
    websiteUrl: sub.websiteUrl,
    githubUrl: sub.githubUrl,
    developer: sub.submitterHandle ? `@${sub.submitterHandle}` : 'Community Contributor',
    releaseYear: new Date(sub.createdAt).getFullYear() || 2026,
    primaryModel: 'Custom / Multi-Model',
    license: sub.pricingModel === 'open-source' ? 'Apache-2.0 / MIT' : 'Proprietary',
    upvotesCount: sub.upvotesCount || 1,
    overallRating: 4.8,
    reviewsCount: 1,
    launchRank: 999,
    featured: false,
    trending: true,
    tags: [sub.category, sub.pricingModel, 'community-launch'],
    monogram: sub.agentName.substring(0, 2).toUpperCase(),
    avatarBg: 'bg-emerald-500',
    logoUrl: sub.logoUrl,
    editorialReview: sub.editorialData,
  };
}

/**
 * Saves a new or updated submission record.
 */
export async function saveSubmission(record: AgentSubmissionRecord): Promise<AgentSubmissionRecord> {
  const timestamp = new Date().toISOString();
  record.updatedAt = timestamp;
  if (!record.createdAt) record.createdAt = timestamp;

  // 1. Always write to resilient local storage first
  const local = await readLocalSubmissions();
  const idx = local.findIndex((s) => s.id === record.id);
  if (idx >= 0) {
    local[idx] = record;
  } else {
    local.unshift(record);
  }
  await writeLocalSubmissions(local);

  // 2. Try InsForge DB sync in background/parallel
  const dbPayload = {
    id: record.id,
    slug: record.slug,
    agent_name: record.agentName,
    tagline: record.tagline,
    category: record.category,
    pricing_model: record.pricingModel,
    website_url: record.websiteUrl,
    github_url: record.githubUrl || null,
    submitter_handle: record.submitterHandle || null,
    description: record.description || null,
    status: record.status,
    source: record.source,
    word_count: record.wordCount,
    editorial_data: record.editorialData,
    created_at: record.createdAt,
    updated_at: record.updatedAt,
  };

  await queryInsForge('agent_submissions', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates' },
    body: JSON.stringify(dbPayload),
  });

  return record;
}

/**
 * Retrieves a submission by ID.
 */
export async function getSubmissionById(id: string): Promise<AgentSubmissionRecord | null> {
  const local = await readLocalSubmissions();
  const found = local.find((s) => s.id === id);
  if (found) return found;

  const data = await queryInsForge(`agent_submissions?id=eq.${encodeURIComponent(id)}&select=*`);
  if (Array.isArray(data) && data.length > 0) {
    const row = data[0];
    return {
      id: row.id,
      slug: row.slug,
      agentName: row.agent_name,
      tagline: row.tagline,
      category: row.category,
      pricingModel: row.pricing_model,
      websiteUrl: row.website_url,
      githubUrl: row.github_url,
      submitterHandle: row.submitter_handle,
      description: row.description,
      status: row.status,
      source: row.source,
      wordCount: row.word_count,
      editorialData: row.editorial_data,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  return null;
}

/**
 * Retrieves a submission by its unique slug.
 */
export async function getSubmissionBySlug(slug: string): Promise<AgentSubmissionRecord | null> {
  const local = await readLocalSubmissions();
  const found = local.find((s) => s.slug === slug);
  if (found) return found;

  const data = await queryInsForge(`agent_submissions?slug=eq.${encodeURIComponent(slug)}&select=*`);
  if (Array.isArray(data) && data.length > 0) {
    const row = data[0];
    return {
      id: row.id,
      slug: row.slug,
      agentName: row.agent_name,
      tagline: row.tagline,
      category: row.category,
      pricingModel: row.pricing_model,
      websiteUrl: row.website_url,
      githubUrl: row.github_url,
      submitterHandle: row.submitter_handle,
      description: row.description,
      status: row.status,
      source: row.source,
      wordCount: row.word_count,
      editorialData: row.editorial_data,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  return null;
}

/**
 * Lists submissions, optionally filtered by status ('published', 'pending_review', 'flagged', 'rejected', or 'all').
 */
export async function listSubmissions(statusFilter?: string): Promise<AgentSubmissionRecord[]> {
  const local = await readLocalSubmissions();

  if (!statusFilter || statusFilter === 'all') {
    return local;
  }

  return local.filter((s) => s.status === statusFilter);
}

/**
 * Updates a submission record by ID.
 */
export async function updateSubmission(
  id: string,
  updates: Partial<AgentSubmissionRecord>
): Promise<AgentSubmissionRecord | null> {
  const record = await getSubmissionById(id);
  if (!record) return null;

  const merged: AgentSubmissionRecord = {
    ...record,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return await saveSubmission(merged);
}

/**
 * Deletes a submission by ID.
 */
export async function deleteSubmission(id: string): Promise<boolean> {
  const local = await readLocalSubmissions();
  const filtered = local.filter((s) => s.id !== id);
  await writeLocalSubmissions(filtered);

  await queryInsForge(`agent_submissions?id=eq.${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });

  return true;
}
