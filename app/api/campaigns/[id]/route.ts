import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '@/app/shared/api/get-access-token';

async function fetchCampaignData(
  accessToken: string,
  backendUrl: string,
  id: string
): Promise<unknown> {
  const url = `${backendUrl}/campaigns/${id}`;
  // Use exact same pattern as fetchUserData in auth/me
  let response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    console.error('[fetchCampaignData] Error response:', errorText);
    const error = new Error(`Failed to fetch campaign: ${response.status}`);
    (error as Error & { status: number }).status = response.status;
    throw error;
  }

  const data = await response.json();   
  return data;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get access token using centralized function
    const accessToken = await getAccessToken(request);

    if (!accessToken) {
      console.error('[Campaigns API] No access token found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const backendUrl = process.env.NEXT_PUBLIC_BASE_URL as string;

    let campaignData: unknown;
    let fetchError: Error | null = null;

    try {
      campaignData = await fetchCampaignData(accessToken, backendUrl, id);
    } catch (error) {
      fetchError =
        error instanceof Error ? error : new Error('Failed to fetch campaign');
      console.error('[Campaigns API] Fetch error:', fetchError);
    }

    if (fetchError) {
      const errorStatus = (fetchError as Error & { status?: number }).status;
      if (errorStatus === 404) {
        console.error('Campaign endpoint not found (404), but token is valid');
        return NextResponse.json(
          { error: 'Campaign not found' },
          { status: 404 }
        );
      }

      console.error('Campaign fetch error:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch campaign' },
        { status: errorStatus || 500 }
      );
    }

    return NextResponse.json(campaignData);
  } catch (error) {
    console.error('Campaign API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
