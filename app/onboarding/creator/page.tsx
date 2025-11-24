import { redirect } from 'next/navigation';
import { CreatorOnboardingFlow } from '@/app/features/onboarding';
import { getServerUser, getServerProfile } from '@/app/shared/lib/get-server-user';

export default async function CreatorOnboardingPage() {
  const user = await getServerUser();

  if (user?.onboardingComplete === true) {
    redirect('/creator/dashboard');
  }

  if (user && !user.role) {
    redirect('/onboarding/role-selection');
  }

  if (user?.role && user.role !== 'creator') {
    redirect('/onboarding');
  }

  if (user?.role === 'creator' && user.onboardingComplete === false) {
    const profileData = await getServerProfile();
    if (profileData?.profile) {
      redirect('/creator/dashboard');
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50'>
      <CreatorOnboardingFlow />
    </div>
  );
}
