export interface Campaign {
  id: string;
  brandId: string;
  name: string;
  description: string;
  budget: number;
  goals: string[];
  targetAudience: string;
  platforms: string[];
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  createdAt: string;
}

export interface CampaignAllocation {
  id: string;
  campaignId: string;
  creatorId: string;
  allocatedBudget: number;
  currentBudget: number;
  performance: {
    reach: number;
    engagement: number;
    conversions: number;
    ctr: number;
  };
  status: 'pending' | 'accepted' | 'active' | 'completed' | 'declined';
  trackingLink?: string;
  contractAccepted?: boolean;
  contractAcceptedAt?: string;
  createdAt: string;
}

