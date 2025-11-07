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
  let response = await fetch(`${backendUrl}/auth/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

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

    let accessToken = request.headers.get('x-access-token');

    if (!accessToken) {
      accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
    }

    if (!accessToken) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader?.startsWith('Bearer ')) {
        accessToken = authHeader.substring(7);
      }
    }

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const backendUrl = process.env.NEXT_PUBLIC_BASE_URL as string;
    let userData: unknown;
    let fetchError: Error | null = null;

    try {
      userData = await fetchUserData(accessToken, backendUrl);
    } catch (error) {
      fetchError =
        error instanceof Error ? error : new Error('Failed to fetch user');
    }

    if (fetchError) {
      const errorStatus = (fetchError as Error & { status?: number }).status;
      if (errorStatus === 404) {
        console.error('User endpoint not found (404), but token is valid');
        return NextResponse.json(
          { error: 'User endpoint not found' },
          { status: 404 }
        );
      }

      const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
      if (refreshToken) {
        const refreshData = await refreshTokens(refreshToken, backendUrl);

        if (refreshData) {
          try {
            userData = await fetchUserData(refreshData.accessToken, backendUrl);
            accessToken = refreshData.accessToken;

            const nextResponse = NextResponse.json(
              transformUserData(userData as never)
            );

            nextResponse.cookies.set(
              ACCESS_TOKEN_COOKIE,
              refreshData.accessToken,
              {
                ...COOKIE_OPTIONS,
                maxAge: ACCESS_TOKEN_MAX_AGE,
              }
            );

            if (refreshData.refreshToken) {
              nextResponse.cookies.set(
                REFRESH_TOKEN_COOKIE,
                refreshData.refreshToken,
                {
                  ...COOKIE_OPTIONS,
                  maxAge: REFRESH_TOKEN_MAX_AGE,
                }
              );
            }

            return nextResponse;
          } catch (retryError) {
            console.error('Retry after refresh failed:', retryError);
            return NextResponse.json(
              { error: 'Failed to fetch user data' },
              { status: 500 }
            );
          }
        }
      }

      console.error('Auth error, refresh failed or no refresh token');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = transformUserData(userData as never);

    return NextResponse.json(user);
  } catch (error) {
    console.error('Me API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
