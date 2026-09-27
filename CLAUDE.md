# CLAUDE.md — topagents.lol Agent Directory Guidelines

## Commands
- `npm run dev` — Start local Next.js dev server on http://localhost:3000
- `npm run build` — Validate TypeScript and compile static production bundle
- `npm run lint` — Run ESLint check

## Project Overview
topagents.lol is a Product Hunt-styled AI Agent Directory cataloging the world's top 100 autonomous AI agents with human-grade, zero-AI-slop technical editorial profiles (>= 2,000 words each), programmatic SEO, and free community submissions.

## Design System
- Product Hunt Aesthetic: Warm off-white (`#FBFBFA`), crisp borders (`#E5E7EB`), signature `▲` upvote buttons (`#FF6154` / `#4F46E5`), category pills, responsive grid/list.

## Critical Invariants
1. Zero AI Slop: No fluff clichés; authoritative engineering depth with concrete architecture, failure modes, benchmarks, and code.
2. Word Count: Every agent page must provide >= 2,000 words of structured technical analysis.
3. Programmatic SEO: JSON-LD (`SoftwareApplication`, `FAQPage`), dynamic sitemaps, OpenGraph metadata.
4. Free Submissions: 100% free agent submission workflow.
