import { NextRequest, NextResponse } from 'next/server';
import {
  COOKIE_OPTIONS,
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
} from '@/app/shared/lib/cookie-utils';

/**
 * OAuth callback handler - sets tokens from hash fragment into httpOnly cookies
 * Called from client-side after OAuth redirect
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accessToken, refreshToken, user, isNewUser } = body;

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { error: 'Missing tokens' },
        { status: 400 }
      );
    }

    // Create JSON response with cookies
    // Cookies must be set in JSON response for fetch() to work properly
    const response = NextResponse.json(
      { success: true, user, isNewUser },
      { status: 200 }
    );

    // Set tokens in httpOnly cookies
    response.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    response.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });

    return response;
  } catch (error) {
    console.error('OAuth callback error:', error);
    const errorUrl = new URL('/login?error=oauth_failed', request.url);
    return NextResponse.redirect(errorUrl);
  }
}

