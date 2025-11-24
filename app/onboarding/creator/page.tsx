import { redirect } from 'next/navigation';
import { CreatorOnboardingFlow } from '@/app/features/onboarding';
import { getServerUser, getServerProfile } from '@/app/shared/lib/get-server-user';

export default async function CreatorOnboardingPage() {
  // Check user status on server before rendering
  const user = await getServerUser();

  // If onboarding is already complete, redirect to dashboard
  if (user?.onboardingComplete === true) {
    redirect('/creator/dashboard');
  }

  // If user has no role, redirect to role selection
  if (user && !user.role) {
    redirect('/onboarding/role-selection');
  }

  // If user is not creator, redirect to brand onboarding
  if (user?.role && user.role !== 'creator') {
    redirect('/onboarding');
  }

  // For creator users: if profile exists, onboarding is complete (even if flag not set)
  // Check profile only if onboardingComplete is not explicitly true
  if (user?.role === 'creator' && user.onboardingComplete !== true) {
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
