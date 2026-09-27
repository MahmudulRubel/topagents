# AGENTS.md — topagents.lol Project Context Entry Point

Welcome to **topagents.lol**! This codebase is managed using the **ContextZen Methodology**.
Before writing any code or modifying existing features, read the relevant documents in the [`context/`](file:///d:/topagents/context) directory.

---

## 🎯 Quick Project Summary
**topagents.lol** is the definitive **Product Hunt-styled AI Agent Directory** cataloging and reviewing the world's top 100 autonomous AI agents.
- **Product Vision**: A modern, high-velocity discovery and evaluation platform for AI agents (Coding, Autonomous, Multi-Agent, Voice, Sales/SDR, Support, Research, Workflow, Creative).
- **Human-Grade Editorial Review**: Every single agent features an in-depth, zero-AI-slop technical review exceeding **2,000 words** (Architecture, ReAct loops, Benchmarks, Enterprise Use Cases, Quickstart, Pricing Economics, Pros/Cons, and Developer FAQs).
- **Product Hunt Design System**: Crisp clean aesthetic (`#FBFBFA` background, `#FF6154` Product Hunt orange & `#4F46E5` indigo accents, signature `▲` upvote buttons, category badges, responsive cards, featured agent spotlight).
- **Free Community Submissions**: Open, frictionless "Add Your Agent for Free" flow for agent developers to submit their projects.
- **Tech Stack**: Next.js 14+ App Router, TypeScript (Strict), Tailwind CSS, InsForge (DB & Submissions), Dynamic SEO (JSON-LD Schemas, Sitemaps, OpenGraph).

---

## 📂 Context Directory Map

| Document | Description & Key Topics |
| :--- | :--- |
| [`context/project-overview.md`](file:///d:/topagents/context/project-overview.md) | Product vision, core user flows, top 100 agent scope, zero-AI-slop editorial standard, free submission. |
| [`context/architecture.md`](file:///d:/topagents/context/architecture.md) | Next.js 14 App Router, SSG/ISR static generation, data schemas, SEO pipeline, **5 critical invariants**. |
| [`context/ui-context.md`](file:///d:/topagents/context/ui-context.md) | Product Hunt styling system, color tokens, typography, upvote buttons, cards, responsive layout. |
| [`context/code-standards.md`](file:///d:/topagents/context/code-standards.md) | TypeScript rules, Next.js App Router patterns, structured data, programmatic SEO standards. |
| [`context/ai-workflow-rules.md`](file:///d:/topagents/context/ai-workflow-rules.md) | Single-unit scoping, protected files, verification checklist, quality gates. |
| [`context/progress-tracker.md`](file:///d:/topagents/context/progress-tracker.md) | Build roadmap, feature units, implementation milestones, session logs. |

---

## ⚠️ Critical Invariants (DO NOT VIOLATE)
1. **Zero AI Slop Rule**: Editorial content MUST NOT contain synthetic filler clichés (*"in today's fast-paced digital landscape"*, *"delve into"*, *"testament to"*, *"game-changer"*, *"seamlessly integrates"*). Every review must read like a senior systems engineer's teardown.
2. **2,000+ Words Content Threshold**: Every agent profile page (`/agents/[slug]`) MUST exceed 2,000 words of authentic technical analysis across architecture, benchmarks, use cases, tutorials, pricing, and FAQs.
3. **Product Hunt Interaction Paradigm**: Agent ranking must support organic upvoting with instantaneous optimistic UI feedback and local storage deduplication.
4. **Free Community Submissions**: The submission workflow MUST remain 100% free and frictionless for agent builders.
5. **Programmatic SEO Completeness**: Every agent and category page must emit valid Schema.org JSON-LD (`SoftwareApplication` / `Product` and `FAQPage`), OpenGraph tags, canonical links, and be indexed in `sitemap.xml`.

---

## 🛠️ Quick Commands
```bash
# Run local development server
npm run dev

# Run TypeScript check & build
npm run build

# Run linting
npm run lint
```
