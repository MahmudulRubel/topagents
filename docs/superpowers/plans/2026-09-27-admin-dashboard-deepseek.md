# Admin Dashboard & DeepSeek AI Auto-Publish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an administrative management system and automated DeepSeek AI content generation pipeline that creates 2,000+ word, zero-AI-slop technical editorial reviews on agent submissions, auto-publishes approved agents to the live directory, and provides a password-protected admin dashboard for review and management.

**Architecture:** Next.js 14 App Router API routes handle submissions and admin operations. A DeepSeek AI client (`lib/ai/deepseek.ts`) connects to `https://api.deepseek.com` to generate senior-engineer-grade technical reviews. A resilient storage manager (`lib/data/submissions.ts`) uses InsForge PostgreSQL with automatic local JSON fallback (`data/submissions.json`). The admin interface (`/admin`) is guarded by HTTP-only cookie authentication against `ADMIN_SECRET_KEY`.

**Tech Stack:** Next.js 14, TypeScript (Strict), Tailwind CSS, Lucide Icons, DeepSeek API (`deepseek-chat` / `deepseek-reasoner`), InsForge PostgreSQL / Local JSON fallback.

## Global Constraints

- Zero AI slop rule: Generated content must not contain banned synthetic clichés ("in today's fast-paced digital landscape", "delve into", "game-changer", etc.).
- Editorial length standard: Generated articles must aim for 2,000+ words across technical architecture, enterprise use cases, CLI quickstart, pricing economics, benchmarks, pros/cons, and FAQs.
- Resilient storage: The system must never crash if InsForge tables or API keys are missing; graceful fallback to local storage or flagged status must always succeed.
- Responsive Product Hunt styling: Background `#FBFBFA`, primary orange `#FF6154`, indigo accents `#4F46E5`.

---

### Task 1: DeepSeek AI Content Engine

**Files:**
- Create: `lib/ai/deepseek.ts`
- Test: `scripts/test-deepseek.ts`

**Interfaces:**
- Produces:
  - `generateAgentEditorial(submission: AgentSubmissionInput): Promise<GeneratedEditorialResult>`
  - `verifyEditorialQuality(data: GeneratedEditorialResult): { isValid: boolean; wordCount: number; errors: string[] }`

- [ ] **Step 1: Write the test script for DeepSeek generation and quality checks**

Create `scripts/test-deepseek.ts` verifying prompt schema parsing and slop validation:
```typescript
import { verifyEditorialQuality } from '../lib/ai/deepseek';

const mockSample = {
  tagline: 'High-throughput headless browser agent for resilient web scraping',
  description: 'An open-source autonomous browser agent.',
  architectureBreakdown: 'Uses a CDP WebSocket protocol loop with state snapshotting.',
  enterpriseUseCases: [
    { title: 'Data Extraction', description: 'Automates ETL pipelines at 10k pages/hour with 99.8% uptime.', roiMetric: '70% cost reduction' }
  ],
  cliQuickstart: ['npm install -g agent-cli', 'agent-cli run --task "scrape"'],
  pricingEconomics: 'MIT licensed with zero seat fees. Hosted cloud costs $0.002 per session.',
  benchmarks: [
    { metric: 'Task Success Rate', value: '88.4%', baseline: '64.2%', source: 'WebArena 2026' }
  ],
  quickSpecs: {
    license: 'MIT',
    primaryRuntime: 'Node.js',
    supportedModels: ['Claude 3.7', 'DeepSeek-V3'],
    executionMode: 'Local Headless',
    contextLimit: '128k',
    memoryBackend: 'SQLite'
  },
  pros: ['Zero telemetry overhead', 'Native CDP integration'],
  cons: ['High memory footprint under 20 concurrent threads'],
  faqs: [{ question: 'How is state preserved?', answer: 'State is serialized to local SQLite snapshots.' }],
  fullArticleMarkdown: '## Architecture\n\nDetailed breakdown...'
};

const quality = verifyEditorialQuality(mockSample as any);
console.log('Quality check result:', quality);
```

- [ ] **Step 2: Implement DeepSeek AI client and quality gate in `lib/ai/deepseek.ts`**

Implement DeepSeek API call with system prompt strictly enforcing senior-engineer tone, zero-slop rules, and structured JSON output matching `AgentDetail`. Include fallback generator if `DEEPSEEK_API_KEY` is not yet configured so development can proceed without blocking.

- [ ] **Step 3: Run test script to verify DeepSeek module functionality**

Run: `npx tsx scripts/test-deepseek.ts`  
Expected: Quality check passes with word count calculated and zero slop violations.

