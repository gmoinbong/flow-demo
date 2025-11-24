import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ACCESS_TOKEN_COOKIE } from '@/app/shared/lib/cookie-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!backendUrl) {
      console.error('NEXT_PUBLIC_BASE_URL is not set');
      return NextResponse.json(
        { error: 'Backend URL not configured' },
        { status: 500 }
      );
    }

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

    const backendUrlFull = `${backendUrl}/creators/complete-onboarding`;
    console.log('[Complete Onboarding] Calling backend:', backendUrlFull);

    const response = await fetch(backendUrlFull, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    console.log('[Complete Onboarding] Backend response status:', response.status);

    const data = await response.json();

    if (!response.ok) {
      console.error('[Complete Onboarding] Backend error:', data);
      return NextResponse.json(
        { error: data.message || data.error || 'Failed to complete onboarding' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[Complete Onboarding] API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

