export type UserRole = 'brand' | 'creator';

export interface ClaimedProfile {
  providerNPI?: string;
  verificationStatus?: 'pending' | 'verified' | 'rejected';
  [key: string]: unknown;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company?: string;
  companySize?: string;
  jobRole?: string;
  // Creator-specific fields
  instagramHandle?: string;
  tiktokHandle?: string;
  youtubeHandle?: string;
  niche?: string[];
  followers?: {
    instagram?: number;
    tiktok?: number;
    youtube?: number;
  };
  onboardingComplete?: boolean;
  // Auth-specific fields
  claimedProfile?: ClaimedProfile;
}

