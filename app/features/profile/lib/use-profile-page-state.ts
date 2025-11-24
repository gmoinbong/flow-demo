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
    // Wait for auth and profile to load
    if (isAuthLoading || isProfileLoading) {
      return;
    }

    // If user is not authenticated, redirect to login
    if (!user) {
      router.push('/login?redirect=/profile');
      return;
    }

    // If profile not found (404) but user exists, redirect to onboarding
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
        // If no specific onboarding redirect, go to general onboarding
        router.replace('/onboarding');
        return;
      }
    }

    // Profile status is not related to onboarding completion
    // Status is for campaign participation (active/pending/suspended)
    // Onboarding completion is determined by user.onboardingComplete field
  }, [user, isAuthLoading, profileData, isProfileLoading, error, router]);

  // Determine page state
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

  // Fallback to loading if no data yet
  return { type: 'loading' };
}