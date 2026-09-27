import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export const ADMIN_COOKIE_NAME = 'admin_session';

function getAdminSecret(): string {
  return process.env.ADMIN_SECRET_KEY || 'topagents-admin-secret-2026';
}

/**
 * Generates an HMAC-signed token for the admin session.
 */
export function generateAdminSessionToken(): string {
  const secret = getAdminSecret();
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update('topagents_admin_authenticated');
  return hmac.digest('hex');
}

/**
 * Verifies if the provided token matches the expected HMAC signature.
 */
export function verifyAdminSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const expected = generateAdminSessionToken();
    const tokenBuffer = Buffer.from(token);
    const expectedBuffer = Buffer.from(expected);
    if (tokenBuffer.length !== expectedBuffer.length) {
      return false;
    }
    return crypto.timingSafeEqual(tokenBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

/**
 * Verifies if the incoming NextRequest has a valid admin session cookie.
 */
export function isAuthorizedAdmin(req: NextRequest): boolean {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return verifyAdminSessionToken(token);
}

/**
 * Validates the passcode provided by the user against the configured ADMIN_SECRET_KEY.
 */
export function validateAdminPasscode(passcode: string): boolean {
  if (!passcode) return false;
  return passcode.trim() === getAdminSecret().trim();
}

/**
 * Sets the secure HTTP-only session cookie on a NextResponse.
 */
export function attachAdminCookie(res: NextResponse): void {
  const token = generateAdminSessionToken();
  res.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
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
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}
