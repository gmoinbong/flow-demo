'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/app/shared/ui/spinner';

/**
 * OAuth callback page
 * Extracts tokens from URL hash and sets them in httpOnly cookies via API route
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Extract hash fragment from URL
        const hash = window.location.hash.substring(1); // Remove '#'
        
        if (!hash) {
          setError('No authentication data found');
          router.push('/login?error=oauth_invalid');
          return;
        }

        // Parse hash fragment (format: access_token=...&refresh_token=...&user=...&isNewUser=...)
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

        // Parse user data
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

        // Send tokens to API route to set httpOnly cookies
        const response = await fetch('/api/auth/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Important: include cookies in request/response
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

        // Wait a bit to ensure cookies are set
        await new Promise(resolve => setTimeout(resolve, 100));

        // Clear hash from URL
        window.history.replaceState(null, '', '/auth/callback');

        // Cookies are now set via httpOnly cookies from API route
        // Use window.location for full page reload to ensure cookies are sent
        window.location.href = '/dashboard';
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

