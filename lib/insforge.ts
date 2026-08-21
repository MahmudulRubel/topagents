import { createClient } from '@insforge/sdk';
import { AgentPublic, AgentInternal, Category, ClaimPayload, SiteStats, OutbidEvent } from './types';

// Real empty in-memory state for local session tracking & fallback (attached to globalThis for dev persistence)
declare global {
  var __agentsStore: AgentInternal[] | undefined;
  var __outbidEventsStore: OutbidEvent[] | undefined;
  var __trackedVisitorsCount: number | undefined;
  var __activeSessionTimestamps: number[] | undefined;
}

const agentsStore: AgentInternal[] = globalThis.__agentsStore || (globalThis.__agentsStore = []);
const outbidEventsStore: OutbidEvent[] = globalThis.__outbidEventsStore || (globalThis.__outbidEventsStore = []);

let trackedVisitorsCount = globalThis.__trackedVisitorsCount || (globalThis.__trackedVisitorsCount = 0);
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
 * Sanitize internal agent to AgentPublic.
 * CRITICAL INVARIANT #1: claimed_by_email is STRICTLY EXCLUDED.
 */
function sanitizeAgentPublic(agent: AgentInternal, rank: number): AgentPublic {
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
    claimed_at: agent.claimed_at,
    created_at: agent.created_at,
    rank,
  };
}

/**
 * Fetch public leaderboard.
 * CRITICAL INVARIANT #1: claimed_by_email is STRICTLY EXCLUDED.
 * CRITICAL INVARIANT #2: Rank is dynamically computed by sorting amount_cents DESC.
 */
export async function getPublicLeaderboard(category?: Category): Promise<AgentPublic[]> {
  if (insforge) {
    try {
      let query = insforge.database
        .from('agents')
        .select('*')
        .eq('payment_status', 'completed')
        .order('amount_cents', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (!error && Array.isArray(data)) {
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
  // Dynamic sorting by amount_cents DESC
  filtered.sort((a, b) => b.amount_cents - a.amount_cents);

  return filtered.map((agent, index) => sanitizeAgentPublic(agent, index + 1));
}

/**
 * Get current minimum bid required to claim a target rank.
 * Server-Side Bid Check invariant: Minimum $1.00 (100 cents) or target rank bid + $1.00 (100 cents).
 */
export async function getMinBidForRank(targetRank: number = 1): Promise<number> {
  const leaderboard = await getPublicLeaderboard();
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
  creemCheckoutId: string
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
    claimed_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    payment_status: 'pending',
    creem_checkout_id: creemCheckoutId,
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
          payment_status: 'pending',
          creem_checkout_id: creemCheckoutId,
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
 * Reconcile payment from Creem webhook or checkout completion.
 */
export async function completeAgentPayment(checkoutId: string): Promise<boolean> {
  const now = new Date().toISOString();
  let paidAgentName = '';
  let paidAmount = 0;

  const agentIndex = agentsStore.findIndex((a) => a.creem_checkout_id === checkoutId);
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
        .eq('creem_checkout_id', checkoutId)
        .select('*');

      if (Array.isArray(data) && data.length > 0) {
        paidAgentName = data[0].agent_name;
        paidAmount = data[0].amount_cents;

        // Log into bid_history table
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
 * Increment click counter for outbound agent link.
 */
export async function recordClick(agentId: string): Promise<boolean> {
  const agent = agentsStore.find((a) => a.id === agentId);
  if (agent) {
    agent.clicks = (agent.clicks || 0) + 1;
  }

  if (insforge) {
    try {
      // Try RPC first, fallback to standard increment
      const { error } = await insforge.database.rpc('increment_clicks', { agent_id: agentId });
      if (error) {
        const { data } = await insforge.database.from('agents').select('clicks').eq('id', agentId).single();
        if (data) {
          const currentClicks = (data as { clicks?: number }).clicks || 0;
          await insforge.database.from('agents').update({ clicks: currentClicks + 1 }).eq('id', agentId);
        }
      }
    } catch (err) {
      console.warn('InsForge click record note:', err);
    }
  }

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

  // Keep sessions from last 5 minutes (300,000 ms)
  const cutoff = now - 300000;
  while (activeSessionTimestamps.length > 0 && activeSessionTimestamps[0] < cutoff) {
    activeSessionTimestamps.shift();
  }

  return getSiteStats();
}

/**
 * Get aggregate site statistics.
 * Computes strictly real values:
 * - total_revenue_cents = sum of all completed agent bids
 * - total_visitors = real tracked session count
 * - online_now = real active sessions in last 5 minutes (min 1)
 */
export async function getSiteStats(): Promise<SiteStats> {
  let totalRevenueCents = 0;
  let onlineNow = Math.max(1, activeSessionTimestamps.length);
  let totalVisitors = Math.max(1, trackedVisitorsCount);

  if (insforge) {
    try {
      const { data } = await insforge.database
        .from('agents')
        .select('amount_cents')
        .eq('payment_status', 'completed');

      if (Array.isArray(data) && data.length > 0) {
        totalRevenueCents = data.reduce((sum, item) => sum + ((item as { amount_cents: number }).amount_cents || 0), 0);
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
  };
}

