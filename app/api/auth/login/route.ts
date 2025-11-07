import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  COOKIE_OPTIONS,
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
} from '@/app/shared/lib/cookie-utils';
import { transformUserData } from '@/app/features/auth/lib/transform-user-data';

const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = LoginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const backendUrl = process.env.NEXT_PUBLIC_BASE_URL as string;
    const response = await fetch(`${backendUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result.data),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data.message || data.error || 'Login failed',
          statusCode: response.status,
        },
        { status: response.status }
      );
    }

    if (!data.accessToken || !data.refreshToken) {
      console.error('Login response missing tokens:', {
        hasAccessToken: !!data.accessToken,
        hasRefreshToken: !!data.refreshToken,
        dataKeys: Object.keys(data),
      });
      return NextResponse.json(
        {
          error: 'Invalid response from authentication server',
          statusCode: 500,
        },
        { status: 500 }
      );
    }

    const user = transformUserData(data.user);

    const nextResponse = NextResponse.json({ user });

    nextResponse.cookies.set(ACCESS_TOKEN_COOKIE, data.accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    // Refresh token in httpOnly cookie
    nextResponse.cookies.set(REFRESH_TOKEN_COOKIE, data.refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });

    return nextResponse;
  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
