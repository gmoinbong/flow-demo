import type { Campaign, CampaignAllocation } from '@/app/types';
import { nextApiClient } from '@/app/shared/api/api-client';
import { fetchCreators } from '@/app/features/creators/lib/creator-api';
import type { Creator } from '@/app/features/creators/lib/creator-api';

export async function fetchCampaigns(): Promise<Campaign[]> {
  const response = await nextApiClient<Campaign[]>('/api/campaigns');
  return Array.isArray(response) ? response : [];
}

export async function fetchCampaignById(id: string): Promise<Campaign> {
  const response = await nextApiClient<Campaign>(`/campaigns/${id}`);
  return response;
}

export interface CreateCampaignDto {
  name: string;
  description?: string;
  budget: number; // in cents
  goals: string[];
  targetAudience?: string;
  platforms: string[];
  audienceSize?: 'micro' | 'mid-tier' | 'macro' | 'mega';
  targetLocation?: string;
  startDate: string;
  endDate: string;
  trackingConfig?: {
    requiredHashtags?: string[];
    optionalHashtags?: string[];
    requiredMentions?: string[];
    trackingLinkPattern?: string;
    minMatchConfidence?: number;
  };
}

export interface CreateCampaignResponse {
  id: string;
  name: string;
  status: string;
  createdAt: string;
}

