import { redirect } from 'next/navigation';
import { getServerUser } from '@/app/shared/lib/get-server-user';

export default async function DashboardPage() {
  const user = await getServerUser();

  if (!user) {
    redirect('/login');
  }

  // Redirect to role-specific dashboard
  if (user.role === 'creator') {
    redirect('/creator/dashboard');
  }

  if (user.role === 'brand') {
    redirect('/brand/dashboard');
  }

  // Fallback for users without role
  redirect('/onboarding/role-selection');
}
