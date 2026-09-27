-- InsForge PostgreSQL Database Schema for Agent Submissions
-- Run this in your InsForge SQL Console (https://rw722vwb.us-east.insforge.app)

CREATE TABLE IF NOT EXISTS public.agent_submissions (
    id TEXT PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    agent_name VARCHAR(100) NOT NULL,
    tagline VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    pricing_model VARCHAR(50) NOT NULL,
    website_url TEXT NOT NULL,
    github_url TEXT NULL,
    submitter_handle VARCHAR(100) NULL,
    description TEXT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'pending_review', 'flagged', 'rejected')),
    source VARCHAR(50) DEFAULT 'deepseek-api',
    word_count INTEGER DEFAULT 0,
    editorial_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lightning fast lookups & filtering
CREATE INDEX IF NOT EXISTS idx_agent_submissions_status ON public.agent_submissions(status);
CREATE INDEX IF NOT EXISTS idx_agent_submissions_slug ON public.agent_submissions(slug);
CREATE INDEX IF NOT EXISTS idx_agent_submissions_created_at ON public.agent_submissions(created_at DESC);

-- Enable RLS
ALTER TABLE public.agent_submissions ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published agent submissions
CREATE POLICY "Public read policy for published submissions" ON public.agent_submissions
    FOR SELECT USING (status = 'published');

-- Allow all operations for authenticated service role
CREATE POLICY "Service role full access policy" ON public.agent_submissions
    FOR ALL USING (true);
