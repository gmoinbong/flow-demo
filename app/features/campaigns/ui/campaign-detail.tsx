'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/shared/ui/card';
import { Badge } from '@/app/shared/ui/badge';
import { Button } from '@/app/shared/ui/button';
import { Skeleton } from '@/app/shared/ui/skeleton';
import { ArrowLeft, Calendar, DollarSign, Target, Globe } from 'lucide-react';
import { useCampaign } from '@/app/features/campaigns';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/app/shared/lib/utils';

interface CampaignDetailProps {
  campaignId: string;
}

export function CampaignDetail({ campaignId }: CampaignDetailProps) {
  const { campaign, isLoading, error } = useCampaign(campaignId);
  const router = useRouter();

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center gap-4'>
          <Skeleton className='h-10 w-10' />
          <Skeleton className='h-8 w-64' />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className='h-6 w-48' />
            <Skeleton className='h-4 w-96' />
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-3/4' />
              <Skeleton className='h-4 w-1/2' />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className='space-y-6'>
        <Button variant='ghost' onClick={() => router.back()} className='gap-2'>
          <ArrowLeft className='w-4 h-4' />
          Back
        </Button>
        <Card>
          <CardContent className='py-8 text-center text-muted-foreground'>
            <p>Campaign not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <Button variant='ghost' size='icon' onClick={() => router.back()}>
          <ArrowLeft className='w-4 h-4' />
        </Button>
        <div>
          <h1 className='text-3xl font-bold'>{campaign.name}</h1>
          <div className='flex items-center gap-2 mt-2'>
            <Badge
              variant={
                campaign.status === 'active'
                  ? 'default'
                  : campaign.status === 'draft'
                    ? 'secondary'
                    : 'outline'
              }
            >
              {campaign.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
            <CardDescription>Overview of campaign information</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {campaign.description && (
              <div>
                <p className='text-sm text-muted-foreground mb-1'>
                  Description
                </p>
                <p>{campaign.description}</p>
              </div>
            )}

            <div className='grid grid-cols-2 gap-4'>
              <div className='flex items-center gap-2'>
                <DollarSign className='w-4 h-4 text-muted-foreground' />
                <div>
                  <p className='text-sm text-muted-foreground'>Budget</p>
                  <p className='font-semibold'>
                    {formatCurrency((campaign.budget || 0) / 100)}
                  </p>
                </div>
              </div>

              {campaign.currentBudget && (
                <div className='flex items-center gap-2'>
                  <DollarSign className='w-4 h-4 text-muted-foreground' />
                  <div>
                    <p className='text-sm text-muted-foreground'>
                      Current Budget
                    </p>
                    <p className='font-semibold'>
                      {formatCurrency(campaign.currentBudget / 100)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className='flex items-center gap-2'>
              <Calendar className='w-4 h-4 text-muted-foreground' />
              <div>
                <p className='text-sm text-muted-foreground'>Duration</p>
                <p className='font-semibold'>
                  {formatDate(campaign.startDate)} -{' '}
                  {formatDate(campaign.endDate)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campaign Goals</CardTitle>
            <CardDescription>Objectives and targeting</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {campaign.goals && campaign.goals.length > 0 && (
              <div>
                <p className='text-sm text-muted-foreground mb-2'>Goals</p>
                <div className='flex flex-wrap gap-2'>
                  {campaign.goals.map(goal => (
                    <Badge key={goal} variant='outline'>
                      <Target className='w-3 h-3 mr-1' />
                      {goal}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {campaign.platforms && campaign.platforms.length > 0 && (
              <div>
                <p className='text-sm text-muted-foreground mb-2'>Platforms</p>
                <div className='flex flex-wrap gap-2'>
                  {campaign.platforms.map(platform => (
                    <Badge key={platform} variant='secondary'>
                      <Globe className='w-3 h-3 mr-1' />
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


