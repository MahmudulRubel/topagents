# Architecture & System Design — topagents.lol

## Stack
- **Framework**: Next.js 14+ (App Router, Server Components & Route Handlers)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS (Literalist Utility Design System from `stitch_top_agents_leaderboard`)
- **Design Specification**: Literalist Utility — `#F9F9F9` background, `#4F46E5` accent, 800px max container, sharp 0px corners
- **Backend Database & Storage**: InsForge (PostgreSQL database + Object Storage bucket `agent-logos`)
- **Payments Gateway**: Creem.io (One-time payment checkout sessions & signature-verified webhooks)
- **Deployment Target**: Vercel

---

## System Boundaries

```
[ Visitor / Browser ]
        │
        ├── GET / ────────────────────────► Next.js Server Components (App Router)
        ├── GET /api/leaderboard ─────────► Route Handler ──► InsForge DB (agents query)
        ├── POST /api/click ──────────────► Route Handler ──► InsForge DB (clicks count +1)
        │
        ├── POST /api/claim ──────────────► Route Handler
        │                                       │
        │                                       ├──► InsForge Storage (Upload Logo)
        │                                       ├──► InsForge DB (Insert 'pending' agent)
        │                                       └──► Creem.io API (Create Checkout Session)
        │                                                 │
        │◄────── Redirect to Checkout URL ────────────────┘
        │
[ Creem.io Gateway ]
        │
        └────── POST /api/webhooks/creem ─► Webhook Handler (Verify HMAC Signature)
                                                │
                                                ├──► InsForge DB (Update status='completed')
                                                ├──► InsForge DB (Insert bid_history entry)
                                                └──► InsForge DB (Increment site_stats revenue)
```

---

## Storage Model

### InsForge PostgreSQL Tables

#### Table: `agents`
| Column | Type | Constraints / Defaults | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | PRIMARY KEY, `gen_random_uuid()` | Unique agent identifier |
| `agent_name` | `text` | NOT NULL | Name of the AI agent (max 60 chars) |
| `tagline` | `text` | NOT NULL | Short pitch (max 150 chars) |
| `url` | `text` | NOT NULL | Destination link |
| `category` | `text` | NOT NULL | Enum: `coding` \| `voice` \| `browser` \| `support` \| `sales` \| `research` \| `workflow` \| `other` |
| `logo_url` | `text` | NULLABLE | Public URL of logo in InsForge Storage |
| `claimed_by_email` | `text` | NOT NULL | **PRIVATE** receipt email (never expose publicly) |
| `claimed_by_handle` | `text` | NULLABLE | Public handle (e.g. `@builder`) |
| `amount_cents` | `integer` | NOT NULL | Bid amount paid in USD cents |
| `clicks` | `integer` | DEFAULT 0 | Outbound click tally |
| `claimed_at` | `timestamptz` | DEFAULT `now()` | Timestamp when payment completed |
| `created_at` | `timestamptz` | DEFAULT `now()` | Record creation timestamp |
| `payment_status` | `text` | DEFAULT `'pending'` | Enum: `'pending'` \| `'completed'` \| `'failed'` |
| `creem_checkout_id` | `text` | NULLABLE | Creem session ID for reconciliation |

**Indexes**:
- `idx_agents_amount_cents`: `agents(amount_cents DESC)`
- `idx_agents_category`: `agents(category)`
- `idx_agents_payment_status`: `agents(payment_status)`

#### Table: `bid_history`
| Column | Type | Constraints / Defaults | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | PRIMARY KEY, `gen_random_uuid()` | Log entry ID |
| `agent_id` | `uuid` | REFERENCES `agents(id)` | Associated agent |
| `agent_name` | `text` | NOT NULL | Agent name snapshot |
| `amount_cents` | `integer` | NOT NULL | Bid amount |
| `action` | `text` | NOT NULL | Enum: `'claimed'` \| `'outbid'` |
| `created_at` | `timestamptz` | DEFAULT `now()` | Log timestamp |

#### Table: `site_stats`
| Column | Type | Constraints / Defaults | Description |
| :--- | :--- | :--- | :--- |
| `id` | `integer` | PRIMARY KEY, DEFAULT 1 | Single-row stats table |
| `total_visitors` | `bigint` | DEFAULT 0 | Cumulative unique visitor count |
| `total_revenue_cents` | `bigint` | DEFAULT 0 | Cumulative revenue in cents |
| `online_now` | `integer` | DEFAULT 0 | Estimated current live visitors |

---

## Invariants (Non-Negotiable Rules)

1. **Email Privacy**: `claimed_by_email` MUST NEVER be returned in any public REST API response or rendered client-side. Select statements for public endpoints MUST explicitly exclude this column.
2. **Dynamic Rank Computation**: Rank position (#1, #2, #3...) is NEVER saved as a static integer in the database. Rank is dynamically derived by sorting query results by `amount_cents DESC`.
3. **Server-Side Bid Re-Validation**: In `POST /api/claim`, the server MUST re-query current database bids to ensure the requested bid satisfies minimum requirements ($1 base or target rank amount + $1) before invoking Creem checkout creation.
4. **Webhook Signature Verification**: `POST /api/webhooks/creem` MUST verify the `x-creem-signature` header using `CREEM_WEBHOOK_SECRET` before processing payload mutations.
5. **Literalist Utility Design Adherence**: The UI MUST adhere to the Literalist Utility specification from `stitch_top_agents_leaderboard` (800px max-width container, `#F9F9F9` background, sharp `0px` border radius, `#4F46E5` CTA accent, square initials avatar blocks).