export async function createCampaign(
  data: CreateCampaignDto
): Promise<CreateCampaignResponse> {
  const response = await nextApiClient<CreateCampaignResponse>('/api/campaigns', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response;
}

export function getCampaigns(): Campaign[] {
  if (typeof window === 'undefined') return [];
  const campaignsStr = localStorage.getItem('campaigns');
  return campaignsStr ? JSON.parse(campaignsStr) : [];
}

export function saveCampaign(campaign: Campaign): void {
  const campaigns = getCampaigns();
  const existingIndex = campaigns.findIndex(c => c.id === campaign.id);
  if (existingIndex >= 0) {
    campaigns[existingIndex] = campaign;
  } else {
    campaigns.push(campaign);
  }
  localStorage.setItem('campaigns', JSON.stringify(campaigns));
}

export function getCampaignById(id: string): Campaign | null {
  const campaigns = getCampaigns();
  return campaigns.find(c => c.id === id) || null;
}

export function getCampaignsByBrand(brandId: string): Campaign[] {
  return getCampaigns().filter(c => c.brandId === brandId);
}

export function getAllocations(): CampaignAllocation[] {
  if (typeof window === 'undefined') return [];
  const allocationsStr = localStorage.getItem('allocations');
  return allocationsStr ? JSON.parse(allocationsStr) : [];
}

export function saveAllocation(allocation: CampaignAllocation): void {
  const allocations = getAllocations();
  const existingIndex = allocations.findIndex(a => a.id === allocation.id);
  if (existingIndex >= 0) {
    allocations[existingIndex] = allocation;
  } else {
    allocations.push(allocation);
  }
  localStorage.setItem('allocations', JSON.stringify(allocations));
}

export function getAllocationsByCampaign(
  campaignId: string
): CampaignAllocation[] {
  return getAllocations().filter(a => a.campaignId === campaignId);
}

export function getAllocationsByCreator(
  creatorId: string
): CampaignAllocation[] {
  return getAllocations().filter(a => a.creatorId === creatorId);
}

export function acceptContract(allocationId: string): void {
  const allocations = getAllocations();
  const allocation = allocations.find(a => a.id === allocationId);
  if (allocation) {
    allocation.contractAccepted = true;
    allocation.contractAcceptedAt = new Date().toISOString();
    allocation.status = 'active';
    saveAllocation(allocation);
  }
}

export function declineContract(allocationId: string): void {
  const allocations = getAllocations();
  const allocation = allocations.find(a => a.id === allocationId);
  if (allocation) {
    allocation.status = 'declined' as any;
    saveAllocation(allocation);
  }
}

export function generateTrackingLink(
  campaignId: string,
  creatorId: string
): string {
  const baseUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://app.influencehub.com';
  const trackingCode = `${campaignId.slice(0, 8)}-${creatorId.slice(0, 8)}`;
  return `${baseUrl}/track/${trackingCode}`;
}

export function reallocateBudget(campaignId: string): void {
  const allocations = getAllocationsByCampaign(campaignId);
  if (allocations.length === 0) return;

  const scores = allocations.map(allocation => {
    const { reach, engagement, conversions } = allocation.performance;
    const score = reach * 0.4 + engagement * 0.3 + conversions * 0.3;
    return { allocation, score };
  });

  scores.sort((a, b) => b.score - a.score);

  const topPerformers = scores.slice(0, Math.ceil(scores.length * 0.3));
  const bottomPerformers = scores.slice(-Math.ceil(scores.length * 0.3));

  // Reallocate: +25% to top, -25% from bottom
  topPerformers.forEach(({ allocation }) => {
    allocation.currentBudget = allocation.allocatedBudget * 1.25;
    saveAllocation(allocation);
  });

  bottomPerformers.forEach(({ allocation }) => {
    allocation.currentBudget = allocation.allocatedBudget * 0.75;
    saveAllocation(allocation);
  });
}

interface CreatorMatch {
  creator: Creator;
  score: number;
}

async function matchCreatorsForCampaign(
  campaign: Campaign
): Promise<CreatorMatch[]> {
  const { creators } = await fetchCreators({ status: 'active', limit: 100 });

  const matches: CreatorMatch[] = [];

  for (const creator of creators) {
    let score = 0;

    if (campaign.platforms && campaign.platforms.length > 0) {
      const normalizedCampaignPlatforms = campaign.platforms.map(p => p.toLowerCase());
      const hasMatchingPlatform = creator.socialProfiles.some(profile =>
        normalizedCampaignPlatforms.includes(profile.platform.toLowerCase())
      );
      if (hasMatchingPlatform) {
        score += 30;
      }
    } else {
      score += 10;
    }

    if (campaign.targetAudience && creator.socialProfiles.length > 0) {
      const targetLower = campaign.targetAudience.toLowerCase();
      const primaryProfile = creator.socialProfiles.find(p => p.isPrimary) || creator.socialProfiles[0];
      const niches = primaryProfile.niches || [];
      
      const matchingNiches = niches.filter(niche =>
        targetLower.includes(niche.toLowerCase()) || niche.toLowerCase().includes(targetLower)
      );
      
      if (matchingNiches.length > 0) {
        score += matchingNiches.length * 20;
      }
    }

    const primaryProfile = creator.socialProfiles.find(p => p.isPrimary) || creator.socialProfiles[0];
    if (primaryProfile) {
      const followers = primaryProfile.followersVerified || primaryProfile.followersDeclared || 0;
      if (followers > 0) {
        score += Math.min(Math.log10(followers + 1) * 10, 30);
      }
    }

    if (primaryProfile) {
      const engagementRate = primaryProfile.engagementRateVerified || primaryProfile.engagementRateDeclared || 0;
      if (engagementRate > 0) {
        score += Math.min(engagementRate * 2, 20);
      }
    }

    if (creator.status === 'active') {
      score += 10;
    }

    matches.push({ creator, score });
  }

  matches.sort((a, b) => b.score - a.score);

  return matches;
}

export async function createAllocationsForCampaign(
  campaign: Campaign,
  topN = 5
): Promise<CampaignAllocation[]> {
  const matches = await matchCreatorsForCampaign(campaign);
  const topMatches = matches.slice(0, topN);

  const budgetStr = campaign.budget.toString();
  let totalBudget = 25000;
  if (budgetStr.includes('-')) {
    const [min, max] = budgetStr
      .split('-')
      .map(s => Number.parseInt(s.replace(/\D/g, '')));
    totalBudget = (min + max) / 2;
  } else {
    totalBudget = Number.parseInt(budgetStr.replace(/\D/g, '')) || 25000;
  }

  const totalScore = topMatches.reduce((sum, m) => sum + m.score, 0);
  const allocations: CampaignAllocation[] = [];

  topMatches.forEach(match => {
    const budgetShare = (match.score / totalScore) * totalBudget;
    const allocation: CampaignAllocation = {
      id: `alloc_${Date.now()}_${match.creator.id}`,
      campaignId: campaign.id,
      creatorId: match.creator.id,
      allocatedBudget: Math.round(budgetShare),
      currentBudget: Math.round(budgetShare),
      performance: {
        reach: Math.floor(Math.random() * 10000) + 5000,
        engagement: Math.floor(Math.random() * 500) + 200,
        conversions: Math.floor(Math.random() * 50) + 10,
        ctr: 0,
      },
      status: 'pending',
      trackingLink: generateTrackingLink(campaign.id, match.creator.id),
      contractAccepted: false,
      createdAt: new Date().toISOString(),
    };
    allocation.performance.ctr =
      (allocation.performance.conversions / allocation.performance.reach) * 100;
    allocations.push(allocation);
    saveAllocation(allocation);
  });

  return allocations;
}
