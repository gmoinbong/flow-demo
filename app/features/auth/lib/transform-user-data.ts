import type { User } from '@/app/types';

interface BackendUser {
  id?: string;
  _id?: { $oid?: string } | string;
  email: string;
  firstName?: string;
  first_name?: string;
  lastName?: string;
  last_name?: string;
  name?: string;
  role?: string;
  claimedProfile?: {
    providerNPI?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export function transformUserData(backendUser: BackendUser): User {
  let id = backendUser.id;
  if (!id && backendUser._id) {
    if (typeof backendUser._id === 'string') {
      id = backendUser._id;
    } else if (backendUser._id.$oid) {
      id = backendUser._id.$oid;
    }
  }

  if (!id) {
    throw new Error('User ID is required');
  }

  // Handle firstName/first_name variations
  const firstName = backendUser.firstName || backendUser.first_name || '';
  const lastName = backendUser.lastName || backendUser.last_name || '';

  // Determine name
  let name = backendUser.name;
  if (!name) {
    if (firstName || lastName) {
      name = `${firstName} ${lastName}`.trim();
    } else {
      name = backendUser.email.split('@')[0];
    }
  }

  return {
    id,
    email: backendUser.email,
    name,
    role: (backendUser.role as 'brand' | 'creator') || 'brand',
    company: backendUser.company as string | undefined,
    companySize: backendUser.companySize as string | undefined,
    jobRole: backendUser.jobRole as string | undefined,
    instagramHandle: backendUser.instagramHandle as string | undefined,
    tiktokHandle: backendUser.tiktokHandle as string | undefined,
    youtubeHandle: backendUser.youtubeHandle as string | undefined,
    niche: backendUser.niche as string[] | undefined,
    followers: backendUser.followers as
      | {
          instagram?: number;
          tiktok?: number;
          youtube?: number;
        }
      | undefined,
    onboardingComplete: backendUser.onboardingComplete as boolean | undefined,
  };
}
