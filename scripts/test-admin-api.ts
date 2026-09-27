import { POST as loginPost } from '../app/api/admin/login/route';
import { GET as submissionsGet } from '../app/api/admin/submissions/route';
import { ADMIN_COOKIE_NAME, generateAdminSessionToken } from '../lib/auth/admin';
import { NextRequest } from 'next/server';

async function main() {
  console.log('--- Testing Admin Authentication & API Routes ---');

  // 1. Test invalid login
  const badLoginReq = new NextRequest('http://localhost:3000/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passcode: 'wrong-passcode' }),
  });
  const badLoginRes = await loginPost(badLoginReq);
  if (badLoginRes.status !== 401) {
    throw new Error(`Expected 401 on bad passcode, got ${badLoginRes.status}`);
  }
  console.log('1. Bad login rejected (401) as expected.');

  // 2. Test valid login
  const validPasscode = process.env.ADMIN_SECRET_KEY || 'topagents-admin-secret-2026';
  const goodLoginReq = new NextRequest('http://localhost:3000/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passcode: validPasscode }),
  });
  const goodLoginRes = await loginPost(goodLoginReq);
  if (goodLoginRes.status !== 200) {
    throw new Error(`Expected 200 on good passcode, got ${goodLoginRes.status}`);
  }
  console.log('2. Good login accepted (200) with session cookie.');

  // 3. Test unauthorized submissions fetch
  const unauthReq = new NextRequest('http://localhost:3000/api/admin/submissions');
  const unauthRes = await submissionsGet(unauthReq);
  if (unauthRes.status !== 401) {
    throw new Error(`Expected 401 on unauthorized GET, got ${unauthRes.status}`);
  }
  console.log('3. Unauthorized request blocked (401) as expected.');

  // 4. Test authorized submissions fetch
  const token = generateAdminSessionToken();
  const authReq = new NextRequest('http://localhost:3000/api/admin/submissions', {
    headers: {
      cookie: `${ADMIN_COOKIE_NAME}=${token}`,
    },
  });
  const authRes = await submissionsGet(authReq);
  const data = await authRes.json();
  if (authRes.status !== 200 || !data.success || !Array.isArray(data.submissions)) {
    throw new Error('Authorized GET submissions failed.');
  }
  console.log('4. Authorized request succeeded. Submissions count:', data.submissions.length);
  console.log('Stats:', data.stats);

  console.log('SUCCESS: Admin authentication and endpoints verified!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
