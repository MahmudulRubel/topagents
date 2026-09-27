import { NextRequest, NextResponse } from 'next/server';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory bucket store
const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup stale buckets periodically (every 5 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000).unref?.();
}

/**
 * Extracts client IP address accurately across proxies, Cloudflare, and Next.js runtimes.
 */
export function getClientIp(req: NextRequest): string {
  // 1. Cloudflare header
  const cfIp = req.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();

  // 2. Standard X-Real-IP
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  // 3. X-Forwarded-For (first IP in chain)
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0].trim();
    if (firstIp) return firstIp;
  }

  // 4. NextRequest ip (if available)
  if (req.ip) return req.ip;

  return '127.0.0.1';
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfterSeconds: number;
}

/**
 * Fixed / sliding window rate limiter.
 *
 * @param key Unique identifier (e.g. `login:${ip}` or `submit:${ip}`)
 * @param limit Maximum requests allowed in the window
 * @param windowMs Time window in milliseconds
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const existing = rateLimitStore.get(key);

  if (!existing || now > existing.resetTime) {
    const resetTime = now + windowMs;
    rateLimitStore.set(key, { count: 1, resetTime });
    return {
      allowed: true,
      limit,
      remaining: limit - 1,
      resetTime,
      retryAfterSeconds: Math.ceil(windowMs / 1000),
    };
  }

  existing.count += 1;
  const remaining = Math.max(0, limit - existing.count);
  const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetTime - now) / 1000));

  if (existing.count > limit) {
    return {
      allowed: false,
      limit,
      remaining: 0,
      resetTime: existing.resetTime,
      retryAfterSeconds,
    };
  }

  return {
    allowed: true,
    limit,
    remaining,
    resetTime: existing.resetTime,
    retryAfterSeconds,
  };
}

/**
 * Standard HTTP 429 response helper with RFC rate limit headers.
 */
export function createRateLimitResponse(result: RateLimitResult): NextResponse {
  return NextResponse.json(
    {
      error: 'Too many requests. Please slow down and try again later.',
      retryAfter: result.retryAfterSeconds,
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(result.retryAfterSeconds),
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(Math.ceil(result.resetTime / 1000)),
      },
    }
  );
}
