import { redirect } from 'next/navigation';
import { RoleSelection } from '@/app/features/onboarding';
import { getServerUser } from '@/app/shared/lib/get-server-user';

export default async function RoleSelectionPage() {
  const user = await getServerUser();

  if (user?.onboardingComplete === true) {
    const dashboardPath = user.role === 'creator' ? '/creator/dashboard' : '/dashboard';
    redirect(dashboardPath);
  }

  if (user?.role) {
    if (user.role === 'creator') {
      redirect('/onboarding/creator');
    } else {
      redirect('/onboarding');
    }
  }

  return <RoleSelection />;
}


