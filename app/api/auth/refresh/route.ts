import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  COOKIE_OPTIONS,
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
} from '@/app/shared/lib/cookie-utils';
import { refreshAccessToken } from '@/app/features/auth';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token is required' },
        { status: 401 }
      );
    }

    const backendUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!backendUrl) {
      return NextResponse.json(
        { error: 'Backend URL not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(`${backendUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorResponse = NextResponse.json(
        { error: data.message || 'Token refresh failed' },
        { status: response.status }
      );
      errorResponse.cookies.delete(ACCESS_TOKEN_COOKIE);
      errorResponse.cookies.delete(REFRESH_TOKEN_COOKIE);
      return errorResponse;
    }

    // Return both tokens in response for middleware
    const nextResponse = NextResponse.json({ 
      success: true,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken, // Include in response for middleware
    });

    // Always update access token
    nextResponse.cookies.set(ACCESS_TOKEN_COOKIE, data.accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    // Always update refresh token if backend returned new one (token rotation)
    if (data.refreshToken) {
      nextResponse.cookies.set(REFRESH_TOKEN_COOKIE, data.refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: REFRESH_TOKEN_MAX_AGE,
      });
    }

    return nextResponse;
  } catch (error) {
    console.error('Refresh API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


export async function GET(request: NextRequest) {
  const redirect = request.nextUrl.searchParams.get('redirect');
  if (!redirect) {
    return NextResponse.json({ error: 'Redirect is required' }, { status: 400 });
  }

  const refreshed = await refreshAccessToken();
  if (!refreshed) {
    return NextResponse.json({ error: 'Failed to refresh token' }, { status: 500 });
  }
  return NextResponse.redirect(new URL(redirect, request.url));
}