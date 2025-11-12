export interface Campaign {
  id: string;
  brandId?: string; // Optional - may not be in list response
  name: string;
  description?: string; // Optional - may not be in list response
  budget: number;
  currentBudget?: number; // Optional - may not be in list response
  goals?: string[]; // Optional - may not be in list response
  targetAudience?: string; // Optional - may not be in list response
  platforms?: string[]; // Optional - may not be in list response
  startDate: string | Date;
  endDate: string | Date;
  status: 'draft' | 'active' | 'paused' | 'completed';
  createdAt?: string | Date;
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

