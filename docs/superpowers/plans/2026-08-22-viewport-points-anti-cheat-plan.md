# Viewport Product Points & IP Anti-Cheat System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement automatic viewport-based product point accumulation (+1 pt/sec) with strict server-side IP deduplication and anti-cheat protection.

**Architecture:** Frontend uses `IntersectionObserver` in `LeaderboardRow.tsx` to detect active viewport visibility (>50% visible in focused tab) and sends lightweight view pulses to `POST /api/points/action`. Backend extracts client IP (`x-forwarded-for` / `x-real-ip`) and enforces a 1 pulse / 5 sec rate limit per IP per agent to prevent bot/multi-tab farming.

**Tech Stack:** Next.js 14 App Router, TypeScript, React `IntersectionObserver`, InsForge SDK, Tailwind CSS.

## Global Constraints

- **Viewport Threshold**: 0.5 (50% visible in active tab).
- **IP Anti-Cheat Rate Limit**: 1 view pulse allowed per 5 seconds per IP address per agent ID.
- **Tab Focus Check**: Pause visibility timers immediately when `document.hidden = true`.

---

### Task 1: Update Types and IP Rate Limiter in Backend Engine

**Files:**
- Modify: `lib/types.ts:30-45`
- Modify: `lib/insforge.ts:160-240`
- Modify: `app/api/points/action/route.ts:1-25`

**Interfaces:**
- Consumes: `PointActionPayload`
- Produces: `recordPointAction(payload: PointActionPayload, clientIp: string)`

- [ ] **Step 1: Update `PointActionType` in `lib/types.ts` to include `'view'`**

```ts
export type PointActionType = 'heartbeat' | 'share' | 'like' | 'comment' | 'click' | 'view';
```

- [ ] **Step 2: Add IP Deduplication Cache and View Logic in `lib/insforge.ts`**

Add IP cache map and update `recordPointAction`:
```ts
const ipViewCache = new Map<string, number>();

export async function recordPointAction(
  payload: PointActionPayload,
  clientIp: string = '127.0.0.1'
): Promise<{ success: boolean; pointsAwarded: number; newTotalPoints?: number; message?: string }> {
  const { action, agent_id } = payload;

  if (action === 'view' && agent_id) {
    const cacheKey = `${clientIp}:${agent_id}`;
    const now = Date.now();
    const lastView = ipViewCache.get(cacheKey) || 0;

    // Enforce strict 1-access per 5 seconds per IP per agent
    if (now - lastView < 5000) {
      return {
        success: false,
        pointsAwarded: 0,
        message: 'IP rate limit: 1 view credit per 5s allowed',
      };
    }

    ipViewCache.set(cacheKey, now);
  }

  // Award +1 point per view pulse
  let pointsAwarded = action === 'view' ? 1 : 0;
  // (Existing point action switch logic...)
```

- [ ] **Step 3: Extract Client IP in `app/api/points/action/route.ts`**

```ts
import { NextResponse } from 'next/server';
import { recordPointAction } from '@/lib/insforge';
import { PointActionPayload } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body: PointActionPayload = await request.json();

    if (!body || !body.action) {
      return NextResponse.json(
        { success: false, error: 'Missing required point action type' },
        { status: 400 }
      );
    }

    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    const result = await recordPointAction(body, clientIp);

    return NextResponse.json(result);
  } catch (error) {
    console.error('POST /api/points/action error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record point action' },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 4: Verify build with `npm run build`**

Run: `npm run build`
Expected: `✓ Compiled successfully`

- [ ] **Step 5: Commit backend IP rate limiting**

```bash
git add lib/types.ts lib/insforge.ts app/api/points/action/route.ts
git commit -m "feat: add IP rate limiting and view point action backend logic"
```

---

### Task 2: Implement Viewport Observer & Micro-Animation in `LeaderboardRow.tsx`

**Files:**
- Modify: `components/leaderboard/LeaderboardRow.tsx`

**Interfaces:**
- Consumes: `IntersectionObserver`, `fetch('/api/points/action')`
- Produces: Automatic agent view point credit when visible on screen

- [ ] **Step 1: Add IntersectionObserver hook & Viewport pulse timer in `LeaderboardRow.tsx`**

```tsx
const rowRef = useRef<HTMLDivElement>(null);
const [isIntersecting, setIsIntersecting] = useState(false);
const [showPointToast, setShowPointToast] = useState(false);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    },
    { threshold: 0.5 }
  );

  if (rowRef.current) {
    observer.observe(rowRef.current);
  }

  return () => observer.disconnect();
}, []);

// Send view pulse when tab is active & row is in viewport
useEffect(() => {
  if (!isIntersecting) return;

  const interval = setInterval(() => {
    if (document.hidden) return;

    fetch('/api/points/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'view', agent_id: agent.id }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.pointsAwarded > 0) {
          setShowPointToast(true);
          setTimeout(() => setShowPointToast(false), 800);
        }
      })
      .catch(() => {});
  }, 5000); // 5-second pulse interval

  return () => clearInterval(interval);
}, [isIntersecting, agent.id]);
```

- [ ] **Step 2: Add visual `+1 pt` floating micro-badge on `LeaderboardRow` JSX**

```tsx
<div ref={rowRef} className="relative group ...">
  {showPointToast && (
    <span className="absolute top-1 right-2 text-[10px] font-mono font-bold text-emerald-600 bg-emerald-100 border border-emerald-300 px-1.5 py-0.5 animate-bounce z-10">
      +1 PT VIEW
    </span>
  )}
  {/* Rest of row content */}
</div>
```

- [ ] **Step 3: Run `npm run build` to verify clean build**

Run: `npm run build`
Expected: `✓ Compiled successfully`

- [ ] **Step 4: Commit frontend viewport tracking implementation**

```bash
git add components/leaderboard/LeaderboardRow.tsx
git commit -m "feat: add IntersectionObserver viewport tracking and live +1 pt toast animation"
```
