import { createClient } from '@insforge/sdk';
import {
  AgentPublic,
  AgentInternal,
  Category,
  ClaimPayload,
  SiteStats,
  OutbidEvent,
  AgentTier,
  AgentComment,
  PointActionPayload,
} from './types';

// Global stores for dev persistence
declare global {
  var __agentsStore: AgentInternal[] | undefined;
  var __commentsStore: AgentComment[] | undefined;
  var __outbidEventsStore: OutbidEvent[] | undefined;
  var __trackedVisitorsCount: number | undefined;
  var __activeSessionTimestamps: number[] | undefined;
}

// Initial seed data with rich points engagement for instant top-tier leaderboard experience
const INITIAL_SEED_AGENTS: AgentInternal[] = [
  {
    id: 'agent-1',
    agent_name: 'Devin AI Pro',
    tagline: 'Autonomous AI software engineer that plans, writes, and deploys full-stack apps.',
    url: 'https://devin.ai',
    category: 'coding',
    logo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop',
    claimed_by_handle: 'cognition_labs',
    claimed_by_email: 'builder@cognition.ai',
    amount_cents: 5000,
    clicks: 1420,
    points_total: 125800,
    likes_count: 342,
    comments_count: 89,
    shares_count: 156,
    tier_badge: 'diamond',
    claimed_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    payment_status: 'completed',
    creem_checkout_id: null,
    rank: 1,
  },
  {
    id: 'agent-2',
    agent_name: 'Superpowers Agent',
    tagline: 'Agentic framework with TDD, systematic debugging, and parallel agent orchestration.',
    url: 'https://github.com/superpowers/agent',
    category: 'coding',
    logo_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&h=100&fit=crop',
    claimed_by_handle: 'deepmind_fan',
    claimed_by_email: 'dev@superpowers.ai',
    amount_cents: 3500,
    clicks: 980,
    points_total: 84200,
    likes_count: 215,
    comments_count: 48,
    shares_count: 92,
    tier_badge: 'gold',
    claimed_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    payment_status: 'completed',
    creem_checkout_id: null,
    rank: 2,
  },
  {
    id: 'agent-3',
    agent_name: 'VoiceFlow Builder',
    tagline: 'Ultra-low latency conversational AI voice agent engine for customer support.',
    url: 'https://voiceflow.com',
    category: 'voice',
    logo_url: 'https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=100&h=100&fit=crop',
    claimed_by_handle: 'voice_master',
    claimed_by_email: 'team@voiceflow.com',
    amount_cents: 2000,
    clicks: 650,
    points_total: 42100,
    likes_count: 140,
    comments_count: 31,
    shares_count: 54,
    tier_badge: 'gold',
    claimed_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    payment_status: 'completed',
    creem_checkout_id: null,
    rank: 3,
  },
  {
    id: 'agent-4',
    agent_name: 'Browser Navigator X',
    tagline: 'Autonomous headless web agent that extracts structured data and completes forms.',
    url: 'https://browser-use.com',
    category: 'browser',
    logo_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop',
    claimed_by_handle: 'web_automator',
    claimed_by_email: 'hello@browser-use.com',
    amount_cents: 1500,
    clicks: 430,
    points_total: 18500,
    likes_count: 88,
    comments_count: 19,
    shares_count: 35,
    tier_badge: 'silver',
    claimed_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    payment_status: 'completed',
    creem_checkout_id: null,
    rank: 4,
  },
  {
    id: 'agent-5',
    agent_name: 'Deep Research Bot',
    tagline: 'Multi-step research agent that synthesizes 100+ academic papers into markdown reports.',
    url: 'https://deepresearch.ai',
    category: 'research',
    logo_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&h=100&fit=crop',
    claimed_by_handle: 'scholar_ai',
    claimed_by_email: 'contact@deepresearch.ai',
    amount_cents: 1000,
    clicks: 290,
    points_total: 4800,
    likes_count: 42,
    comments_count: 8,
    shares_count: 12,
    tier_badge: 'bronze',
    claimed_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    payment_status: 'completed',
    creem_checkout_id: null,
    rank: 5,
  },
];

