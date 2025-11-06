import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  COOKIE_OPTIONS,
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
} from '@/app/shared/lib/cookie-utils';
import { getUserIdFromToken } from '@/app/shared/lib/jwt-utils';

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

    // Decode JWT to get userId
    const userId = getUserIdFromToken(refreshToken);
    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    const backendUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${backendUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Clear cookies on refresh failure
      const errorResponse = NextResponse.json(
        { error: data.message || 'Token refresh failed' },
        { status: response.status }
      );
      errorResponse.cookies.delete(ACCESS_TOKEN_COOKIE);
      errorResponse.cookies.delete(REFRESH_TOKEN_COOKIE);
      return errorResponse;
    }

    // Update tokens in cookies
    const nextResponse = NextResponse.json({ success: true });
    
    nextResponse.cookies.set(ACCESS_TOKEN_COOKIE, data.accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

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

