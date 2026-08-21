export type Category =
  | 'coding'
  | 'voice'
  | 'browser'
  | 'support'
  | 'sales'
  | 'research'
  | 'workflow'
  | 'other';

export type PaymentStatus = 'pending' | 'completed' | 'failed';

export interface AgentPublic {
  id: string;
  agent_name: string;
  tagline: string;
  url: string;
  category: Category;
  logo_url: string | null;
  claimed_by_handle: string | null;
  amount_cents: number;
  clicks: number;
  claimed_at: string;
  created_at: string;
  rank: number;
}

export interface AgentInternal extends AgentPublic {
  claimed_by_email: string;
  payment_status: PaymentStatus;
  creem_checkout_id: string | null;
}

export interface SiteStats {
  id: number;
  total_visitors: number;
  total_revenue_cents: number;
  online_now: number;
  total_outbids?: number;
}

export interface OutbidEvent {
  id: string;
  agent_name: string;
  amount_cents: number;
  rank: number;
  timestamp: string;
}

export interface BidHistory {
  id: string;
  agent_id: string;
  agent_name: string;
  amount_cents: number;
  action: 'claimed' | 'outbid';
  created_at: string;
}

export interface ClaimPayload {
  agent_name: string;
  tagline: string;
  url: string;
  category: Category;
  logo_url?: string | null;
  claimed_by_handle?: string | null;
  claimed_by_email: string;
  amount_cents: number;
  target_rank?: number;
}

export interface CreemCheckoutResponse {
  checkout_url: string;
  checkout_id: string;
}