const INITIAL_COMMENTS: AgentComment[] = [
  {
    id: 'comment-1',
    agent_id: 'agent-1',
    user_name: 'Alex Developer',
    content: 'Devin generated a full Next.js dashboard for us in under 10 minutes. Absolute game changer!',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'comment-2',
    agent_id: 'agent-1',
    user_name: 'Sarah AI Researcher',
    content: 'Super impressive planning capabilities and autonomous error recovery.',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'comment-3',
    agent_id: 'agent-2',
    user_name: 'Marcus Builder',
    content: 'The TDD workflow loop in Superpowers is insane. Best agentic framework out right now.',
    created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
];

const agentsStore: AgentInternal[] = globalThis.__agentsStore || (globalThis.__agentsStore = INITIAL_SEED_AGENTS);
const commentsStore: AgentComment[] = globalThis.__commentsStore || (globalThis.__commentsStore = INITIAL_COMMENTS);
const outbidEventsStore: OutbidEvent[] = globalThis.__outbidEventsStore || (globalThis.__outbidEventsStore = []);

let trackedVisitorsCount = globalThis.__trackedVisitorsCount || (globalThis.__trackedVisitorsCount = 1250);
const activeSessionTimestamps: number[] = globalThis.__activeSessionTimestamps || (globalThis.__activeSessionTimestamps = []);

// Initialize InsForge client if environment variables are configured
const insforgeUrl = process.env.INSFORGE_API_URL;
const insforgeKey = process.env.INSFORGE_API_KEY;

const insforge = (insforgeUrl && insforgeKey && insforgeKey !== 'demo_key')
  ? createClient({
      baseUrl: insforgeUrl,
      anonKey: insforgeKey,
    })
  : null;

/**
 * Calculate Tier Badge based on total points.
 * - 100,000+ -> Diamond
 * - 25,000+ -> Gold
 * - 5,000+ -> Silver
 * - < 5,000 -> Bronze
 */
export function calculateTier(points: number): AgentTier {
  if (points >= 100000) return 'diamond';
  if (points >= 25000) return 'gold';
  if (points >= 5000) return 'silver';
  return 'bronze';
}

/**
 * Sanitize internal agent to AgentPublic.
 * CRITICAL INVARIANT #1: claimed_by_email is STRICTLY EXCLUDED.
 */
function sanitizeAgentPublic(agent: AgentInternal, rank: number): AgentPublic {
  const points = agent.points_total || 0;
  return {
    id: agent.id,
    agent_name: agent.agent_name,
    tagline: agent.tagline,
    url: agent.url,
    category: agent.category,
    logo_url: agent.logo_url || null,
    claimed_by_handle: agent.claimed_by_handle || null,
    amount_cents: agent.amount_cents,
    clicks: agent.clicks || 0,
    points_total: points,
    likes_count: agent.likes_count || 0,
    comments_count: agent.comments_count || 0,
    shares_count: agent.shares_count || 0,
    tier_badge: calculateTier(points),
    claimed_at: agent.claimed_at,
    created_at: agent.created_at,
    rank,
  };
}

/**
 * Fetch public leaderboard.
 * CRITICAL INVARIANT #1: claimed_by_email is STRICTLY EXCLUDED.
 * CRITICAL INVARIANT #2: Dynamic Rank is computed by sorting points_total DESC (or amount_cents DESC if sortBy = 'bids').
 */
export async function getPublicLeaderboard(
  category?: Category,
  sortBy: 'points' | 'bids' = 'points'
): Promise<AgentPublic[]> {
  if (insforge) {
    try {
      const orderColumn = sortBy === 'bids' ? 'amount_cents' : 'points_total';
      let query = insforge.database
        .from('agents')
        .select('*')
        .eq('payment_status', 'completed')
        .order(orderColumn, { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (!error && Array.isArray(data) && data.length > 0) {
        return (data as AgentInternal[]).map((agent, index) =>
          sanitizeAgentPublic(agent, index + 1)
        );
      }
    } catch (err) {
      console.warn('InsForge database query note:', err);
    }
  }

  // Fallback in-memory store
  let filtered = agentsStore.filter((a) => a.payment_status === 'completed');
  if (category) {
    filtered = filtered.filter((a) => a.category === category);
  }

  // Dynamic sorting by points_total DESC (default) or amount_cents DESC
  if (sortBy === 'bids') {
    filtered.sort((a, b) => b.amount_cents - a.amount_cents);
  } else {
    filtered.sort((a, b) => (b.points_total || 0) - (a.points_total || 0));
  }

  return filtered.map((agent, index) => sanitizeAgentPublic(agent, index + 1));
}

// IP View Deduplication Cache for Anti-Cheat (Key: `${ip}:${agent_id}`, Value: timestamp)
const ipViewCache = new Map<string, number>();

/**
 * Record a Gamified Point Action (Heartbeat, Share, Like, Comment, Click, View).
 * Includes Server-Side IP Anti-Cheat Deduplication (1 view pulse per 5s per IP per agent).
 */
export async function recordPointAction(
  payload: PointActionPayload,
  clientIp: string = '127.0.0.1'
): Promise<{
  success: boolean;
  pointsAwarded: number;
  newTotalPoints?: number;
  message?: string;
}> {
  const { action, agent_id, platform, comment_text, user_name } = payload;
  let pointsAwarded = 0;

  // Strict IP Anti-Cheat Check for Product View Pulses
  if (action === 'view' && agent_id) {
    const cacheKey = `${clientIp}:${agent_id}`;
    const now = Date.now();
    const lastView = ipViewCache.get(cacheKey) || 0;

    // Reject if same IP viewed this agent less than 5 seconds ago
    if (now - lastView < 5000) {
      return {
        success: false,
        pointsAwarded: 0,
        message: 'IP anti-cheat: View rate limit exceeded (1 access per 5s allowed per IP)',
      };
    }

    ipViewCache.set(cacheKey, now);
    pointsAwarded = 1; // +1 Point per valid viewport view
  } else {
    switch (action) {
      case 'heartbeat':
        pointsAwarded = payload.seconds ? Math.min(payload.seconds, 60) : 1;
        break;
      case 'share':
        pointsAwarded = 500;
        break;
      case 'click':
        pointsAwarded = 500;
        break;
      case 'comment':
        pointsAwarded = 200;
        break;
      case 'like':
        pointsAwarded = 100;
        break;
      default:
        pointsAwarded = 0;
    }
  }

  if (agent_id) {
    const agent = agentsStore.find((a) => a.id === agent_id);
    if (agent) {
      agent.points_total = (agent.points_total || 0) + pointsAwarded;

      if (action === 'like') {
        agent.likes_count = (agent.likes_count || 0) + 1;
      } else if (action === 'share') {
        agent.shares_count = (agent.shares_count || 0) + 1;
      } else if (action === 'click') {
        agent.clicks = (agent.clicks || 0) + 1;
      } else if (action === 'comment' && comment_text) {
        agent.comments_count = (agent.comments_count || 0) + 1;
        commentsStore.unshift({
          id: `comment-${Date.now()}`,
          agent_id,
          user_name: user_name || 'Anonymous Creator',
          content: comment_text,
          created_at: new Date().toISOString(),
        });
      }

      agent.tier_badge = calculateTier(agent.points_total);

      if (insforge) {
        try {
          await insforge.database
            .from('agents')
            .update({
              points_total: agent.points_total,
              likes_count: agent.likes_count,
              shares_count: agent.shares_count,
              comments_count: agent.comments_count,
              clicks: agent.clicks,
            })
            .eq('id', agent_id);
        } catch (err) {
          console.warn('InsForge point update note:', err);
        }
      }

      return {
        success: true,
        pointsAwarded,
        newTotalPoints: agent.points_total,
        message: `Awarded +${pointsAwarded} points to ${agent.agent_name}!`,
      };
    }
  }

  return {
    success: true,
    pointsAwarded,
    message: `Awarded +${pointsAwarded} active time points!`,
  };
}

/**
 * Get comments for a specific agent.
 */
export async function getAgentComments(agentId: string): Promise<AgentComment[]> {
  if (insforge) {
    try {
      const { data } = await insforge.database
        .from('agent_comments')
        .select('*')
        .eq('agent_id', agentId)
        .order('created_at', { ascending: false });

      if (Array.isArray(data) && data.length > 0) {
        return data as AgentComment[];
      }
    } catch (err) {
      console.warn('InsForge comments query note:', err);
    }
  }

  return commentsStore.filter((c) => c.agent_id === agentId);
}

/**
 * Create a new free agent record (0 payment required, instant completion with +1,000 bonus points).
 */
export async function createFreeAgent(
  payload: Omit<ClaimPayload, 'amount_cents'> & { amount_cents?: number }
): Promise<AgentInternal> {
  const newAgent: AgentInternal = {
    id: `agent-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    agent_name: payload.agent_name,
    tagline: payload.tagline,
    url: payload.url,
    category: payload.category,
    logo_url: payload.logo_url || null,
    claimed_by_handle: payload.claimed_by_handle || null,
    claimed_by_email: payload.claimed_by_email,
    amount_cents: 0,
    clicks: 0,
    points_total: 1000, // +1,000 Starting Bonus Points
    likes_count: 0,
    comments_count: 0,
    shares_count: 0,
    tier_badge: 'bronze',
    claimed_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    payment_status: 'completed',
    creem_checkout_id: null,
    polar_checkout_id: null,
    rank: agentsStore.length + 1,
  };

  if (insforge) {
    try {
      await insforge.database.from('agents').insert([
        {
          agent_name: newAgent.agent_name,
          tagline: newAgent.tagline,
          url: newAgent.url,
          category: newAgent.category,
          logo_url: newAgent.logo_url,
          claimed_by_handle: newAgent.claimed_by_handle,
          claimed_by_email: newAgent.claimed_by_email,
          amount_cents: 0,
          points_total: newAgent.points_total,
          payment_status: 'completed',
        },
      ]);
    } catch (err) {
      console.warn('InsForge agent insert note:', err);
    }
  }

  agentsStore.push(newAgent);

  outbidEventsStore.unshift({
    id: `evt-${Date.now()}`,
    agent_name: newAgent.agent_name,
    amount_cents: 0,
    rank: 1,
    timestamp: new Date().toISOString(),
    points_awarded: 1000,
  });

  return newAgent;
}

/**
 * Get current minimum bid required to claim a target rank.
 * Server-Side Bid Check invariant: Minimum $1.00 (100 cents) or target rank bid + $1.00 (100 cents).
 */
export async function getMinBidForRank(targetRank: number = 1): Promise<number> {
  const leaderboard = await getPublicLeaderboard(undefined, 'bids');
  if (leaderboard.length === 0 || targetRank > leaderboard.length) {
    return 100; // $1.00 base min
  }

  const targetAgent = leaderboard[targetRank - 1];
  if (!targetAgent) {
    return 100;
  }

  // Must exceed target rank by at least +$1.00 (100 cents)
  return targetAgent.amount_cents + 100;
}

/**
 * Create a new pending agent record before checkout.
 */
export async function createPendingAgent(
  payload: ClaimPayload,
  checkoutId: string
): Promise<AgentInternal> {
  const newAgent: AgentInternal = {
    id: `agent-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    agent_name: payload.agent_name,
    tagline: payload.tagline,
    url: payload.url,
    category: payload.category,
    logo_url: payload.logo_url || null,
    claimed_by_handle: payload.claimed_by_handle || null,
    claimed_by_email: payload.claimed_by_email,
    amount_cents: payload.amount_cents,
    clicks: 0,
    points_total: 1000, // Base starting points bonus for claiming
    likes_count: 0,
    comments_count: 0,
    shares_count: 0,
    tier_badge: 'bronze',
    claimed_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    payment_status: 'pending',
    creem_checkout_id: checkoutId,
    polar_checkout_id: checkoutId,
    rank: 0,
  };

  if (insforge) {
    try {
      await insforge.database.from('agents').insert([
        {
          agent_name: newAgent.agent_name,
          tagline: newAgent.tagline,
          url: newAgent.url,
          category: newAgent.category,
          logo_url: newAgent.logo_url,
          claimed_by_handle: newAgent.claimed_by_handle,
          claimed_by_email: newAgent.claimed_by_email,
          amount_cents: newAgent.amount_cents,
          points_total: newAgent.points_total,
          payment_status: 'pending',
          creem_checkout_id: checkoutId,
          polar_checkout_id: checkoutId,
        },
      ]);
    } catch (err) {
      console.warn('InsForge agent insert note:', err);
    }
  }

  agentsStore.push(newAgent);
  return newAgent;
}

/**
 * Reconcile payment from Polar or Creem webhook or checkout completion.
 */
export async function completeAgentPayment(checkoutId: string): Promise<boolean> {
  const now = new Date().toISOString();
  let paidAgentName = '';
  let paidAmount = 0;

  const agentIndex = agentsStore.findIndex(
    (a) => a.polar_checkout_id === checkoutId || a.creem_checkout_id === checkoutId
  );
  if (agentIndex !== -1) {
    agentsStore[agentIndex].payment_status = 'completed';
    agentsStore[agentIndex].claimed_at = now;
    paidAgentName = agentsStore[agentIndex].agent_name;
    paidAmount = agentsStore[agentIndex].amount_cents;
  }

  if (insforge) {
    try {
      const { data } = await insforge.database
        .from('agents')
        .update({ payment_status: 'completed', claimed_at: now })
        .or(`polar_checkout_id.eq.${checkoutId},creem_checkout_id.eq.${checkoutId}`)
        .select('*');

      if (Array.isArray(data) && data.length > 0) {
        paidAgentName = data[0].agent_name;
        paidAmount = data[0].amount_cents;

        await insforge.database.from('bid_history').insert([
          {
            agent_id: data[0].id,
            agent_name: data[0].agent_name,
            amount_cents: data[0].amount_cents,
            action: 'claimed',
          },
        ]);
      }
    } catch (err) {
      console.warn('InsForge payment completion note:', err);
    }
  }

  if (paidAgentName && paidAmount > 0) {
    outbidEventsStore.unshift({
      id: `evt-${Date.now()}`,
      agent_name: paidAgentName,
      amount_cents: paidAmount,
      rank: 1,
      timestamp: now,
    });
  }

  return true;
}

/**
 * Increment click counter for outbound agent link and award +500 points.
 */
export async function recordClick(agentId: string): Promise<boolean> {
  await recordPointAction({ action: 'click', agent_id: agentId });
  return true;
}

/**
 * Get recent outbid/claim activity log.
 */
export async function getRecentOutbids(): Promise<OutbidEvent[]> {
  if (insforge) {
    try {
      const { data, error } = await insforge.database
        .from('bid_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && Array.isArray(data)) {
        return (data as Array<{ id: string; agent_name: string; amount_cents: number; created_at: string }>).map(
          (evt, idx) => ({
            id: evt.id,
            agent_name: evt.agent_name,
            amount_cents: evt.amount_cents,
            rank: idx + 1,
            timestamp: evt.created_at,
          })
        );
      }
    } catch (err) {
      console.warn('InsForge bid_history note:', err);
    }
  }

  return [...outbidEventsStore];
}

/**
 * Record a live visitor heartbeat to calculate accurate real-time visitors.
 */
export async function recordVisitorHeartbeat(): Promise<SiteStats> {
  trackedVisitorsCount += 1;
  const now = Date.now();
  activeSessionTimestamps.push(now);

  const cutoff = now - 300000;
  while (activeSessionTimestamps.length > 0 && activeSessionTimestamps[0] < cutoff) {
    activeSessionTimestamps.shift();
  }

  return getSiteStats();
}

/**
 * Get aggregate site statistics.
 */
export async function getSiteStats(): Promise<SiteStats> {
  let totalRevenueCents = 0;
  let onlineNow = Math.max(1, activeSessionTimestamps.length);
  let totalVisitors = Math.max(1, trackedVisitorsCount);
  let totalPointsDistributed = agentsStore.reduce((sum, a) => sum + (a.points_total || 0), 0);

  if (insforge) {
    try {
      const { data } = await insforge.database
        .from('agents')
        .select('amount_cents, points_total')
        .eq('payment_status', 'completed');

      if (Array.isArray(data) && data.length > 0) {
        totalRevenueCents = data.reduce((sum, item) => sum + ((item as { amount_cents: number }).amount_cents || 0), 0);
        totalPointsDistributed = data.reduce((sum, item) => sum + ((item as { points_total: number }).points_total || 0), 0);
      }
    } catch (err) {
      console.warn('InsForge stats revenue sum note:', err);
    }
  }

  if (totalRevenueCents === 0 && agentsStore.length > 0) {
    totalRevenueCents = agentsStore
      .filter((a) => a.payment_status === 'completed')
      .reduce((sum, a) => sum + (a.amount_cents || 0), 0);
  }

  const outbids = await getRecentOutbids();

  return {
    id: 1,
    total_visitors: totalVisitors,
    total_revenue_cents: totalRevenueCents,
    online_now: onlineNow,
    total_outbids: outbids.length,
    total_points_distributed: totalPointsDistributed,
  };
}


