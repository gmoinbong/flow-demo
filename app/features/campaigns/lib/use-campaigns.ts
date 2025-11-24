'use client';
import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/features/auth';
import { fetchCampaigns, fetchCampaignById, getAllocationsByCampaign } from './campaign-api';
import type { Campaign } from '@/app/types';

export function useCampaigns() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const userRole = useMemo(() => user?.role, [user?.role]);
  const isBrand = userRole === 'brand';

  const { data: campaignsData, isLoading, error } = useQuery({
    queryKey: ['campaigns'],
    queryFn: fetchCampaigns,
    enabled: !!user && isBrand && !isAuthLoading,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const campaigns = Array.isArray(campaignsData) ? campaignsData : [];

  useEffect(() => {
    if (!isAuthLoading && user && !isBrand) {
      router.push('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBrand, isAuthLoading]);

  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;

  const totalBudget = campaigns.reduce((sum, c) => {
    return sum + (c.budget || 0);
  }, 0);

  const totalCreators = campaigns.reduce((sum, c) => {
    return sum + getAllocationsByCampaign(c.id).length;
  }, 0);

  return {
    user,
    campaigns,
    isLoading,
    error,
    activeCampaigns,
    totalBudget,
    totalCreators,
  };
}

export function useCampaign(campaignId: string) {
  const { data: campaign, isLoading, error } = useQuery({
    queryKey: ['campaign', campaignId],
    queryFn: () => fetchCampaignById(campaignId),
    enabled: !!campaignId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  return {
    campaign,
    isLoading,
    error,
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
