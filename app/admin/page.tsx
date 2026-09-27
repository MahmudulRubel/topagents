import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from '@/lib/auth/admin';
import AdminDashboardClient from './AdminDashboardClient';

export const metadata = {
  title: 'Admin Console | topagents.lol',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  const cookieStore = cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  const isAuthenticated = verifyAdminSessionToken(token);
  if (!isAuthenticated) {
    redirect('/admin/login');
  }

  return <AdminDashboardClient />;
}
