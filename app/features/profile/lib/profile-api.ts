import { nextApiClient } from '@/app/shared/api/api-client';

export interface Profile {
  id: string;
  userId: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  status: 'active' | 'pending' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: string;
  name: string;
  description: string | null;
  websiteUrl: string | null;
  logoUrl: string | null;
  brandType: string | null;
  companySize: string | null;
  userRole: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileResponse {
  profile: Profile;
  brand?: Brand;
}

export async function getProfile(): Promise<ProfileResponse> {
  return nextApiClient<ProfileResponse>('/api/profile', {
    method: 'GET',
  });
}

export async function updateProfile(
  data: Partial<{
    firstName: string;
    lastName: string;
    displayName: string;
    bio: string;
    avatarUrl: string;
  }>
): Promise<Profile> {
  return nextApiClient<Profile>('/api/profile', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

