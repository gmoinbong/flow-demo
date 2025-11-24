'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/app/types';
import type { Profile } from './profile-api';
import { ApiClientError } from '@/app/shared/api/api-client';
import { useAuth } from '@/app/features/auth';
import { useProfile } from './use-profile';
import { getOnboardingRedirect } from '@/app/features/auth';

type PageState =
  | { type: 'loading' }
  | { type: 'unauthorized' }
  | { type: 'not-found' }
  | { type: 'ready'; user: User; profile: Profile };

export function useProfilePageState(): PageState {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { data: profileData, isLoading: isProfileLoading, error } = useProfile();

  useEffect(() => {
    if (isAuthLoading || isProfileLoading) {
      return;
    }

    if (!user) {
      router.push('/login?redirect=/profile');
      return;
    }

    if (error) {
      const statusCode =
        error instanceof ApiClientError
          ? error.statusCode
          : (error as any)?.statusCode;

      if (statusCode === 404) {
        const onboardingRedirect = getOnboardingRedirect(user);
        if (onboardingRedirect) {
          router.replace(onboardingRedirect);
          return;
        }
        router.replace('/onboarding');
        return;
      }
    }

  }, [user, isAuthLoading, profileData, isProfileLoading, error, router]);

  if (isAuthLoading || isProfileLoading) {
    return { type: 'loading' };
  }

  if (!user) {
    return { type: 'unauthorized' };
  }

  if (error) {
    const statusCode =
      error instanceof ApiClientError
        ? error.statusCode
        : (error as any)?.statusCode;

    if (statusCode === 404) {
      return { type: 'not-found' };
    }
  }

  if (profileData?.profile) {
    return {
      type: 'ready',
      user,
      profile: profileData.profile,
    };
  }

  return { type: 'loading' };
}