- [ ] **Step 4: Commit Task 1**

```bash
git add lib/ai/deepseek.ts scripts/test-deepseek.ts
git commit -m "feat(ai): add DeepSeek AI editorial generation engine and quality validator"
```

---

### Task 2: Submissions Storage & Persistence Layer

**Files:**
- Create: `lib/data/submissions.ts`
- Create: `scripts/schema-submissions.sql`
- Test: `scripts/test-submissions-store.ts`

**Interfaces:**
- Produces:
  - `saveSubmission(submission: AgentSubmissionRecord): Promise<AgentSubmissionRecord>`
  - `getSubmissionById(id: string): Promise<AgentSubmissionRecord | null>`
  - `getSubmissionBySlug(slug: string): Promise<AgentSubmissionRecord | null>`
  - `listSubmissions(status?: string): Promise<AgentSubmissionRecord[]>`
  - `updateSubmission(id: string, updates: Partial<AgentSubmissionRecord>): Promise<AgentSubmissionRecord | null>`
  - `deleteSubmission(id: string): Promise<boolean>`

- [ ] **Step 1: Write SQL schema migration in `scripts/schema-submissions.sql`**

Define table `agent_submissions` with columns for ID, slug, name, category, website, github, submitter handle, status (`pending_review`, `published`, `flagged`, `rejected`), JSONB `editorial_data`, `word_count`, `quality_score`, `created_at`, and `updated_at`.

- [ ] **Step 2: Implement resilient dual storage in `lib/data/submissions.ts`**

Implement `saveSubmission`, `getSubmissionById`, `getSubmissionBySlug`, `listSubmissions`, `updateSubmission`, and `deleteSubmission`. Check for InsForge DB client first; if not configured or query fails, seamlessly read and write to `data/submissions.json` (auto-creating the directory if needed).

- [ ] **Step 3: Create and run test script `scripts/test-submissions-store.ts`**

Test saving a submission record, listing it, updating status, and retrieving by slug.  
Run: `npx tsx scripts/test-submissions-store.ts`  
Expected: All CRUD operations complete successfully.

- [ ] **Step 4: Commit Task 2**

```bash
git add lib/data/submissions.ts scripts/schema-submissions.sql scripts/test-submissions-store.ts
git commit -m "feat(storage): implement resilient submissions persistence layer with InsForge and JSON fallback"
```

---

### Task 3: Submission Route Integration with Auto-Publishing

**Files:**
- Modify: `app/api/agents/submit/route.ts`
- Modify: `components/submit/SubmitAgentModal.tsx`
- Modify: `app/submit/page.tsx`

**Interfaces:**
- Consumes: `lib/ai/deepseek.ts`, `lib/data/submissions.ts`

- [ ] **Step 1: Wire DeepSeek generation pipeline into `app/api/agents/submit/route.ts`**

Update `POST /api/agents/submit`:
1. Validate inputs (name, tagline, URL, category, slop checks).
2. Generate slug from agent name.
3. Trigger `generateAgentEditorial` via DeepSeek.
4. Run `verifyEditorialQuality`.
5. Set status: if valid, `published`; otherwise `flagged`.
6. Save record via `saveSubmission`.
7. Return HTTP 201 with `slug`, `status`, and message (e.g., "Agent published live!" or "Agent submitted for review").

- [ ] **Step 2: Update modal and submit page UI with feedback states**

Update `SubmitAgentModal.tsx` and `app/submit/page.tsx` to display real-time generation feedback ("Analyzing architecture with DeepSeek...", "Compiling technical review...", "Published live!").

- [ ] **Step 3: Test submission route with a test POST request**

Test using a local script or curl to ensure the submission endpoint returns valid JSON with `status: 'published'`.

- [ ] **Step 4: Commit Task 3**

```bash
git add app/api/agents/submit/route.ts components/submit/SubmitAgentModal.tsx app/submit/page.tsx
git commit -m "feat(submit): integrate DeepSeek auto-publish workflow on agent submission"
```

---

### Task 4: Admin Authentication & Management APIs

**Files:**
- Create: `lib/auth/admin.ts`
- Create: `app/api/admin/login/route.ts`
- Create: `app/api/admin/logout/route.ts`
- Create: `app/api/admin/submissions/route.ts`
- Create: `app/api/admin/submissions/[id]/route.ts`
- Create: `app/api/admin/submissions/[id]/regenerate/route.ts`

**Interfaces:**
- Produces:
  - `verifyAdminSession(req: NextRequest): Promise<boolean>`
  - `setAdminSessionCookie(res: NextResponse): void`
  - `clearAdminSessionCookie(res: NextResponse): void`

