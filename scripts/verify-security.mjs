// Comprehensive Security Verification Suite for topagents.lol
const BASE = process.env.BASE_URL || 'http://localhost:3000';

async function runSecurityTests() {
  console.log('====================================================');
  console.log('   TOPAGENTS.LOL DEFENSE-IN-DEPTH SECURITY SUITE    ');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  // --- Test 1: Security Headers ---
  console.log('--- 1. Testing HTTP Security Headers ---');
  const headRes = await fetch(`${BASE}/`);
  const h = headRes.headers;

  assert(h.get('x-frame-options') === 'DENY', 'X-Frame-Options is DENY (Anti-Clickjacking)');
  assert(h.get('x-content-type-options') === 'nosniff', 'X-Content-Type-Options is nosniff (Anti-MIME Sniffing)');
  assert(h.get('referrer-policy')?.includes('strict-origin'), 'Referrer-Policy is strict-origin');
  assert(h.get('permissions-policy')?.includes('camera=()'), 'Permissions-Policy restricts camera/mic/geo');
  assert(h.get('strict-transport-security')?.includes('max-age'), 'HSTS header configured');
  assert(h.get('content-security-policy')?.includes("frame-ancestors 'none'"), 'CSP frame-ancestors is none');

  // --- Test 2: Scanner & Path Traversal Blocking ---
  console.log('\n--- 2. Testing Malicious Probing & Path Traversal Defense ---');
  const envRes = await fetch(`${BASE}/.env`);
  assert(envRes.status === 403, 'Probing /.env blocked with 403 Forbidden');

  const wpRes = await fetch(`${BASE}/wp-admin`);
  assert(wpRes.status === 403, 'Probing /wp-admin blocked with 403 Forbidden');

  const pmaRes = await fetch(`${BASE}/phpmyadmin`);
  assert(pmaRes.status === 403, 'Probing /phpmyadmin blocked with 403 Forbidden');

  const traversalRes = await fetch(`${BASE}/../../etc/passwd`);
  assert(traversalRes.status === 403 || traversalRes.status === 404, 'Path traversal attempt rejected');

  // --- Test 3: SSRF Protection on Agent Submissions ---
  console.log('\n--- 3. Testing SSRF & Malicious URL Protections ---');
  const ssrfMetaRes = await fetch(`${BASE}/api/agents/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      origin: BASE,
      'x-forwarded-for': `198.51.100.${Math.floor(Math.random() * 200) + 1}`,
    },
    body: JSON.stringify({
      agentName: 'EvilAgent',
      tagline: 'Autonomous agent doing security audit',
      websiteUrl: 'http://169.254.169.254/latest/meta-data',
    }),
  });
  const ssrfMetaJson = await ssrfMetaRes.json();
  assert(
    ssrfMetaRes.status === 400 && ssrfMetaJson.error.includes('Internal and private network'),
    'SSRF attempt to AWS/cloud metadata (169.254.169.254) blocked'
  );

  const ssrfLocalRes = await fetch(`${BASE}/api/agents/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      origin: BASE,
      'x-forwarded-for': `198.51.100.${Math.floor(Math.random() * 200) + 1}`,
    },
    body: JSON.stringify({
      agentName: 'LocalAgent',
      tagline: 'Autonomous agent doing security audit',
      websiteUrl: 'http://localhost:8080/admin',
    }),
  });
  const ssrfLocalJson = await ssrfLocalRes.json();
  assert(
    ssrfLocalRes.status === 400 && ssrfLocalJson.error.includes('Localhost'),
    'SSRF attempt to localhost:8080 blocked'
  );

  // --- Test 4: Advertising Validation & SSRF ---
  console.log('\n--- 4. Testing Advertising Email & URL Validation ---');
  const badEmailRes = await fetch(`${BASE}/api/advertise`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      origin: BASE,
      'x-forwarded-for': `198.51.100.${Math.floor(Math.random() * 200) + 1}`,
    },
    body: JSON.stringify({
      productName: 'Test Product',
      websiteUrl: 'https://example.com',
      email: 'not-an-email',
    }),
  });
  assert(badEmailRes.status === 400, 'Invalid email format rejected with 400');

  // --- Test 5: CSRF Origin Verification ---
  console.log('\n--- 5. Testing CSRF Origin Verification ---');
  const csrfRes = await fetch(`${BASE}/api/agents/test-agent/upvote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      origin: 'https://malicious-attacker-site.com',
    },
    body: JSON.stringify({ action: 'upvote' }),
  });
  assert(csrfRes.status === 403, 'Cross-origin mutating POST from evil domain blocked with 403');

  // --- Test 6: Admin Login Brute-Force Rate Limiting ---
  console.log('\n--- 6. Testing Admin Brute-Force Throttling ---');
  let rateLimitHit = false;
  for (let i = 1; i <= 6; i++) {
    const loginRes = await fetch(`${BASE}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        origin: BASE,
        'x-forwarded-for': '203.0.113.195', // Distinct test IP
      },
      body: JSON.stringify({ passcode: `wrong-guess-${i}` }),
    });

    if (loginRes.status === 429) {
      rateLimitHit = true;
      assert(true, `Brute-force attempt #${i} successfully triggered 429 Too Many Requests`);
      break;
    }
  }
  assert(rateLimitHit, 'Brute-force attacks are strictly throttled after threshold');

  // --- Test 7: Timing-Safe Admin Authentication ---
  console.log('\n--- 7. Testing Admin Authentication & Cookie Hardening ---');
  let validPasscode = process.env.ADMIN_SECRET_KEY;
  if (!validPasscode) {
    try {
      const fs = await import('fs');
      const envText = fs.readFileSync('.env.local', 'utf-8');
      const match = envText.match(/ADMIN_SECRET_KEY=(.*)/);
      if (match) validPasscode = match[1].trim();
    } catch {}
  }
  validPasscode = validPasscode || 'topagents-admin-secret-2026';

  const goodLoginRes = await fetch(`${BASE}/api/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      origin: BASE,
      'x-forwarded-for': '198.51.100.5', // Fresh test IP
    },
    body: JSON.stringify({ passcode: validPasscode }),
  });

  const cookieHeader = goodLoginRes.headers.get('set-cookie') || '';
  assert(goodLoginRes.status === 200, 'Valid admin login succeeds with 200');
  assert(cookieHeader.includes('HttpOnly'), 'Admin cookie has HttpOnly flag');
  assert(/samesite=strict/i.test(cookieHeader), 'Admin cookie has SameSite=Strict flag');

  console.log('\n====================================================');
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runSecurityTests().catch((err) => {
  console.error('Security test runner error:', err);
  process.exit(1);
});
