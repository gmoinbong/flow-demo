'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './use-auth';
import { getOnboardingRedirect } from './onboarding-utils';
import { useProfile } from '@/app/features/profile/lib/use-profile';


export function useRequireOnboarding() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { data: profileData, isLoading: isProfileLoading } = useProfile();
  const router = useRouter();

  useEffect(() => {
    if (isAuthLoading || isProfileLoading) return;

    if (user?.onboardingComplete === true) {
      return;
    }

    if (profileData?.profile) {
      return;
    }

    const onboardingRedirect = getOnboardingRedirect(user);
    if (onboardingRedirect) {
      router.replace(onboardingRedirect);
    }
  }, [user, isAuthLoading, profileData, isProfileLoading, router]);
}


