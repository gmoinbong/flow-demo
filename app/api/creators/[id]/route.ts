import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '@/app/shared/api/get-access-token';

const backendUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get access token using centralized function
    const accessToken = await getAccessToken(request);

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Proxy request to backend
    const response = await fetch(`${backendUrl}/creators/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: 'Failed to fetch creator' }));
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Creator API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
