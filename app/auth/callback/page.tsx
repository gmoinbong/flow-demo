'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/app/shared/ui/spinner';
import { getOnboardingRedirect } from '@/app/features/auth';
import type { User } from '@/app/types';


export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      try {
        const hash = window.location.hash.substring(1); // Remove '#'
        
        if (!hash) {
          setError('No authentication data found');
          router.push('/login?error=oauth_invalid');
          return;
        }

        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const userStr = params.get('user');
        const isNewUserStr = params.get('isNewUser');

        if (!accessToken || !refreshToken) {
          setError('Missing authentication tokens');
          router.push('/login?error=oauth_invalid');
          return;
        }

        let user = null;
        let isNewUser = false;
        
        if (userStr) {
          try {
            user = JSON.parse(decodeURIComponent(userStr));
          } catch (e) {
            console.error('Failed to parse user data:', e);
          }
        }

        if (isNewUserStr) {
          isNewUser = isNewUserStr === 'true';
        }

        const response = await fetch('/api/auth/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            accessToken,
            refreshToken,
            user,
            isNewUser,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          setError(errorData.error || 'Failed to process authentication');
          router.push('/login?error=oauth_failed');
          return;
        }

        // Wait for cookies to be set and visible to subsequent requests
        await new Promise(resolve => setTimeout(resolve, 1000));

        window.history.replaceState(null, '', '/auth/callback');

        let fullUser: User | null = null;
        try {
          const userResponse = await fetch('/api/auth/me', {
            credentials: 'include',
          });
          if (userResponse.ok) {
            fullUser = await userResponse.json();
          } else {
            // If first attempt fails, retry once after delay
            await new Promise(resolve => setTimeout(resolve, 500));
            const retryResponse = await fetch('/api/auth/me', {
              credentials: 'include',
            });
            if (retryResponse.ok) {
              fullUser = await retryResponse.json();
            }
          }
        } catch (err) {
          console.error('Failed to fetch user data:', err);
        }

        const onboardingRedirect = getOnboardingRedirect(fullUser);
        const redirectPath = onboardingRedirect || '/dashboard';

        window.location.href = redirectPath;
      } catch (err) {
        console.error('OAuth callback processing error:', err);
        setError('An unexpected error occurred');
        router.push('/login?error=oauth_failed');
      }
    };

    processCallback();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Spinner className="mx-auto mb-4" />
        <p className="text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  );
}

