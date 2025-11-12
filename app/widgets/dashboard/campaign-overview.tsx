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
import { Eye, Heart, MessageCircle } from 'lucide-react';
import { useCampaigns } from '@/app/features/campaigns';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/app/shared/lib/utils';

export function CampaignOverview() {
  const { campaigns, isLoading } = useCampaigns();
  const router = useRouter();

  const formatBudget = (budget: number) => {
    return formatCurrency(budget / 100); // Convert cents to dollars
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Active Campaigns</CardTitle>
          <CardDescription>Monitor your campaign performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {[1, 2].map(i => (
              <div
                key={i}
                className='flex items-center justify-between p-4 border rounded-lg'
              >
                <div className='flex-1 space-y-2'>
                  <Skeleton className='h-5 w-48' />
                  <Skeleton className='h-4 w-64' />
                </div>
                <div className='text-right space-y-2'>
                  <Skeleton className='h-4 w-24' />
                  <Skeleton className='h-8 w-24' />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (campaigns.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Active Campaigns</CardTitle>
          <CardDescription>Monitor your campaign performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='text-center py-8 text-muted-foreground'>
            <p>No campaigns yet</p>
            <Button
              variant='outline'
              size='sm'
              className='mt-4'
              onClick={() => router.push('/campaigns/new')}
            >
              Create Campaign
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Campaigns</CardTitle>
        <CardDescription>Monitor your campaign performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {campaigns.map(campaign => (
            <div
              key={campaign.id}
              className='flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors'
            >
              <div className='flex-1'>
                <div className='flex items-center space-x-3 mb-2'>
                  <h3 className='font-semibold'>{campaign.name}</h3>
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
                <div className='flex items-center space-x-6 text-sm text-muted-foreground'>
                  <span className='flex items-center'>
                    <Eye className='w-4 h-4 mr-1' />
                    {campaign.platforms?.join(', ') || 'No platforms'}
                  </span>
                  <span className='flex items-center'>
                    <Heart className='w-4 h-4 mr-1' />
                    {campaign.goals?.join(', ') || 'No goals'}
                  </span>
                </div>
              </div>
              <div className='text-right'>
                <div className='text-sm font-medium'>
                  {formatBudget(campaign.budget || 0)}
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  className='mt-2'
                  onClick={() => router.push(`/campaigns/${campaign.id}`)}
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
