import { redirect } from 'next/navigation';
import { OnboardingFlow } from '@/app/features/onboarding';
import { getServerUser, getServerProfile } from '@/app/shared/lib/get-server-user';

export default async function OnboardingPage() {
  // Check user status on server before rendering
  const user = await getServerUser();

  // If onboarding is already complete, redirect to dashboard
  if (user?.onboardingComplete === true) {
    redirect('/dashboard');
  }

  // If user has no role, redirect to role selection
  if (user && !user.role) {
    redirect('/onboarding/role-selection');
  }

  // If user is creator, redirect to creator onboarding
  if (user?.role === 'creator') {
    redirect('/onboarding/creator');
  }

  // For brand users: if profile exists, onboarding is complete (even if flag not set)
  // Check profile only if onboardingComplete is not explicitly true
  if (user?.role === 'brand' && user.onboardingComplete !== true) {
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
