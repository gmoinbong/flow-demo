import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '@/app/shared/api/get-access-token';

const backendUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function GET(request: NextRequest) {
  try {
    // Get access token using centralized function
    const accessToken = await getAccessToken(request);

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Proxy request to backend
    const response = await fetch(`${backendUrl}/campaigns`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    // Log response for debugging
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error:', response.status, errorText);
    }

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: 'Failed to fetch campaigns' }));
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Campaigns API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
