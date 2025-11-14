import { NextRequest, NextResponse } from 'next/server';
import {
  COOKIE_OPTIONS,
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
} from '@/app/shared/lib/cookie-utils';
import { transformUserData } from '@/app/features/auth/lib/transform-user-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const accessToken = searchParams.get('accessToken');

    const backendUrl = process.env.NEXT_PUBLIC_BASE_URL;
    let authData: {
      accessToken: string;
      refreshToken: string;
      user: unknown;
    };

    // Option 1: Direct accessToken in query (for client-side OAuth)
    if (accessToken) {
      // Exchange accessToken for our tokens
      const response = await fetch(`${backendUrl}/auth/oauth/google/callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken }),
      });

      if (!response.ok) {
        return NextResponse.redirect(
          new URL('/login?error=oauth_failed', request.url)
        );
      }

      authData = await response.json();
    }
    // Option 2: OAuth code exchange
    else if (code && state) {
      const response = await fetch(
        `${backendUrl}/users/oauth/google/callback?code=${code}&state=${state}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        return NextResponse.redirect(
          new URL('/login?error=oauth_failed', request.url)
        );
      }

      authData = await response.json();
    } else {
      return NextResponse.redirect(
        new URL('/login?error=oauth_invalid', request.url)
      );
    }

    // Validate that tokens exist in response
    if (!authData.accessToken || !authData.refreshToken) {
      console.error('OAuth response missing tokens:', {
        hasAccessToken: !!authData.accessToken,
        hasRefreshToken: !!authData.refreshToken,
        dataKeys: Object.keys(authData),
      });
      return NextResponse.redirect(
        new URL('/login?error=oauth_invalid_response', request.url)
      );
    }

    // Transform user data
    const user = transformUserData(authData.user as never);

    // Set tokens in cookies
    const redirectUrl = new URL('/physicians', request.url);
    const response = NextResponse.redirect(redirectUrl);

    response.cookies.set(ACCESS_TOKEN_COOKIE, authData.accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    response.cookies.set(REFRESH_TOKEN_COOKIE, authData.refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });

    return response;
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/login?error=oauth_failed', request.url)
    );
  }
}
