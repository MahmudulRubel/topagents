# Project Overview — topagents.lol

## Overview
**topagents.lol** is a live, competitive leaderboard web application where AI agent builders pay to outbid each other for top rank positions (especially the #1 spot). Inspired by outbid.lol's exact bidding mechanic, topagents.lol is niched down specifically for AI agents (coding agents, voice agents, browser agents, support agents, sales agents, research agents, workflow agents, and others).

The UI adopts the **Literalist Utility** design system (`stitch_top_agents_leaderboard`): an ultra-clean, high-contrast off-white theme (`#F9F9F9`) with crisp hairline borders, sharp 0px corners, square initial avatars, 800px max-width container, and zero elevation shadows.

---

## Goals
1. **High-Velocity Monetization**: Enable instant one-time outbidding payments via Creem.io with 0-friction claim flows.
2. **Instant Dynamic Leaderboard**: Render sub-second, dynamic rankings based on real-time database queries sorting `amount_cents DESC`.
3. **Literalist Utility Vibe**: Scrappy, tool-like authentic UI prioritizing data hierarchy, speed, and zero fluff.
4. **Clean Visitor Experience**: Zero ads, zero mandatory authentication for browsing, fast mobile-first UI.

---

## Core User Flow
1. **Browse**: Visitor lands on single-page leaderboard homepage (max-width 800px).
2. **Filter & Inspect**: Visitor toggles inline text category links (All, Coding, Voice, Browser, Support, Sales, Research, Workflow). Rank numbers remain global (#1, #2, ...).
3. **Outbound Clicks**: Visitor clicks an agent link, opening destination URL in a new tab with `?utm_source=topagents` while triggering a non-blocking `POST /api/click` beacon.
4. **Initiate Claim**: User enters bid in the top Claim Box or clicks `claim this rank for $X` on any row.
5. **Modal Submission**: User fills out agent name, tagline, valid destination URL, category, optional logo, private receipt email, optional public handle, and bid amount (>= minimum required).
6. **Payment Checkout**: Client submits to `POST /api/claim`, creating a pending `agents` record and generating a Creem.io checkout session URL. User is redirected to Creem.io.
7. **Webhook Reconciliation**: Creem.io fires `checkout.completed` to `POST /api/webhooks/creem`. The webhook marks payment as completed, logs `bid_history`, and increments `site_stats.total_revenue_cents`.
8. **Confirmation**: User lands on `/claimed?session={checkout_id}`, confirming their rank with Twitter sharing.

---

## Features
- **Dynamic Leaderboard**: Automatically ranks agents by `amount_cents DESC`.
- **Literalist Aesthetics**: Crisp sharp lines, square avatars, `#4F46E5` accent, 800px centered canvas.
- **Outbid Calculation**: Minimum claim is $1 (100 cents). Outbidding any rank requires paying at least $1 (100 cents) more than that rank's current amount.
- **Square Initial Avatars**: Monogram square avatars with pastel backgrounds (`#E0F2FE`, `#FEF3C7`, `#D1FAE5`).
- **Click Counter**: Lightweight click tracking per agent using `navigator.sendBeacon`.
- **Live Stats Line**: `12 online · 4,205 visitors since launch · see stats →`.
- **Category Filters**: All | Coding | Voice | Browser | Support | Sales | Research | Workflow | Other.
- **Static Pages**: Informational `/about` and `/rules` pages.

---

## Scope
### In-Scope (MVP)
- Single-page Next.js App Router leaderboard UI using Literalist Utility design.
- InsForge Database integration (`agents`, `bid_history`, `site_stats` tables).
- InsForge Storage integration for logo uploads.
- Creem.io one-time payment checkout integration and webhook handler.
- Click counter beacon API endpoint.

### Out-of-Scope (Future / Excluded)
- User account authentication or passwords.
- Subscription billing or recurring charges.
- Ad networks or banner ads.

---

## Success Criteria
- [ ] Next.js 14+ App Router codebase type-checks cleanly (`npm run build`).
- [ ] `claimed_by_email` is strictly omitted from all public API responses.
- [ ] Dynamic ranking strictly follows `ORDER BY amount_cents DESC`.
- [ ] UI strictly conforms to `stitch_top_agents_leaderboard` Literalist Utility specification (800px max-width, sharp edges, off-white theme).
- [ ] Creem.io webhooks reliably process `checkout.completed` events and update leaderboard state instantly.
