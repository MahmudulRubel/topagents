import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export const ADMIN_COOKIE_NAME = 'admin_session';

// 7 days session lifetime in milliseconds
const SESSION_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;

function getAdminSecret(): string {
  const secret = process.env.ADMIN_SECRET_KEY;
  if (!secret && process.env.NODE_ENV === 'production') {
    console.warn('[Security Warning] ADMIN_SECRET_KEY is not defined in production environment!');
  }
  return secret || 'topagents-admin-secret-2026';
}

/**
 * Generates an HMAC-signed timestamped token for the admin session.
 * Format: `${expiryTimestamp}.${hmacSignature}`
 */
export function generateAdminSessionToken(): string {
  const secret = getAdminSecret();
  const expiryTimestamp = Date.now() + SESSION_LIFETIME_MS;
  const payload = `admin_auth:${expiryTimestamp}`;

  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const signature = hmac.digest('hex');

  return `${expiryTimestamp}.${signature}`;
}

/**
 * Verifies if the provided token matches the expected HMAC signature and has not expired.
 * Uses constant-time buffer comparison to prevent timing side-channel attacks.
 */
export function verifyAdminSessionToken(token: string | undefined): boolean {
  if (!token || typeof token !== 'string') return false;

  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [expiryStr, signature] = parts;
  const expiry = parseInt(expiryStr, 10);

  if (isNaN(expiry) || Date.now() > expiry) {
    // Session token has expired or is invalid
    return false;
  }

  try {
    const secret = getAdminSecret();
    const payload = `admin_auth:${expiryStr}`;
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);
    const expectedSignature = hmac.digest('hex');

    // SHA-256 hash both signatures to normalize to 32 bytes for timingSafeEqual
    const sigHash = crypto.createHash('sha256').update(signature).digest();
    const expHash = crypto.createHash('sha256').update(expectedSignature).digest();

    return crypto.timingSafeEqual(sigHash, expHash);
  } catch {
    return false;
  }
}

/**
 * Verifies if the incoming NextRequest has a valid and unexpired admin session cookie.
 */
export function isAuthorizedAdmin(req: NextRequest): boolean {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return verifyAdminSessionToken(token);
}

/**
 * Validates the passcode provided by the user against the configured ADMIN_SECRET_KEY.
 * Uses constant-time SHA-256 digest comparison to prevent timing attacks.
 */
export function validateAdminPasscode(passcode: string): boolean {
  if (!passcode || typeof passcode !== 'string') return false;

  const inputHash = crypto.createHash('sha256').update(passcode.trim()).digest();
  const expectedHash = crypto.createHash('sha256').update(getAdminSecret().trim()).digest();

  return crypto.timingSafeEqual(inputHash, expectedHash);
}

/**
 * Sets the secure HTTP-only session cookie on a NextResponse with strict CSRF protection.
 */
export function attachAdminCookie(res: NextResponse): void {
  const token = generateAdminSessionToken();
  res.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict', // Strict CSRF protection for administrative sessions
    path: '/',
    maxAge: Math.floor(SESSION_LIFETIME_MS / 1000), // 7 days in seconds
  });
}

/**
 * Clears the admin session cookie on a NextResponse.
 */
export function detachAdminCookie(res: NextResponse): void {
  res.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
}
