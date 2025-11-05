'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/app/features/auth';
import { getCampaignsByBrand, getAllocationsByCampaign } from './campaign-api';
import type { Campaign } from '@/app/types';

export function useCampaigns() {
  const [user, setUser] = useState(getCurrentUser());
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== 'brand') {
      router.push('/login');
      return;
    }

    const brandCampaigns = getCampaignsByBrand(user.id);
    setCampaigns(brandCampaigns);
  }, [user, router]);

  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;

  const totalBudget = campaigns.reduce((sum, c) => {
    const budgetStr = c.budget.toString();
    if (budgetStr.includes('-')) {
      const [min, max] = budgetStr
        .split('-')
        .map((s: string) => Number.parseInt(s.replace(/\D/g, '')));
      return sum + (min + max) / 2;
    }
    return sum + (Number.parseInt(budgetStr.replace(/\D/g, '')) || 0);
  }, 0);

  const totalCreators = campaigns.reduce((sum, c) => {
    return sum + getAllocationsByCampaign(c.id).length;
  }, 0);

  return {
    user,
    campaigns,
    activeCampaigns,
    totalBudget,
    totalCreators,
  };
}

export function useCampaignStats(campaign: Campaign) {
  const allocations = getAllocationsByCampaign(campaign.id);
  const totalReach = allocations.reduce(
    (sum, a) => sum + a.performance.reach,
    0
  );
  const totalConversions = allocations.reduce(
    (sum, a) => sum + a.performance.conversions,
    0
  );

  return {
    allocations,
    totalReach,
    totalConversions,
  };
}
