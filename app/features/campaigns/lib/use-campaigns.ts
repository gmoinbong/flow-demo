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

  // Memoize user role to prevent unnecessary re-renders
  const userRole = useMemo(() => user?.role, [user?.role]);
  const isBrand = userRole === 'brand';

  const { data: campaigns = [], isLoading, error } = useQuery({
    queryKey: ['campaigns'],
    queryFn: fetchCampaigns,
    enabled: !!user && isBrand && !isAuthLoading,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnMount: false, // Prevent refetch on every mount
    refetchOnWindowFocus: false, // Prevent refetch on window focus
  });

  // Redirect if not authenticated or not brand (only once)
  useEffect(() => {
    if (!isAuthLoading && user && !isBrand) {
      router.push('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBrand, isAuthLoading]); // Only depend on role and loading state

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
    staleTime: 5 * 60 * 1000, // 5 minutes
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
