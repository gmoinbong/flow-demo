import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  COOKIE_OPTIONS,
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
} from '@/app/shared/lib/cookie-utils';
import { transformUserData } from '@/app/features/auth/lib/transform-user-data';

async function refreshTokens(
  refreshToken: string,
  backendUrl: string
): Promise<{ accessToken: string; refreshToken?: string } | null> {
  try {
    const response = await fetch(`${backendUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Refresh tokens error:', error);
    return null;
  }
}

async function fetchUserData(
  accessToken: string,
  backendUrl: string
): Promise<unknown> {
  // Try /profile/me first, then /users/me
  let response = await fetch(`${backendUrl}/profile/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok && response.status === 404) {
    // Fallback to /users/me
    response = await fetch(`${backendUrl}/users/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  if (!response.ok) {
    const error = new Error(`Failed to fetch user: ${response.status}`);
    (error as Error & { status: number }).status = response.status;
    throw error;
  }

  return response.json();
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    let accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const backendUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    let userData: unknown;
    let fetchError: Error | null = null;

    try {
      userData = await fetchUserData(accessToken, backendUrl);
    } catch (error) {
      fetchError = error instanceof Error ? error : new Error('Failed to fetch user');
    }

    // If fetch failed, try to refresh token
    if (fetchError) {
      const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
      if (refreshToken) {
        const refreshData = await refreshTokens(refreshToken, backendUrl);
        
        if (refreshData) {
          // Retry with new token
          try {
            userData = await fetchUserData(refreshData.accessToken, backendUrl);
            accessToken = refreshData.accessToken;

            // Update tokens in response
            const nextResponse = NextResponse.json(
              transformUserData(userData as never)
            );
            
            nextResponse.cookies.set(ACCESS_TOKEN_COOKIE, refreshData.accessToken, {
              ...COOKIE_OPTIONS,
              maxAge: ACCESS_TOKEN_MAX_AGE,
            });

            if (refreshData.refreshToken) {
              nextResponse.cookies.set(REFRESH_TOKEN_COOKIE, refreshData.refreshToken, {
                ...COOKIE_OPTIONS,
                maxAge: REFRESH_TOKEN_MAX_AGE,
              });
            }

            return nextResponse;
          } catch (retryError) {
            // Refresh failed, clear cookies
            const errorResponse = NextResponse.json(
              { error: 'Unauthorized' },
              { status: 401 }
            );
            errorResponse.cookies.delete(ACCESS_TOKEN_COOKIE);
            errorResponse.cookies.delete(REFRESH_TOKEN_COOKIE);
            return errorResponse;
          }
        }
      }

      // Refresh failed or no refresh token, clear cookies
      const errorResponse = NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
      errorResponse.cookies.delete(ACCESS_TOKEN_COOKIE);
      errorResponse.cookies.delete(REFRESH_TOKEN_COOKIE);
      return errorResponse;
    }

    // Transform and return user data
    const user = transformUserData(userData as never);

    // If user has claimedProfile.providerNPI, load provider data
    if (user.claimedProfile?.providerNPI) {
      try {
        const providerResponse = await fetch(
          `${backendUrl}/providers/by-npi?npi=${user.claimedProfile.providerNPI}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (providerResponse.ok) {
          const providerData = await providerResponse.json();
          // Merge provider data if needed
          // user.provider = providerData;
        }
      } catch (providerError) {
        // Provider data loading is optional, don't fail the request
        console.error('Failed to load provider data:', providerError);
      }
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Me API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

