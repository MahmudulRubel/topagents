# AGENTS.md — topagents.lol Project Context Entry Point

Welcome to **topagents.lol**! This codebase is managed using the **ContextZen Methodology**. 
Before writing any code or modifying existing features, read the relevant documents in the [`context/`](file:///d:/topagents/context) directory.

---

## 🎯 Quick Project Summary
**topagents.lol** is a live, competitive leaderboard web application where AI agent builders pay to outbid each other for the #1 spot.
- **Mechanic**: Dynamic rank computed by `ORDER BY amount_cents DESC`. Paying to outbid is the entire monetization model.
- **Design System**: **Literalist Utility** (`stitch_top_agents_leaderboard`) — `#F9F9F9` background, `#4F46E5` accent, sharp `rounded-none` edges, square initials avatars, 800px max container.
- **Tech Stack**: Next.js 14+ App Router, TypeScript, Tailwind CSS, InsForge (DB + Storage), Creem.io (Payments), Vercel.

---

## 📂 Context Directory Map

| Document | Description & Key Topics |
| :--- | :--- |
| [`context/project-overview.md`](file:///d:/topagents/context/project-overview.md) | Product vision, core user flow, feature requirements, scope bounds. |
| [`context/architecture.md`](file:///d:/topagents/context/architecture.md) | Tech stack, system boundaries, InsForge schemas, **5 non-negotiable invariants**. |
| [`context/ui-context.md`](file:///d:/topagents/context/ui-context.md) | **Literalist Utility** design system (`stitch_top_agents_leaderboard`), color tokens, typography, layout rules. |
| [`context/code-standards.md`](file:///d:/topagents/context/code-standards.md) | TypeScript rules, Next.js App Router patterns, file organization. |
| [`context/ai-workflow-rules.md`](file:///d:/topagents/context/ai-workflow-rules.md) | Single-unit scoping, protected files, verification checklist. |
| [`context/progress-tracker.md`](file:///d:/topagents/context/progress-tracker.md) | 10-step build plan, current phase, unit status, session log. |

---

## ⚠️ Critical Invariants (DO NOT VIOLATE)
1. **Private Email**: `claimed_by_email` MUST NEVER be exposed in any public API responses (`GET /api/leaderboard`, stats, or client state).
2. **Dynamic Rank**: Rank is NEVER stored as a static database column; it MUST be computed on the fly by sorting `amount_cents DESC`.
3. **Server-Side Bid Check**: Minimum bid calculations ($1 minimum claim, +$1 to outbid) MUST be re-verified on the server in `POST /api/claim` before creating a Creem checkout session.
4. **Webhook Security**: `POST /api/webhooks/creem` MUST verify the Creem webhook signature before updating database records.
5. **Literalist Utility Design**: Follow `stitch_top_agents_leaderboard` design system (max-width 800px, off-white theme, 0px border radius).

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

<!-- INSFORGE:START -->
## InsForge backend

This project uses [InsForge](https://insforge.dev): an all-in-one, open-source Postgres-based backend (BaaS) that gives this app a database, authentication, file storage, edge functions, realtime, an AI model gateway, and payments through one platform.

- **Project:** **topagents** (API base `https://rw722vwb.us-east.insforge.app`)
- **Skills:** these InsForge skills are installed for supported coding agents. Reach for them before implementing any InsForge feature instead of guessing the API:
  - `insforge`: app code with the `@insforge/sdk` client (database CRUD, auth, storage, edge functions, realtime, AI, email, and Stripe payments).
  - `insforge-cli`: backend and infrastructure via the `insforge` CLI (projects, SQL, migrations, RLS policies, storage buckets, functions, secrets, payment setup, schedules, deploys).
  - `insforge-debug`: diagnosing failures (SDK/HTTP errors, RLS denials, auth and OAuth issues) and running security or performance audits.
  - `insforge-integrations`: wiring external auth providers (Clerk, Auth0, WorkOS, Better Auth, etc.) for JWT-based RLS, or the OKX x402 payment facilitator.
  - `find-skills`: discovering additional skills on demand.
- **Credentials:** app code reads keys from `.env.local`; the CLI reads `.insforge/project.json`. Never hardcode or commit keys.

Key patterns:

- Database inserts take an array: `insert([{ ... }])`.
- Reference users with `auth.users(id)`; use `auth.uid()` in RLS policies.
- For storage uploads, persist both the returned `url` and `key`.
<!-- INSFORGE:END -->
