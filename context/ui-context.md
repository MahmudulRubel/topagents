# UI Design System — topagents.lol (Literalist Utility)

## Theme
**topagents.lol** uses the **Literalist Utility** design system inspired by `stitch_top_agents_leaderboard`. It prioritizes raw utility, rapid information delivery, and transactional transparency over aesthetic flourish. 

The aesthetic is **Hyper-Minimalist**, **Literal**, and **Scrappy**:
- **Background**: Light off-white canvas (`#F9F9F9` / `#FAFAFA`) with hairline `#E2E2E2` / `#E5E5E5` borders.
- **Elevation**: Zero elevation. 0px drop shadows, flat layers, crisp 1px borders.
- **Shapes**: Sharp edges (`0px` / `rounded-none`) for containers, inputs, buttons, and avatar blocks.

---

## Colors

### Canvas & Surface Tokens
- **Body Background**: `#F9F9F9` (`bg-background` / `bg-[#F9F9F9]`)
- **Card / Container Surface**: `#FFFFFF` / `#F4F3F3` (`bg-surface` / `bg-white`)
- **Row Hover Surface**: `#EEEEEE` (`hover:bg-[#EEEEEE]`)
- **Hairline Border**: `#E2E2E2` / `#E5E5E5` (`border-[#E2E2E2]`)

### Text Tokens
- **Primary Text**: `#1A1C1C` / `#111111` (`text-[#1A1C1C]`) — Names, headlines, monetary values
- **Secondary / Muted Text**: `#5E5E5E` / `#666666` (`text-[#5E5E5E]`) — Timestamps, clicks, rank labels

### Accent Tokens
- **Primary Accent CTA**: `#4F46E5` (Muted Indigo) for Outbid buttons, active links, and bid focus states.
- **Primary CTA Hover**: `hover:bg-opacity-90` / `#4338CA`.
- **Link Accent**: `#4F46E5` (`text-[#4F46E5] hover:underline`).

### Square Initial Avatar Pastels
- **Blue Pastel**: Background `#E0F2FE`, Text `#0284C7`
- **Amber Pastel**: Background `#FEF3C7`, Text `#D97706`
- **Emerald Pastel**: Background `#D1FAE5`, Text `#059669`
- **Purple Pastel**: Background `#E2DFFF`, Text `#3323CC`

---

## Typography
Driven by **Inter** for UI copy and **Monospace** (`ui-monospace, SFMono-Regular, Consolas`) for numeric data.

- **Headline Large (`headline-lg`)**: `24px / 32px`, `font-semibold` (`letter-spacing: -0.02em`)
- **Headline Medium (`headline-md`)**: `18px / 24px`, `font-semibold` (`letter-spacing: -0.01em`)
- **Body Large (`body-lg`)**: `16px / 24px`, `font-normal`
- **Body Medium (`body-md`)**: `14px / 20px`, `font-normal`
- **Body Small (`body-sm`)**: `13px / 18px`, `font-normal`
- **Monospace Data (`mono-data`)**: `14px / 20px`, `font-mono font-bold` for monetary amounts (`$150.00`)
- **Label Caps (`label-caps`)**: `12px / 16px`, `font-semibold`, `uppercase tracking-wider`

---

## Border Radius
- **All Elements**: Sharp `0px` (`rounded-none`).
- No pill buttons, no rounded cards, no soft drop shadows.

---

## Layout Patterns

### Page Container
- Centered container with **Max Width: 800px** (`max-w-[800px] mx-auto`).
- Mobile horizontal padding: `16px` (`px-4`), Desktop: `32px` (`md:px-8`).

### Header & Nav
- Flat top header with 1px bottom border.
- Branding: `topagents.lol` in bold 18px.
- Text navigation links: `Leaderboard` (bold active), `About`, `Rules`.

### Hero & Claim Box Component
- Direct tagline: "No ads, no API keys, no revenue sharing. Just outbid your competition to get to the top."
- Embedded Claim Box with 1px border, inline bid input (`Enter bid amount`), and solid `#4F46E5` sharp `Outbid` CTA button.

### Leaderboard List View
- Horizontal rows separated by hairline 1px bottom borders.
- Row padding: `12px` vertical padding (`py-3`).
- Left layout: `#1` rank label -> `40x40px` square initial avatar -> Agent name & tagline + `2h ago · 842 clicks`.
- Right layout: Monospace bid amount (`$150.00`) + hover link `claim this rank for $151.00`.
