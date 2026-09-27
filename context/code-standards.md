# Code Standards & Guidelines — topagents.lol

## 1. General Principles
- **Clean Next.js 14 App Router**: Use React Server Components (RSC) by default for speed, zero-client bundle overhead, and optimal SEO. Use `'use client'` strictly when handling interactive state (e.g. upvoting, modal dialogs, search inputs).
- **Strict TypeScript**: 100% type coverage. Zero usage of `any`. Define strong interfaces in `lib/data/types.ts`.
- **Fast Build & Static Pre-Rendering**: Utilize `generateStaticParams()` to pre-compile all 100 agent pages into static HTML.

---

## 2. Programmatic SEO Standards
1. **Metadata Definition**: Every page must declare a `generateMetadata` function providing:
   - Dynamic `<title>` in the format: `[Agent Name] Review (2026): Architecture, Benchmarks, Pricing & Alternatives | TopAgents`
   - Specific `<meta name="description">` between 140 and 160 characters summarizing the agent's core capability and score.
   - OpenGraph `og:title`, `og:description`, `og:type = 'article'`, and `og:image`.
   - Twitter `twitter:card = 'summary_large_image'`.
   - Canonical URL tag pointing to `https://topagents.lol/agents/[slug]`.

2. **Structured Data (JSON-LD)**:
   - Every agent page must render a `<script type="application/ld+json">` tag containing Schema.org entities:
     - `SoftwareApplication`: Name, description, operatingSystem, applicationCategory, aggregateRating, offers.
     - `FAQPage`: Questions and in-depth answers.
     - `BreadcrumbList`: Complete breadcrumb navigation hierarchy.

---

## 3. Human-Grade Editorial Writing Standards (Zero AI Slop)
All content generated in `lib/data/agents/` must strictly observe:
1. **Forbidden Words & AI Slop**:
   - Never write: *"delve into"*, *"testament to"*, *"in today's fast-paced digital world"*, *"beacon of"*, *"tapestry"*, *"game-changer"*, *"revolutionize"*, *"seamlessly blend"*, *"at the forefront of"*.
2. **Technical Specificity**:
   - Reference exact architectures: ReAct (Reasoning + Acting), LangGraph state graphs, Tree-of-Thoughts, microVM container isolation, AST parsing, Git diff staging.
   - Quote real benchmarks: SWE-bench Verified pass@1, HumanEval, latency to first token (TTFT), token burn rates ($ / task).
   - Document concrete failure modes: Context degradation at 100k+ tokens, hallucinated imports, flaky bash loops, API rate-limit throttling.
3. **Reproducible Code & Configurations**:
   - Provide real CLI invocations, environment variables (`.env`), and configuration files (`yaml` / `json`).

---

## 4. File Organization Standards
```
d:\topagents\
├── app/                        # Next.js App Router pages and route handlers
│   ├── page.tsx                # Main directory listing
│   ├── agents/[slug]/page.tsx  # Static profile & 2k+ word review
│   ├── category/[category]/    # Category hub page
│   ├── submit/page.tsx         # Free submission page
│   ├── sitemap.ts              # Dynamic XML sitemap
│   └── robots.ts               # Robots.txt
├── components/                 # UI components
│   ├── directory/              # Navbar, AgentCard, CategoryFilter, UpvoteButton
│   ├── agent-detail/           # TableOfContents, EditorialSection, Benchmarks, FAQ
│   └── submit/                 # Free submit modal & form
├── lib/
│   ├── data/                   # 100 Agents datasets & review generators
│   ├── seo/                    # Schema.org JSON-LD builders
│   └── insforge.ts             # InsForge database & storage client
```
