-- InsForge PostgreSQL Database Schema for topagents.lol
-- Run this in your InsForge SQL Console (https://rw722vwb.us-east.insforge.app)

-- 1. Create 'agents' table
CREATE TABLE IF NOT EXISTS public.agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_name VARCHAR(60) NOT NULL,
    tagline VARCHAR(150) NOT NULL,
    url TEXT NOT NULL,
    category VARCHAR(30) NOT NULL CHECK (category IN ('coding', 'voice', 'browser', 'support', 'sales', 'research', 'workflow', 'other')),
    logo_url TEXT NULL,
    claimed_by_email TEXT NOT NULL,
    claimed_by_handle VARCHAR(50) NULL,
    amount_cents INTEGER NOT NULL CHECK (amount_cents >= 500),
    clicks INTEGER DEFAULT 0,
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
    creem_checkout_id TEXT NULL,
    claimed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance & query optimization
CREATE INDEX IF NOT EXISTS idx_agents_amount_cents ON public.agents (amount_cents DESC);
CREATE INDEX IF NOT EXISTS idx_agents_category ON public.agents (category);
CREATE INDEX IF NOT EXISTS idx_agents_payment_status ON public.agents (payment_status);

-- 2. Create 'bid_history' table
CREATE TABLE IF NOT EXISTS public.bid_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
    agent_name VARCHAR(60) NOT NULL,
    amount_cents INTEGER NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('claimed', 'outbid')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create 'site_stats' table
CREATE TABLE IF NOT EXISTS public.site_stats (
    id INTEGER PRIMARY KEY DEFAULT 1,
    total_visitors BIGINT DEFAULT 0,
    total_revenue_cents BIGINT DEFAULT 0,
    online_now INTEGER DEFAULT 12,
    CONSTRAINT single_row_check CHECK (id = 1)
);

-- Seed initial row in site_stats if not exists
INSERT INTO public.site_stats (id, total_visitors, total_revenue_cents, online_now)
VALUES (1, 14850, 43000, 42)
ON CONFLICT (id) DO NOTHING;

-- 4. Atomic click counter function (RPC)
CREATE OR REPLACE FUNCTION public.increment_clicks(agent_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.agents
    SET clicks = clicks + 1
    WHERE id = agent_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Row Level Security (RLS) Policies
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bid_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

-- Allow public read access to completed agents
CREATE POLICY "Public agents read policy" ON public.agents
    FOR SELECT USING (payment_status = 'completed');

-- Allow public read access to site_stats
CREATE POLICY "Public site_stats read policy" ON public.site_stats
    FOR SELECT USING (true);

-- Allow public read access to bid_history
CREATE POLICY "Public bid_history read policy" ON public.bid_history
    FOR SELECT USING (true);
