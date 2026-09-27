import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Known malicious scanner / attack signatures
const BLOCKED_PATH_PATTERNS = [
  /(\.env|\.git|\.aws|\.ssh|\.bak|\.config|\.sql)$/i,
  /(wp-admin|wp-login|wp-includes|xmlrpc\.php|phpmyadmin|pma|adminer)/i,
  /(\.\.[\/\\]|%2e%2e[\/\\])/i, // Path traversal attempts
  /(\/etc\/passwd|\/windows\/win\.ini)/i,
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Proactive scanner & path traversal rejection
  for (const pattern of BLOCKED_PATH_PATTERNS) {
    if (pattern.test(pathname)) {
      return new NextResponse('Access Denied', {
        status: 403,
        headers: {
          'Content-Type': 'text/plain',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    }
  }

  // 2. Add defense-in-depth headers
  const response = NextResponse.next();

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), browsing-topics=()');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