- [ ] **Step 1: Implement `lib/auth/admin.ts`**

Create secure cookie-based session verification against `process.env.ADMIN_SECRET_KEY` (defaulting to a development passphrase `topagents-admin-secret` if unset).

- [ ] **Step 2: Implement `/api/admin/login` and `/api/admin/logout` routes**

Validate passcode and set/clear HTTP-only cookie `admin_session`.

- [ ] **Step 3: Implement CRUD and regeneration routes in `/api/admin/submissions`**

- `GET /api/admin/submissions`: Returns all submissions with status filter.
- `PATCH /api/admin/submissions/[id]`: Updates status or editable fields.
- `DELETE /api/admin/submissions/[id]`: Removes a submission.
- `POST /api/admin/submissions/[id]/regenerate`: Re-runs DeepSeek generation with optional custom prompt override.

- [ ] **Step 4: Commit Task 4**

```bash
git add lib/auth/admin.ts app/api/admin/
git commit -m "feat(admin-api): implement admin authentication and submission management endpoints"
```

---

### Task 5: Admin Dashboard UI

**Files:**
- Create: `app/admin/page.tsx`
- Create: `app/admin/login/page.tsx`
- Create: `components/admin/AdminHeader.tsx`
- Create: `components/admin/AdminStatsBanner.tsx`
- Create: `components/admin/SubmissionsTable.tsx`
- Create: `components/admin/SubmissionDetailModal.tsx`

- [ ] **Step 1: Build the Admin Login Screen (`app/admin/login/page.tsx`)**

Clean, Product Hunt styled passcode login form with error states and redirect back to `/admin` upon success.

- [ ] **Step 2: Build KPI Stats Banner (`components/admin/AdminStatsBanner.tsx`)**

Display key metrics: Total Submissions, Published Live, Flagged / In Review, Average Word Count, and DeepSeek API Engine Status.

- [ ] **Step 3: Build Submissions Table (`components/admin/SubmissionsTable.tsx`)**

Interactive table featuring:
- Tabs: `All`, `Published`, `Flagged`, `Pending Review`
- Search bar (name, category, handle)
- Status pills, word count indicators, external links
- Action buttons: "Inspect / Edit", "Publish / Unpublish", "Delete"

- [ ] **Step 4: Build Submission Detail & DeepSeek Editor Modal (`components/admin/SubmissionDetailModal.tsx`)**

Drawer/modal displaying:
- Complete generated technical review & markdown preview
- Word count counter with 2,000+ words target meter
- One-click **"Regenerate with DeepSeek"** button with custom prompt input
- Editable metadata (tagline, category, pricing, website)
- Status switcher: `Published` / `Flagged` / `Rejected`

- [ ] **Step 5: Assemble the Admin Dashboard Page (`app/admin/page.tsx`)**

Server-side check for authentication; if unauthenticated, redirect to `/admin/login`. Render dashboard with real-time state updates.

- [ ] **Step 6: Commit Task 5**

```bash
git add app/admin/ components/admin/
git commit -m "feat(admin-ui): create comprehensive admin dashboard and editorial management console"
```

---

### Task 6: Directory Feed & Dynamic Routing Integration + End-to-End Verification

**Files:**
- Modify: `lib/data/agents/index.ts`
- Modify: `app/agents/[slug]/page.tsx`
- Modify: `app/sitemap.ts`

- [ ] **Step 1: Merge published submissions into `getAllAgents()` and `getAgentBySlug()`**

Update `lib/data/agents/index.ts` so directory queries seamlessly pull both the 100 core static agents AND any approved `published` submissions from the storage layer.

- [ ] **Step 2: Ensure dynamic `/agents/[slug]` renders submitted agents with JSON-LD**

Verify that dynamic route `/agents/[slug]` generates full technical reviews, benchmark tables, FAQs, and Schema.org `SoftwareApplication` JSON-LD for user-submitted agents.

- [ ] **Step 3: Update `app/sitemap.ts` to include published submissions**

Ensure all newly published agents are automatically indexed in `sitemap.xml`.

- [ ] **Step 4: Run full verification build**

Run: `npm run build`  
Expected: Clean build with all static and dynamic routes compiled without errors.

- [ ] **Step 5: Commit Task 6**

```bash
git add lib/data/agents/index.ts app/agents/[slug]/page.tsx app/sitemap.ts
git commit -m "feat(directory): seamlessly integrate approved submitted agents into directory feed and SEO sitemap"
```
