# UI & Design System Context — topagents.lol

## 1. Design Language: Product Hunt Aesthetic
The user interface is inspired by **Product Hunt's clean, modern, high-engagement directory design**:
- **Background**: Warm off-white (`#FBFBFA` / `#FAFAFA`) giving an authentic paper-and-canvas aesthetic.
- **Card Containers**: Pure white (`#FFFFFF`) with subtle hairline slate borders (`#E5E7EB` / `#EAECF0`) and micro-hover elevations (`shadow-sm hover:shadow-md transition-shadow`).
- **Signature Accent Colors**:
  - Primary Action / Upvote Accent: Product Hunt Signature Orange (`#FF6154`) / Electric Indigo (`#4F46E5`).
  - Text Primary: `#111827` (Deep Slate Black for crisp readability).
  - Text Secondary: `#4B5563` / `#6B7280` (Muted Neutral Slate).
  - Badges & Tints: Subtle pastel fills (Emerald for Free/Open Source `#ECFDF5`, Amber for Freemium `#FEF3C7`, Violet for Paid `#F5F3FF`).

---

## 2. Component Design Specifications

### The Signature Upvote Button (`<UpvoteButton />`)
- Visual Structure: Rounded rectangle or pill containing an upward triangle arrow `▲` and the numeric vote count below or beside it.
- Dimensions:
  - Card view: Compact vertical pill (`w-12 h-14` or `w-14 h-16`), flex column, centered items.
  - Detail view: Prominent horizontal pill (`px-5 py-2.5`), flex row with icon and count.
- Interactive States:
  - Default: Border `#E5E7EB`, text `#374151`, background `#FFFFFF`.
  - Hover: Border `#FF6154`, text `#FF6154`, background `#FFF5F5`.
  - Upvoted / Active: Border `#FF6154`, background `#FF6154`, text `#FFFFFF`, subtle bounce animation.

### The Product Hunt Agent Card (`<AgentCard />`)
- Layout: Responsive flex container.
  - Left: Numbered rank indicator (`#1`, `#2`...) + Agent avatar (rounded-xl logo or vibrant monogram square).
  - Center / Body:
    - Row 1: Agent Name (font-semibold text-lg hover:text-orange-600) + Verified Checkmark + Category Badge + Pricing Badge.
    - Row 2: Punchy 1-line tagline explaining the core value proposition.
    - Row 3: Star rating (`★ 4.9`), reviews count, and topic tags (`#autonomous`, `#coding`, `#cli`).
  - Right: Signature Upvote Button.

### The "Featured Agent of the Day" Banner (`<FeaturedSpotlight />`)
- Bordered showcase container with gradient border accent or subtle spotlight glow.
- Highlights today's top trending agent with an expanded description, quick metrics, "Visit Website" button, and upvote button.

### Category Navigation Pills (`<CategoryFilter />`)
- Horizontal scrollable or wrapped pills:
  - `All (100)`, `Coding (20)`, `Browser & Autonomous (12)`, `Multi-Agent (12)`, `Voice (10)`, `Support (10)`, `Sales & SDR (10)`, `Research (10)`, `Productivity (8)`, `Multimodal (10)`.
- Active state: `#111827` dark pill with white text; Inactive: `#F3F4F6` gray pill with `#4B5563` text.

### In-Depth Article & Review Layout (`/agents/[slug]`)
- Two-column responsive desktop layout:
  - Left (Width ~70%): Deep-dive editorial content with generous typography (`leading-relaxed text-gray-800`), clean heading hierarchy (`h2`, `h3`), formatted code snippets, comparison tables, and interactive FAQ accordions.
  - Right (Width ~30%): Sticky sidebar featuring:
    - Quick Specs Card (Developer, Release, Pricing, Models, License, GitHub).
    - Sticky Table of Contents (TOC) with active scroll spy.
    - Outbound CTAs: "Visit Official Site ↗", "GitHub Repository", "Submit a Review".
