'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/app/features/auth';
import {
  getCampaignById,
  getAllocationsByCreator,
  saveAllocation,
} from '@/app/features/campaigns';
import type { Campaign, CampaignAllocation } from '@/app/types';

export function useCreatorCampaign(campaignId: string) {
  const [user, setUser] = useState(getCurrentUser());
  const [campaign, setCampaign] = useState<Campaign | null>(getCampaignById(campaignId));
  const [allocation, setAllocation] = useState<CampaignAllocation | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== 'creator') {
      router.push('/login');
      return;
    }

    if (!campaign) {
      router.push('/creator/dashboard');
      return;
    }

    // Find the allocation for this creator
    const allocations = getAllocationsByCreator(user.id);
    const foundAllocation = allocations.find(a => a.campaignId === campaignId);
    if (!foundAllocation) {
      router.push('/creator/dashboard');
      return;
    }

    setAllocation(foundAllocation);
  }, [user, campaign, campaignId, router]);

  const submitContent = async (
    contentUrl: string,
    contentNotes: string
  ): Promise<void> => {
    if (!contentUrl || !allocation) return;

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const updatedAllocation = {
      ...allocation,
      contentSubmitted: true,
      contentUrl,
      contentNotes,
      contentSubmittedAt: new Date().toISOString(),
    } as CampaignAllocation & {
      contentSubmitted?: boolean;
      contentUrl?: string;
      contentNotes?: string;
      contentSubmittedAt?: string;
    };

    saveAllocation(updatedAllocation as any);
    setAllocation(updatedAllocation as any);
  };

  const daysRemaining = campaign
    ? Math.ceil(
        (new Date(campaign.endDate).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  const campaignProgress = campaign
    ? Math.min(
        100,
        ((Date.now() - new Date(campaign.startDate).getTime()) /
          (new Date(campaign.endDate).getTime() -
            new Date(campaign.startDate).getTime())) *
          100
      )
    : 0;

  return {
    user,
    campaign,
    allocation,
    submitContent,
    daysRemaining,
    campaignProgress,
  };
}

