import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '@/app/shared/api/get-access-token';

const backendUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function GET(request: NextRequest) {
  try {
    // Get access token using centralized function
    const accessToken = await getAccessToken(request);

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');
    const status = searchParams.get('status');

    // Build query string
    const queryParams = new URLSearchParams();
    if (limit) queryParams.set('limit', limit);
    if (offset) queryParams.set('offset', offset);
    if (status) queryParams.set('status', status);

    const queryString = queryParams.toString();
    const url = `${backendUrl}/creators${queryString ? `?${queryString}` : ''}`;

    // Proxy request to backend
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: 'Failed to fetch creators' }));
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Creators API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
