import { nextApiClient } from '@/app/shared/api/api-client';

export interface Creator {
  id: string;
  userId: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  status: 'active' | 'pending' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface GetCreatorsParams {
  limit?: number;
  offset?: number;
  status?: 'active' | 'pending' | 'suspended';
}

export interface GetCreatorsResponse {
  creators: Creator[];
  total: number;
  limit: number;
  offset: number;
}

// Creator API - fetch from backend
// Cookies are automatically sent via credentials: 'include'
// Middleware reads cookies and adds Authorization Bearer header
// API routes read token from cookies or Authorization header
export async function fetchCreators(
  params?: GetCreatorsParams
): Promise<GetCreatorsResponse> {
  const queryParams = new URLSearchParams();
  if (params?.limit) queryParams.set('limit', params.limit.toString());
  if (params?.offset) queryParams.set('offset', params.offset.toString());
  if (params?.status) queryParams.set('status', params.status);

  const queryString = queryParams.toString();
  const endpoint = `/api/creators${queryString ? `?${queryString}` : ''}`;

  const response = await nextApiClient<GetCreatorsResponse>(endpoint);
  return response;
}

export async function fetchCreatorById(id: string): Promise<Creator> {
  const response = await nextApiClient<Creator>(`/api/creators/${id}`);
  return response;
}
