# AI Workflow Rules — topagents.lol

## Approach
All feature implementations, refactoring, and bug fixes MUST follow a strict unit-by-unit plan derived from `context/progress-tracker.md`. AI coding agents must verify each build unit completely before moving to the next task.

---

## Scoping Rules
1. **Single-Unit Execution**: Execute one build unit at a time. Do not attempt multi-phase overhauls simultaneously.
2. **Design Fidelity**: Strict adherence to the **Literalist Utility** design system specified in `stitch_top_agents_leaderboard` and `context/ui-context.md` (800px max container, `#F9F9F9` background, sharp `0px` edges, square initials avatars).
3. **Explicit Verification**: Run automated type checks (`npm run build`) and route handler tests after completing each unit.

---

## Protected Files
The following files control critical application state, database access, design tokens, and payment webhooks. Modify them with caution:
- [`lib/insforge.ts`](file:///d:/topagents/lib/insforge.ts) — Database schema connection & query helpers.
- [`lib/creem.ts`](file:///d:/topagents/lib/creem.ts) — Creem checkout session builder & webhook signature verification.
- [`app/api/webhooks/creem/route.ts`](file:///d:/topagents/app/api/webhooks/creem/route.ts) — Revenue reconciliation & outbid logic handler.
- [`context/ui-context.md`](file:///d:/topagents/context/ui-context.md) — Literalist Utility design tokens.
- [`context/architecture.md`](file:///d:/topagents/context/architecture.md) — System invariants definition.

---

## Keeping Docs in Sync
- Whenever a database column or API route payload changes, immediately update [`context/architecture.md`](file:///d:/topagents/context/architecture.md).
- Whenever a UI color token or design spec changes, update [`context/ui-context.md`](file:///d:/topagents/context/ui-context.md).
- Update [`context/progress-tracker.md`](file:///d:/topagents/context/progress-tracker.md) status tags (`[x] Completed`, `[ ] Pending`) upon finishing each build step.

---

## Verification Checklist
Before marking any feature as complete, execute this verification protocol:
- [ ] **Type Check**: Run `npm run build` locally and ensure zero TypeScript or ESLint errors.
- [ ] **Design Alignment**: Verify max-width is 800px, container backgrounds use off-white canvas `#F9F9F9`, and edges are sharp `rounded-none`.
- [ ] **Email Privacy Audit**: Verify that `GET /api/leaderboard` returns objects completely omitting `claimed_by_email`.
- [ ] **Minimum Bid Audit**: Test `POST /api/claim` with bids below minimum threshold ($1 base or target rank + $1) and verify 400 rejection.
- [ ] **Webhook Signature Audit**: Verify that invalid `x-creem-signature` headers yield HTTP 401/403 errors.
