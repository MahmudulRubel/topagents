# Comprehensive Security Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fortify topagents.lol against common web attacks, XSS, CSRF, clickjacking, brute-force attacks, DoS, SSRF, and spam injection through defense-in-depth security layers.

**Architecture:** 
1. **Edge/Middleware Layer (`middleware.ts`)**: Centralized HTTP security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy), path traversal / scanner blocking, and origin validation.
2. **Rate Limiting Engine (`lib/security/rate-limit.ts`)**: Sliding-window rate limiter for sensitive endpoints (admin login, submissions, advertising, upvoting).
3. **Input Sanitization & SSRF Defense (`lib/security/sanitize.ts`)**: Robust text sanitization, HTML stripping, length enforcement, RFC email validation, and private/internal IP blocking for submitted URLs.
4. **Authentication Hardening (`lib/auth/admin.ts`)**: Constant-time comparison for passcodes, timestamped signed session tokens with expiration, and strict cookie flags.
5. **API Route Hardening**: Protecting `/api/admin/login`, `/api/agents/submit`, `/api/advertise`, and `/api/agents/[slug]/upvote` with rate limits, input sanitization, and CSRF origin checks.

**Tech Stack:** Next.js 14, TypeScript, Node crypto.

## Global Constraints
- Zero downtime or disruption to public static pages and SEO / machine-readable endpoints (`/llms.txt`, `/sitemap.xml`, etc.).
- Strict TypeScript typing (no `any` escapes).
- Timing-safe cryptographic operations for all secret comparisons.
- High-performance in-memory rate limiting with clean IP extraction.

---

### Task 1: Security Headers & Configuration (`next.config.mjs` & `middleware.ts`)
**Files:**
- Modify: `next.config.mjs`
- Create: `middleware.ts`

**Interfaces:**
- Produces: Strict Content-Security-Policy (CSP), HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
- Blocks malicious probe paths (`.env`, `.git`, `.php`, `wp-admin`).

- [ ] **Step 1: Configure security headers in `next.config.mjs`**
- [ ] **Step 2: Create `middleware.ts` for defense-in-depth header injection and malicious request blocking**

---

### Task 2: Robust Rate Limiting Engine (`lib/security/rate-limit.ts`)
**Files:**
- Create: `lib/security/rate-limit.ts`

**Interfaces:**
- Produces: `checkRateLimit(key: string, limit: number, windowMs: number): { allowed: boolean; remaining: number; resetTime: number }`
- Produces: `getClientIp(req: NextRequest): string`

- [ ] **Step 1: Implement memory-efficient sliding-window rate limiter with automated bucket cleanup**
- [ ] **Step 2: Implement multi-header client IP resolver (handling Proxies / Cloudflare / Vercel)**

---

### Task 3: Input Sanitization & SSRF Protection (`lib/security/sanitize.ts`)
**Files:**
- Create: `lib/security/sanitize.ts`

**Interfaces:**
- Produces: `sanitizeString(val: unknown, maxLen?: number): string`
- Produces: `isValidSafeUrl(url: string): { valid: boolean; reason?: string }`
- Produces: `isValidEmail(email: string): boolean`
- Produces: `verifyOrigin(req: NextRequest): boolean`

- [ ] **Step 1: Implement XSS-safe text sanitization, HTML entity escaping, and length capping**
- [ ] **Step 2: Implement SSRF protection checking against loopback (127.0.0.1, ::1), private IP ranges (10.x, 192.168.x, 172.16.x), and cloud metadata endpoints (169.254.169.254)**
- [ ] **Step 3: Implement CSRF Origin / Referer validation for mutation methods**

---

### Task 4: Admin Authentication & Session Hardening (`lib/auth/admin.ts`)
**Files:**
- Modify: `lib/auth/admin.ts`

**Interfaces:**
- Produces: Timestamped HMAC session tokens: `${timestamp}.${signature}` with 7-day max lifetime
- Uses: `crypto.timingSafeEqual` for constant-time passcode and token verification
- Configures: `sameSite: 'strict'`, `httpOnly: true`, `secure: true` (in production)

- [ ] **Step 1: Upgrade `validateAdminPasscode` with `crypto.timingSafeEqual`**
- [ ] **Step 2: Upgrade session tokens with expiration timestamps and constant-time verification**
- [ ] **Step 3: Update cookie options to `sameSite: 'strict'`**

---

### Task 5: Hardening Public & Admin API Routes
**Files:**
- Modify: `app/api/admin/login/route.ts`
- Modify: `app/api/agents/submit/route.ts`
- Modify: `app/api/advertise/route.ts`
- Modify: `app/api/agents/[slug]/upvote/route.ts`

**Interfaces:**
- Consumes: `checkRateLimit`, `sanitizeString`, `isValidSafeUrl`, `isValidEmail`, `verifyOrigin`

- [ ] **Step 1: Protect `/api/admin/login` with strict brute-force rate limit (5 attempts / 15 min)**
- [ ] **Step 2: Protect `/api/agents/submit` with rate limit (5 / hr), input sanitization, and SSRF URL checks**
- [ ] **Step 3: Protect `/api/advertise` with rate limit (10 / hr), email validation, and text sanitization**
- [ ] **Step 4: Protect `/api/agents/[slug]/upvote` with rate limit (30 / min) and origin verification**

---

### Task 6: Verification & End-to-End Security Testing
**Files:**
- Create: `scripts/verify-security.mjs`

- [ ] **Step 1: Build the project (`npm run build`) to ensure 0 build errors**
- [ ] **Step 2: Run security test suite verifying headers, rate limiting, SSRF rejection, and brute-force protection**
