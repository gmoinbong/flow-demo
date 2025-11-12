'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchCreators, fetchCreatorById } from './creator-api';
import type { GetCreatorsParams } from './creator-api';

export function useCreators(params?: GetCreatorsParams) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['creators', params],
    queryFn: () => fetchCreators(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  return {
    creators: data?.creators || [],
    total: data?.total || 0,
    limit: data?.limit || 20,
    offset: data?.offset || 0,
    isLoading,
    error,
  };
}

export function useCreator(creatorId: string) {
  const { data: creator, isLoading, error } = useQuery({
    queryKey: ['creator', creatorId],
    queryFn: () => fetchCreatorById(creatorId),
    enabled: !!creatorId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  return {
    creator,
    isLoading,
    error,
  };
}

