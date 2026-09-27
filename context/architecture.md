# Architecture & System Design — topagents.lol

## 1. Technology Stack
- **Framework**: Next.js 14+ (App Router, React 18, Server Components & Route Handlers)
- **Language**: TypeScript 5+ (Strict Mode, 100% type safety, zero `any`)
- **Styling**: Tailwind CSS (Product Hunt Design System Tokens)
- **Data & Storage**: Static Content Engine + InsForge Postgres (Submissions, Upvotes, Dynamic Queries)
- **SEO & Structured Data**: Dynamic Sitemaps (`app/sitemap.ts`), `robots.ts`, Schema.org JSON-LD (`SoftwareApplication`, `FAQPage`, `BreadcrumbList`)
- **Deployment Target**: Vercel

---

## 2. System Architecture

```
[ Visitor / Search Bot ]
        │
        ├── GET / ────────────────────────► Server Component (Static / ISR Directory Grid)
        ├── GET /agents/[slug] ───────────► Server Component (SSG 2,000+ Word Review + JSON-LD)
        ├── GET /category/[category] ─────► Server Component (SSG Category Filtered Hub)
        ├── GET /submit ──────────────────► Client/Server Page (Free Submission Form + Live Preview)
        ├── GET /sitemap.xml ─────────────► Route Handler (Dynamic XML Sitemap for all 100+ agents)
        │
        ├── POST /api/agents/submit ──────► Route Handler (Free Submission Handler -> InsForge)
        └── POST /api/agents/[slug]/upvote ► Route Handler (Upvote Increment Handler -> InsForge)
```

---

## 3. Data Architecture

### Static Dataset Registry (`lib/data/agents/`)
All 100 top AI agents are modeled as strongly-typed objects containing:
- Identification: `id`, `slug`, `name`, `tagline`, `category`, `websiteUrl`, `githubUrl`, `pricingModel` (`free` | `freemium` | `paid` | `open-source`), `tags`.
- Visuals: `logoUrl`, `avatarBg`, `monogram`.
- Metrics: `launchRank`, `upvotesCount`, `overallRating` (e.g. 4.9), `reviewsCount`.
- Technical Metadata: `primaryModel`, `developer`, `license`, `releaseYear`.
- Detailed Review Profile: High-depth structured sections (Architecture, Use Cases, Benchmarks, Quickstart, Pricing, Pros/Cons, Competitors, FAQs, Verdict).

### InsForge PostgreSQL Tables
For dynamic community submissions and upvoting counters:

#### Table: `community_submissions`
| Column | Type | Constraints / Defaults | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | PRIMARY KEY, `gen_random_uuid()` | Submission unique ID |
| `agent_name` | `text` | NOT NULL | Name of submitted agent |
| `tagline` | `text` | NOT NULL | Short pitch (max 150 chars) |
| `website_url` | `text` | NOT NULL | Official website link |
| `github_url` | `text` | NULLABLE | Source code / docs repository |
| `category` | `text` | NOT NULL | Category enum |
| `pricing_model` | `text` | NOT NULL | Free, freemium, paid, open source |
| `description` | `text` | NOT NULL | Detailed description |
| `submitter_handle` | `text` | NULLABLE | X / GitHub handle |
| `status` | `text` | DEFAULT `'published'` | Published or pending |
| `created_at` | `timestamptz` | DEFAULT `now()` | Submission timestamp |

#### Table: `agent_upvotes`
| Column | Type | Constraints / Defaults | Description |
| :--- | :--- | :--- | :--- |
| `slug` | `text` | PRIMARY KEY | Agent identifier |
| `upvotes_count` | `integer` | DEFAULT 0 | Real-time community upvotes |
| `updated_at` | `timestamptz` | DEFAULT `now()` | Last upvoted timestamp |

---

## 4. Programmatic SEO Engine
- **Static Generation**: Every `/agents/[slug]` route utilizes `generateStaticParams()` to pre-render all 100 profile pages at build time, yielding instant sub-100ms TTFB.
- **Dynamic Metadata**: Every profile executes `generateMetadata()` generating rich title tags, descriptions, OpenGraph cards, Twitter cards, and canonical URLs.
- **Structured Schema (JSON-LD)**:
  - `SoftwareApplication`: Name, applicationCategory, operatingSystem, offers, aggregateRating.
  - `FAQPage`: Rich snippet FAQ questions and detailed answers directly surfaced in Google Search results.
  - `BreadcrumbList`: Home > AI Agents Directory > [Category] > [Agent Name].

---

## 5. Critical Invariants (Non-Negotiable Rules)
1. **Zero AI Slop**: Absolutely no generic synthetic marketing phrases. All technical reviews must be rigorous, concrete, objective, and systems-focused.
2. **2,000+ Words Content Guarantee**: Every agent profile page (`/agents/[slug]`) must provide at least 2,000 words of authentic technical analysis.
3. **Product Hunt Interaction Standard**: Upvotes must update optimistically in the client UI immediately upon clicking, persist in `localStorage`, and synchronize with the server.
4. **100% Free Submissions**: Community submissions must never prompt for payment, credit cards, or paywalls.
5. **SEO & Accessibility Compliance**: All images/avatars must have meaningful `alt` text, all links must have valid `href`, and structured JSON-LD schemas must be valid and testable.
