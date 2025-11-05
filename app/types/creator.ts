export interface Creator {
  id: string;
  name: string;
  email: string;
  role: 'creator';
  instagramHandle?: string;
  tiktokHandle?: string;
  youtubeHandle?: string;
  niche: string[];
  followers: {
    instagram?: number;
    tiktok?: number;
    youtube?: number;
  };
  engagement: number;
  location: string;
  onboardingComplete: boolean;
}

export interface MatchScore {
  creator: Creator;
  score: number;
  reasons: string[];
}

