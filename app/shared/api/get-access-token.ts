import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { ACCESS_TOKEN_COOKIE } from '@/app/shared/lib/cookie-utils';

/**
 * Centralized function to extract access token from request
 * Checks in order: Authorization header (from middleware) -> x-access-token header -> cookies
 */
export async function getAccessToken(
  request: NextRequest
): Promise<string | null> {
  // First: try Authorization header (set by middleware as Bearer token)
  let accessToken: string | null = null;
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    accessToken = authHeader.substring(7);
  }

  // Second: try x-access-token header (fallback from middleware)
  if (!accessToken) {
    accessToken = request.headers.get('x-access-token');
  }

  // Third: try cookies
  if (!accessToken) {
    const cookieStore = await cookies();
    accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
  }

  return accessToken;
}

