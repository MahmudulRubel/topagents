# CLAUDE.md — topagents.lol Agent Guidelines

This project uses the **ContextZen Methodology**. Always check the [`context/`](file:///d:/topagents/context) directory for detailed rules.

## Primary References
- **Overview & Flows**: [`context/project-overview.md`](file:///d:/topagents/context/project-overview.md)
- **Architecture & Schema**: [`context/architecture.md`](file:///d:/topagents/context/architecture.md)
- **UI Design System**: [`context/ui-context.md`](file:///d:/topagents/context/ui-context.md) — Literalist Utility (`stitch_top_agents_leaderboard`)
- **Code Standards**: [`context/code-standards.md`](file:///d:/topagents/context/code-standards.md)
- **AI Workflow Rules**: [`context/ai-workflow-rules.md`](file:///d:/topagents/context/ai-workflow-rules.md)
- **Build Progress**: [`context/progress-tracker.md`](file:///d:/topagents/context/progress-tracker.md)

## Development Commands
- `npm run dev`: Starts local dev server
- `npm run build`: Type-checks and builds Next.js production bundle
- `npm run lint`: Runs ESLint check

## Core Principles
1. **Never expose `claimed_by_email`** in public API responses.
2. Compute rank dynamically (`ORDER BY amount_cents DESC`).
3. Re-verify minimum bids on the server inside `POST /api/claim`.
4. Follow Literalist Utility design (`stitch_top_agents_leaderboard`) with 800px max container, `#F9F9F9` background, sharp `0px` edges, and square initials avatars.
