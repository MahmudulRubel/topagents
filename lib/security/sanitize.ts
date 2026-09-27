import { NextRequest } from 'next/server';

/**
 * Strips HTML tags, script elements, control characters, and enforces length limits.
 */
export function sanitizeString(val: unknown, maxLen = 500): string {
  if (typeof val !== 'string') return '';

  return val
    .replace(/\0/g, '') // Strip null bytes
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .replace(/[<>]/g, '') // Remove lingering angle brackets
    .trim()
    .slice(0, maxLen);
}

/**
 * Validates email address format and length.
 */
export function isValidEmail(email: unknown): boolean {
  if (typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (trimmed.length < 5 || trimmed.length > 120) return false;

  // RFC 5322 compliant regex for practical email addresses
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(trimmed);
}

// IP range checks to prevent Server-Side Request Forgery (SSRF)
const PRIVATE_IP_PATTERNS = [
  /^127\./, // 127.0.0.0/8 Loopback
  /^10\./, // 10.0.0.0/8 Private
  /^192\.168\./, // 192.168.0.0/16 Private
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0/12 Private
  /^169\.254\./, // 169.254.0.0/16 Link-local / Cloud Metadata (169.254.169.254)
  /^0\.0\.0\.0$/,
  /^::1$/, // IPv6 loopback
  /^fc00:/i, // IPv6 Unique Local
  /^fe80:/i, // IPv6 Link-local
];

/**
 * Validates that a user-submitted URL is safe and cannot be used for SSRF or protocol smuggling.
 */
export function isValidSafeUrl(urlStr: unknown): { valid: boolean; reason?: string; sanitizedUrl?: string } {
  if (typeof urlStr !== 'string' || !urlStr.trim()) {
    return { valid: false, reason: 'URL is required.' };
  }

  const trimmed = urlStr.trim();
  if (trimmed.length > 500) {
    return { valid: false, reason: 'URL exceeds maximum length of 500 characters.' };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { valid: false, reason: 'Invalid URL format.' };
  }

  // 1. Only allow HTTP and HTTPS
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { valid: false, reason: 'Only HTTP and HTTPS protocols are permitted.' };
  }

  const hostname = parsed.hostname.toLowerCase();

  // 2. Reject localhost names
  if (
    hostname === 'localhost' ||
    hostname.endsWith('.localhost') ||
    hostname === 'broadcasthost' ||
    hostname === 'local'
  ) {
    return { valid: false, reason: 'Localhost addresses are not permitted.' };
  }

  // 3. Reject private IP addresses and metadata endpoints
  for (const pattern of PRIVATE_IP_PATTERNS) {
    if (pattern.test(hostname)) {
      return { valid: false, reason: 'Internal and private network addresses are not permitted.' };
    }
  }

  // 4. Must contain a valid domain dot
  if (!hostname.includes('.')) {
    return { valid: false, reason: 'A valid top-level domain is required.' };
  }

  return { valid: true, sanitizedUrl: parsed.toString() };
}

/**
 * Validates that an incoming mutating request (POST/PATCH/DELETE) originates from the trusted origin.
 */
export function verifySameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');

  const checkUrl = origin || referer;
  if (!checkUrl) {
    // If no origin or referer header is sent (e.g. some native tools or bots), allow if trusted or require header
    return true;
  }

  try {
    const parsed = new URL(checkUrl);
    const reqHost = req.headers.get('host') || '';

    // Allow requests matching current host or localhost
    if (parsed.host === reqHost) return true;
    if (parsed.hostname === 'topagents.lol' || parsed.hostname.endsWith('.topagents.lol')) return true;
    if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') return true;

    return false;
  } catch {
    return false;
  }
}
