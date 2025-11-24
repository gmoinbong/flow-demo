import { nextApiClient } from '@/app/shared/api/api-client';

export interface SocialProfile {
  id: string;
  platform: 'instagram' | 'tiktok' | 'youtube';
  username: string;
  profileUrl: string | null;
  followersDeclared: number | null;
  followersVerified: number | null;
  engagementRateDeclared: number | null;
  engagementRateVerified: number | null;
  location: string | null;
  niches: string[] | null;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Creator {
  id: string;
  userId: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  status: 'active' | 'pending' | 'suspended';
  socialProfiles: SocialProfile[];
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
