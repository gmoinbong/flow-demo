import { redirect } from 'next/navigation';
import { OnboardingFlow } from '@/app/features/onboarding';
import { getServerUser, getServerProfile } from '@/app/shared/lib/get-server-user';

export default async function OnboardingPage() {
  const user = await getServerUser();

  if (user?.onboardingComplete === true) {
    redirect('/dashboard');
  }

  if (user && !user.role) {
    redirect('/onboarding/role-selection');
  }

  if (user?.role === 'creator') {
    redirect('/onboarding/creator');
  }

  if (user?.role === 'brand' && user.onboardingComplete === false) {
    const profileData = await getServerProfile();
    if (profileData?.profile) {
      redirect('/dashboard');
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50'>
      <OnboardingFlow />
    </div>
  );
}
