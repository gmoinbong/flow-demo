import type { Campaign, CampaignAllocation } from '@/app/types';
import { matchCreatorsForCampaign } from '@/app/features/creators/lib/creator-api';

// Campaign helpers
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

// Allocation helpers
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

// Generate unique tracking link
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

// Budget reallocation logic (±25% based on performance)
export function reallocateBudget(campaignId: string): void {
  const allocations = getAllocationsByCampaign(campaignId);
  if (allocations.length === 0) return;

  // Calculate performance scores
  const scores = allocations.map(allocation => {
    const { reach, engagement, conversions } = allocation.performance;
    // Weighted score: 40% reach, 30% engagement, 30% conversions
    const score = reach * 0.4 + engagement * 0.3 + conversions * 0.3;
    return { allocation, score };
  });

  // Sort by score
  scores.sort((a, b) => b.score - a.score);

  // Get top and bottom performers
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

export function createAllocationsForCampaign(
  campaign: Campaign,
  topN = 5
): CampaignAllocation[] {
  const matches = matchCreatorsForCampaign(campaign);
  const topMatches = matches.slice(0, topN);

  // Parse budget range
  const budgetStr = campaign.budget.toString();
  let totalBudget = 25000; // default
  if (budgetStr.includes('-')) {
    const [min, max] = budgetStr
      .split('-')
      .map(s => Number.parseInt(s.replace(/\D/g, '')));
    totalBudget = (min + max) / 2;
  } else {
    totalBudget = Number.parseInt(budgetStr.replace(/\D/g, '')) || 25000;
  }

  // Allocate budget proportionally based on scores
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
    // Calculate CTR
    allocation.performance.ctr =
      (allocation.performance.conversions / allocation.performance.reach) * 100;
    allocations.push(allocation);
    saveAllocation(allocation);
  });

  return allocations;
}
