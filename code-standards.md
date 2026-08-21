# Code Standards — topagents.lol

## General principles
1. **Server-First Components**: Use Next.js Server Components (`RSC`) by default. Mark components with `'use client'` only when interactive state, browser events, or hooks are necessary.
2. **Literalist Utility Styling**: Use inline Tailwind CSS utility classes based on the `stitch_top_agents_leaderboard` design system (`max-w-[800px]`, `bg-[#F9F9F9]`, `rounded-none`, `border-[#E2E2E2]`, `text-[#1A1C1C]`, `text-[#4F46E5]`).
3. **Explicit Interfaces**: Declare strict interfaces for all API response payloads, InsForge database rows, and component props.
4. **Security by Default**: Never output private fields (such as `claimed_by_email`) in API route handlers or client-accessible props.

---

## TypeScript rules
- **Strict Mode Enabled**: Set `"strict": true` in `tsconfig.json`.
- **No `any`**: Use explicit interface/type declarations or `unknown` with narrow type guards.
- **Null Safety**: Explicitly declare nullable fields (e.g., `logo_url: string | null`).
- **Database Model Types**:
```typescript
export type Category = 
  | 'coding'
  | 'voice'
  | 'browser'
  | 'support'
  | 'sales'
  | 'research'
  | 'workflow'
  | 'other';

export type PaymentStatus = 'pending' | 'completed' | 'failed';

export interface AgentPublic {
  id: string;
  agent_name: string;
  tagline: string;
  url: string;
  category: Category;
  logo_url: string | null;
  claimed_by_handle: string | null;
  amount_cents: number;
  clicks: number;
  claimed_at: string;
  created_at: string;
  rank: number; // Dynamically computed index + 1
}

export interface AgentInternal extends AgentPublic {
  claimed_by_email: string;
  payment_status: PaymentStatus;
  creem_checkout_id: string | null;
}
```

---

## Styling conventions
- **Pure Tailwind CSS**: Use Tailwind utility classes matching `stitch_top_agents_leaderboard` (`code.html` & `DESIGN.md`).
- **Sharp Shapes**: Use `rounded-none` for all buttons, inputs, cards, and avatars.
- **Color Token Classes**:
  - Body Background: `bg-[#F9F9F9]` / `bg-[#FAFAFA]`
  - Primary Text: `text-[#1A1C1C]` / `text-[#111111]`
  - Secondary Text: `text-[#5E5E5E]` / `text-[#666666]`
  - Hairline Border: `border-[#E2E2E2]` / `border-[#E5E5E5]`
  - CTA Accent: `bg-[#4F46E5]` text-white, hover `hover:bg-opacity-90`
- **Container Limit**: Center layout with `max-w-[800px] mx-auto px-4 md:px-8`.

---

## File Organization
```
topagents/
├── app/
│   ├── (routes)/
│   │   ├── page.tsx               # Homepage Leaderboard (Literalist Utility)
│   │   ├── about/page.tsx         # About static page
│   │   ├── rules/page.tsx         # Rules static page
│   │   ├── claimed/page.tsx       # Claim success confirmation
│   │   └── layout.tsx             # Root layout with Header & Footer
│   └── api/
│       ├── leaderboard/route.ts   # GET public leaderboard
│       ├── claim/route.ts         # POST create checkout session
│       ├── webhooks/creem/route.ts# POST handle payment webhook
│       ├── click/route.ts         # POST increment click beacon
│       └── stats/route.ts         # GET site stats
├── components/
│   ├── leaderboard/
│   │   ├── LeaderboardTable.tsx
│   │   ├── LeaderboardRow.tsx
│   │   ├── CategoryTabs.tsx
│   │   ├── ClaimBox.tsx
│   │   ├── ClaimModal.tsx
│   │   └── StatsHeader.tsx
│   └── ui/
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── Badge.tsx
├── lib/
│   ├── insforge.ts                # InsForge database client
│   ├── creem.ts                   # Creem.io API integration
│   ├── types.ts                   # Core TypeScript interfaces
│   └── utils.ts                   # Formatting & currency helpers
├── stitch_top_agents_leaderboard/ # Stitch Design Assets (DESIGN.md, code.html, screen.png)
└── context/                       # ContextZen Methodology Docs
```
