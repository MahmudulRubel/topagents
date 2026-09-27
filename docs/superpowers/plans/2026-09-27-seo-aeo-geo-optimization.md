# SEO, AEO, and GEO Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform topagents.lol into a fully optimized directory across traditional SEO (search engine rankings, clean category URLs, canonicals), AEO (Answer Engine Optimization for featured snippets, voice search, 40-60 word answer blocks), and GEO (Generative Engine Optimization for ChatGPT, Perplexity, Claude, Gemini citations, llms.txt, llms-full.txt, and complete Schema.org JSON-LD).

**Architecture:** Next.js 14 App Router statically generated site with ISR. Introduces dedicated programmatic category pages (`/category/[category]`), machine-readable text endpoints (`/llms.txt`, `/llms-full.txt`, `/pricing.md`, `/api/agents/[slug]/markdown`), rich multi-entity Schema.org structured data (WebSite, Organization, SoftwareApplication, Review, ItemList, FAQPage, BreadcrumbList), explicit AI crawler configurations in `robots.ts`, and extractable AEO definition and FAQ blocks.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Schema.org JSON-LD.

## Global Constraints

- Content MUST adhere to the Zero AI Slop Rule (no synthetic clichés, authentic senior engineering tone).
- Retain the 2,000+ words threshold on all agent detail pages.
- Strict TypeScript typing (no `any` escapes).
- All new routes must be statically generated (`generateStaticParams`) with 100% build compatibility (`npm run build`).

---

### Task 1: AI Bot Crawlers, Security & Robots Configuration

**Files:**
- Modify: `app/robots.ts`

**Interfaces:**
- Produces: `MetadataRoute.Robots` object with explicit rules for `GPTBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`, `anthropic-ai`, `Google-Extended`, `Bingbot`, `Applebot-Extended`, and `*`.

- [ ] **Step 1: Update `app/robots.ts` with comprehensive AI crawler permissions**
- [ ] **Step 2: Verify robots output in build/test**

---

### Task 2: Machine-Readable Context Layer (`/llms.txt`, `/llms-full.txt`, `/pricing.md`)

**Files:**
- Create: `app/llms.txt/route.ts`
- Create: `app/llms-full.txt/route.ts`
- Create: `app/pricing.md/route.ts`
- Create: `app/api/agents/[slug]/markdown/route.ts`

**Interfaces:**
- Consumes: `getAllCombinedAgents()` from `@/lib/data/server-agents`, `CATEGORIES` from `@/lib/data/agents`
- Produces: Plain text / Markdown HTTP responses with `Content-Type: text/plain; charset=utf-8` or `text/markdown; charset=utf-8`

- [ ] **Step 1: Implement `app/llms.txt/route.ts` conforming to the llmstxt.org specification**
- [ ] **Step 2: Implement `app/llms-full.txt/route.ts` cataloging all 100+ agents in a single request**
- [ ] **Step 3: Implement `app/pricing.md/route.ts` with transparent machine-readable directory pricing**
- [ ] **Step 4: Implement `app/api/agents/[slug]/markdown/route.ts` returning clean markdown for individual agents**

---

### Task 3: Comprehensive Schema.org JSON-LD Generator

**Files:**
- Modify: `lib/seo/jsonld.ts`

**Interfaces:**
- Consumes: `Agent`, `CategoryItem`
- Produces:
  - `generateHomeJsonLd(topAgents: Agent[])`: `{ websiteSchema, orgSchema, itemListSchema, faqSchema }`
  - `generateAgentJsonLd(agent: Agent)`: `{ softwareAppSchema, reviewSchema, faqSchema, breadcrumbSchema }`
  - `generateCategoryJsonLd(category: CategoryItem, agents: Agent[])`: `{ collectionSchema, itemListSchema, breadcrumbSchema, faqSchema }`

- [ ] **Step 1: Enhance `lib/seo/jsonld.ts` with `Review`, `ItemList`, `WebSite`, `Organization`, and category schemas**
- [ ] **Step 2: Ensure schema conformity with Google Rich Results and Schema.org standards**

---

### Task 4: Programmatic Category Landing Pages (`/category/[category]`)

**Files:**
- Create: `app/category/[category]/page.tsx`
- Modify: `components/agent-detail/AgentHeader.tsx`
- Modify: `components/directory/Navbar.tsx`

**Interfaces:**
- Consumes: `CATEGORIES`, `getAgentsByCategory()`, `generateCategoryJsonLd()`
- Produces: Pre-rendered static landing pages at `/category/[category]` with dedicated metadata, canonical URLs, AEO definition block, and category-filtered feed.

- [ ] **Step 1: Create `app/category/[category]/page.tsx` with `generateStaticParams()` and `generateMetadata()`**
- [ ] **Step 2: Add category AEO Quick Definition Block and category FAQs**
- [ ] **Step 3: Update internal links in `AgentHeader.tsx` and `Navbar.tsx` to point to `/category/[category]`**

---

### Task 5: Homepage SEO, AEO & GEO Optimization

**Files:**
- Modify: `app/page.tsx`
- Create: `components/directory/DirectoryFaq.tsx`
- Modify: `components/directory/Footer.tsx`

**Interfaces:**
- Consumes: `generateHomeJsonLd()`, `getAllCombinedAgents()`
- Produces: Page-level metadata, home JSON-LD schemas, and conversational FAQ accordion on homepage.

- [ ] **Step 1: Create `components/directory/DirectoryFaq.tsx` with high-value conversational Q&A**
- [ ] **Step 2: Update `app/page.tsx` with page metadata, structured data scripts, and FAQ section**
- [ ] **Step 3: Update `components/directory/Footer.tsx` with links to `/llms.txt`, `/pricing.md`, and categories**

---

### Task 6: Agent Detail Page AEO & GEO Enhancements

**Files:**
- Modify: `app/agents/[slug]/page.tsx`

**Interfaces:**
- Consumes: `generateAgentJsonLd()` with added `Review` schema
- Produces: High-extractability 40-60 word Definition block, E-E-A-T badges ("Verified Review", "Editorial Review Board"), and benchmark citations.

- [ ] **Step 1: Add AEO Quick Definition Block at the top of the review in `app/agents/[slug]/page.tsx`**
- [ ] **Step 2: Add E-E-A-T Review Board attribution and benchmark citation notes**
- [ ] **Step 3: Inject updated JSON-LD schemas (including `reviewSchema`)**

---

### Task 7: Comprehensive Sitemap Engine

**Files:**
- Modify: `app/sitemap.ts`

**Interfaces:**
- Produces: Next.js Sitemap containing:
  - Homepage (`https://topagents.lol`, priority 1.0)
  - 9 Category routes (`/category/[category]`, priority 0.9)
  - 100+ Agent routes (`/agents/[slug]`, priority 0.9)
  - Machine-readable files (`/llms.txt`, `/llms-full.txt`, `/pricing.md`, priority 0.7)
  - Utility routes (`/submit`, `/advertise`, priority 0.8)

- [ ] **Step 1: Update `app/sitemap.ts` with all categories and machine-readable routes**

---

### Task 8: Verification & Build Validation

- [ ] **Step 1: Run `npm run build` to verify all 120+ pages compile without errors**
- [ ] **Step 2: Validate generated schemas, robots.txt, sitemap.xml, llms.txt, and category pages**
