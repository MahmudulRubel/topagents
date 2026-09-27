# Design Specification: Admin Dashboard & DeepSeek AI Auto-Publish Pipeline

**Date**: 2026-09-27  
**Status**: Approved for Planning  
**Target System**: topagents.lol  

---

## 1. Executive Summary & Goals
When developers and builders submit their autonomous agents to **topagents.lol**, the platform automatically generates a human-grade, zero-AI-slop technical review exceeding 2,000 words using the **DeepSeek API** (`deepseek-chat` / `deepseek-reasoner`).

The submission is evaluated against rigorous quality and slop checks:
- If quality checks pass, it is automatically published live to the directory feed and dynamic agent page (`/agents/[slug]`), including Schema.org JSON-LD SEO markup.
- If quality checks fail or the API key is not configured, it is saved with a `flagged` or `pending_review` status.
- A secure **Admin Dashboard** (`/admin`) allows administrators to authenticate with an `ADMIN_SECRET_KEY`, inspect all submissions, trigger one-click DeepSeek re-generation, edit editorial copy, change publication status, or delete entries.

---

## 2. Architecture & Data Flow

```
+------------------+         +-------------------------------+
| User Submits     | ------> | POST /api/agents/submit       |
| Form (/submit)   |         +-------------------------------+
+------------------+                         |
                                             v
                             +-------------------------------+
                             | 1. Sanitize & Validate        |
                             | 2. Create Submission Record   |
                             +-------------------------------+
                                             |
                                             v
                             +-------------------------------+
                             | DeepSeek Generation Engine    |
                             | (deepseek-chat / reasoner)    |
                             +-------------------------------+
                                             |
                                             v
                             +-------------------------------+
                             | Slop & Quality Gate           |
                             | (Banned phrases, >2,000 words)|
                             +-------------------------------+
                               /                           \
                   (Passes)   /                             \ (Fails / Error)
                             v                               v
             +---------------------------+       +---------------------------+
             | Status: "published"       |       | Status: "flagged"         |
             | Instant Live in Feed &    |       | Saved for Admin Review    |
             | Dynamic /agents/[slug]    |       +---------------------------+
             +---------------------------+                     |
                           \                                   /
                            \                                 /
                             v                               v
                   +-----------------------------------------------+
                   | Storage Layer: InsForge DB + Local JSON Cache |
                   +-----------------------------------------------+
                                             ^
                                             |
                   +-----------------------------------------------+
                   | Admin Dashboard (/admin)                      |
                   | Protected by ADMIN_SECRET_KEY Session Cookie  |
                   | - Regenerate with DeepSeek                    |
                   | - Edit Content & Specs                        |
                   | - Approve / Unpublish / Delete                |
                   +-----------------------------------------------+
```

---

## 3. DeepSeek Content Engine (`lib/ai/deepseek.ts`)

### Configuration
- `DEEPSEEK_API_KEY`: API key for `https://api.deepseek.com/chat/completions`.
- `DEEPSEEK_MODEL`: Configurable in `.env.local`, defaults to `deepseek-chat` (DeepSeek-V3), with optional `deepseek-reasoner` (DeepSeek-R1).
- `DEEPSEEK_BASE_URL`: Defaults to `https://api.deepseek.com`.

### Prompt Engineering & Editorial Standard
The prompt enforces the critical invariants from `AGENTS.md`:
1. **Zero AI Slop Rule**: Strict negative prompt forbidding *"in today's fast-paced digital landscape"*, *"delve into"*, *"testament to"*, *"game-changer"*, *"seamlessly integrates"*, *"revolutionary"*, etc.
2. **Senior Systems Engineering Tone**: Concrete technical teardown focusing on execution loop, memory model, orchestration graph, token consumption, and edge cases.
3. **Structured JSON Output Schema**:
   - `tagline`: Snappy, technical one-liner (<100 characters).
   - `description`: 2-3 sentence core overview.
   - `architectureBreakdown`: 400+ words detailed architectural teardown.
   - `enterpriseUseCases`: Array of 4+ production enterprise applications with ROI metrics.
   - `cliQuickstart`: Step-by-step terminal installation, environment variables, and execution commands.
   - `pricingEconomics`: Breakdown of free tier, compute token costs, enterprise seats, and hidden overheads.
   - `benchmarks`: Structured array of standardized benchmarks (e.g., SWE-bench, GAIA, latency, context window).
   - `quickSpecs`: License, primary runtime, supported models, execution mode, context limit, memory backend.
   - `pros`: 4+ concrete engineering advantages.
   - `cons`: 3+ candid drawbacks and operational bottlenecks.
   - `faqs`: 4+ deep developer FAQs with code-level insights.
   - `fullArticleMarkdown`: Comprehensive 2,000+ words deep dive markdown integrating all sections.

---

## 4. Admin Dashboard (`/admin`)

### Authentication
- Route: `/admin/login` and `/admin`
- Security: Checks for valid HTTP-only cookie `admin_session` signed or verified against `ADMIN_SECRET_KEY`.
- Fallback in local dev: If `ADMIN_SECRET_KEY` is not set, defaults to a clear reminder on screen or prompt in `.env.local`.

### Features
1. **KPI Stats Banner**:
   - Total Submissions
   - Published Agents
   - Flagged / Pending Review
   - DeepSeek API Health & Model in Use
2. **Submissions Table / Feed**:
   - Filters: `All`, `Published`, `Flagged`, `Pending`
   - Search by name, category, or submitter handle
   - Badges showing quality score, word count, and status
3. **Submission Detail & Editor Modal / Drawer**:
   - Inspect full DeepSeek-generated article and structured JSON fields.
   - Live word count counter with 2,000+ words target indicator.
   - **"Regenerate with DeepSeek" button** with optional custom prompt adjustments.
   - Status toggle: `Published` <-> `Flagged` <-> `Draft`.
   - Delete button with confirmation.

---

## 5. Storage & Persistence (`lib/data/submissions.ts`)

### Dual Storage Design (InsForge DB + Resilient Local Fallback)
1. **InsForge PostgreSQL (`agent_submissions` table)**:
   - Primary storage in production.
   - Columns: `id`, `slug`, `agent_name`, `tagline`, `category`, `website_url`, `github_url`, `submitter_handle`, `pricing_model`, `status`, `generated_data` (JSONB), `word_count`, `error_log`, `created_at`, `updated_at`.
2. **Local JSON Fallback (`data/submissions.json`)**:
   - Automatically used when InsForge connection is not configured or in offline local development.
   - Prevents build/runtime crashes.

### Feed & Detail Page Integration
- `getAllAgents()` in `lib/data/agents/index.ts` is updated to combine the 100 core static agents with all approved `published` submissions from storage.
- `/agents/[slug]` dynamically resolves both static agents and published submissions seamlessly, generating Schema.org JSON-LD and proper metadata tags.

---

## 6. Verification & Quality Gates
- **Automated Slop Filter**: Submissions and generated content run through regex checking for 15+ synthetic filler phrases.
- **Word Count Validator**: Rejects or flags content under 1,500 words for editorial review.
- **Next.js Build Test**: `npm run build` verified with dynamic ISR/SSR pages for submitted agents.
- **Admin Auth Test**: Verify unauthorized requests to `/admin` redirect to `/admin/login`.
