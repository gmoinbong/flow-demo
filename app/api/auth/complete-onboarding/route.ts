import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ACCESS_TOKEN_COOKIE } from '@/app/shared/lib/cookie-utils';

export async function POST(request: NextRequest) {
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

    const backendUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!backendUrl) {
      console.error('NEXT_PUBLIC_BASE_URL is not set');
      return NextResponse.json(
        { error: 'Backend URL not configured' },
        { status: 500 }
      );
    }

    // Get user info to determine role
    const userResponse = await fetch(`${backendUrl}/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to get user info' },
        { status: userResponse.status }
      );
    }

    const user = await userResponse.json();

    // Get profile and update status to 'active'
    const profileResponse = await fetch(`${backendUrl}/profile`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!profileResponse.ok) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: profileResponse.status }
      );
    }

    const profileData = await profileResponse.json();
    const profile = profileData;

    // Update profile status to active
    const updateResponse = await fetch(`${backendUrl}/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        status: 'active',
      }),
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      return NextResponse.json(
        { error: errorData.message || 'Failed to complete onboarding' },
        { status: updateResponse.status }
      );
    }

    return NextResponse.json({
      message: 'Onboarding completed successfully',
      user: {
        ...user,
        onboardingComplete: true,
      },
    });
  } catch (error) {
    console.error('[Complete Onboarding] API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
