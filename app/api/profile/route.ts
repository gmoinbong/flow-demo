import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  ACCESS_TOKEN_COOKIE,
} from '@/app/shared/lib/cookie-utils';

export async function GET(request: NextRequest) {
  try {
    const backendUrl =
      process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const cookieStore = await cookies();

    // Get auth token from cookies
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

    const response = await fetch(`${backendUrl}/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to fetch profile' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Profile API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const backendUrl =
      process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const cookieStore = await cookies();

    // Get auth token from cookies
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

    const response = await fetch(`${backendUrl}/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to update profile' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Profile API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
