'use client';

import { Button } from '@/app/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/shared/ui/card';
import { Badge } from '@/app/shared/ui/badge';
import { BarChart3, Plus } from 'lucide-react';
import Link from 'next/link';
import type { Campaign } from '@/app/types';
import { getAllocationsByCampaign } from '../lib/campaign-api';

interface CampaignsListProps {
  campaigns: Campaign[];
}

interface CampaignCardProps {
  campaign: Campaign;
}

function CampaignCard({ campaign }: CampaignCardProps) {
  const allocations = getAllocationsByCampaign(campaign.id);
  const totalReach = allocations.reduce(
    (sum, a) => sum + a.performance.reach,
    0
  );
  const totalConversions = allocations.reduce(
    (sum, a) => sum + a.performance.conversions,
    0
  );

  return (
    <Card className='hover:shadow-md transition-shadow'>
      <CardHeader>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <div className='flex items-center gap-3 mb-2'>
              <CardTitle className='text-xl'>{campaign.name}</CardTitle>
              <Badge
                variant={
                  campaign.status === 'active'
                    ? 'default'
                    : campaign.status === 'completed'
                      ? 'secondary'
                      : 'outline'
                }
              >
                {campaign.status}
              </Badge>
            </div>
            <CardDescription>{campaign.description}</CardDescription>
          </div>
          <Link href={`/campaigns/${campaign.id}`}>
            <Button variant='outline'>View Details</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
          <div>
            <p className='text-sm text-muted-foreground mb-1'>Budget</p>
            <p className='font-semibold'>
              ${(campaign.budget / 100).toLocaleString()}
            </p>
          </div>
          <div>
            <p className='text-sm text-muted-foreground mb-1'>Creators</p>
            <p className='font-semibold'>{allocations.length}</p>
          </div>
          <div>
            <p className='text-sm text-muted-foreground mb-1'>Total Reach</p>
            <p className='font-semibold'>{totalReach.toLocaleString()}</p>
          </div>
          <div>
            <p className='text-sm text-muted-foreground mb-1'>Conversions</p>
            <p className='font-semibold'>{totalConversions}</p>
          </div>
          <div>
            <p className='text-sm text-muted-foreground mb-1'>Duration</p>
            <p className='font-semibold text-sm'>
              {new Date(campaign.startDate).toLocaleDateString()} -{' '}
              {new Date(campaign.endDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {campaign.platforms && campaign.platforms.length > 0 && (
          <div className='flex gap-2 mt-4'>
            {campaign.platforms.map((platform: string) => (
              <Badge key={platform} variant='outline'>
                {platform}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function CampaignsList({ campaigns }: CampaignsListProps) {
  if (campaigns.length === 0) {
    return (
      <Card>
        <CardContent className='flex flex-col items-center justify-center py-16'>
          <BarChart3 className='h-16 w-16 text-muted-foreground mb-4' />
          <h3 className='text-xl font-semibold mb-2'>No campaigns yet</h3>
          <p className='text-muted-foreground text-center max-w-md mb-6'>
            Get started by creating your first influencer campaign. Our AI
            will match you with the perfect creators for your brand.
          </p>
          <Link href='/campaigns/new'>
            <Button size='lg'>
              <Plus className='w-5 h-5 mr-2' />
              Create Your First Campaign
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-4'>
      {campaigns.map(campaign => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
}

