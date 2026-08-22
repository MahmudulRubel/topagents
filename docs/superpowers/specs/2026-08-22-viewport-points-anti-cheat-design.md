# Viewport Product Points & IP Anti-Cheat System — Technical Design Spec

## Overview
This document specifies the architecture and implementation for **Automatic Viewport Product Points** with **Strict IP Anti-Cheat Protection** on **topagents.lol**.

When visitors view AI agent cards on the leaderboard, points are automatically credited to the visible agents in real time. To maintain fair competition, the backend enforces server-side IP deduplication and rate limiting (1 access per IP address per time window).

---

## 🎯 Requirements & Goals
1. **Zero-Friction Automatic Points**: Visitors do not need to click manual "Claim" buttons. Simply viewing an agent card on screen automatically awards points directly to that product.
2. **Viewport Detection (`IntersectionObserver`)**: Points tick (+1 pt/sec) only when an agent row is at least 50% visible in the active browser viewport.
3. **Tab Focus Protection**: Tracking strictly halts when the browser tab is hidden (`document.hidden = true`).
4. **Strict IP Anti-Cheat Lock**: Server validates client IP (`x-forwarded-for` / `x-real-ip`). Each IP address is capped at 1 view pulse per agent per 5-second window (max 60 pts/min per IP per agent). Multi-tab or multi-window farming from the same IP is blocked server-side.
5. **Real-Time Visual Feedback**: A subtle `+1 pt` floating micro-animation renders on the visible agent row to provide live visual confirmation.

---

## 🏗️ Architecture & Component Boundaries

### 1. Viewport Tracker (`components/leaderboard/LeaderboardRow.tsx`)
- Uses `IntersectionObserver` to track when an agent row enters/exits the viewport (threshold: 0.5).
- Maintains a local view timer that sends pulse requests to `/api/points/action` when the tab is focused (`isTabFocused = true`) and the element is intersecting (`isIntersecting = true`).

### 2. IP Anti-Cheat Engine (`lib/insforge.ts` & `app/api/points/action/route.ts`)
- Extracts IP from request headers:
  ```ts
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
             request.headers.get('x-real-ip') ||
             '127.0.0.1';
  ```
- Maintains an in-memory & Postgres IP cache map:
  `ip_agent_view_cache: Map<string, number>` key = `${ip}:${agent_id}`, value = `last_view_timestamp`.
- If `now - last_view_timestamp < 5000` (5 seconds), the view pulse is rejected (HTTP 429 / dropped).

### 3. Server Action Endpoint (`app/api/points/action/route.ts`)
- Accepts payload: `{ action: 'view', agent_id: string }`.
- Validates IP uniqueness, increments `points_total` on the target agent in InsForge database, and returns updated points.

---

## 🧪 Verification & Test Plan
1. **Automated Verification**:
   - Run `npm run build` to confirm clean TypeScript compilation.
2. **Anti-Cheat Testing**:
   - Verify that multiple simultaneous requests from the same IP within 5 seconds return rate-limit protection notices.
   - Verify that switching tabs pauses `IntersectionObserver` pulses.

---

## 🔒 Spec Self-Review Checklist
- [x] **Placeholder Scan**: No TODOs or TBDs.
- [x] **Internal Consistency**: Data types match `lib/types.ts`.
- [x] **Scope Check**: Single sub-system design for viewport anti-cheat.
- [x] **Ambiguity Check**: IP rate limit explicit at 1 pulse / 5 sec per IP per agent.
