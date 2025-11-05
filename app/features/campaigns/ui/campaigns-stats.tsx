'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/shared/ui/card';
import { BarChart3, DollarSign, TrendingUp, Users } from 'lucide-react';

interface CampaignsStatsProps {
  totalCampaigns: number;
  activeCampaigns: number;
  totalBudget: number;
  totalCreators: number;
}

export function CampaignsStats({
  totalCampaigns,
  activeCampaigns,
  totalBudget,
  totalCreators,
}: CampaignsStatsProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total Campaigns</CardTitle>
          <BarChart3 className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{totalCampaigns}</div>
          <p className='text-xs text-muted-foreground'>{activeCampaigns} active</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total Budget</CardTitle>
          <DollarSign className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>${totalBudget.toLocaleString()}</div>
          <p className='text-xs text-muted-foreground'>Across all campaigns</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Active Creators</CardTitle>
          <Users className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{totalCreators}</div>
          <p className='text-xs text-muted-foreground'>Working on campaigns</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Avg Performance</CardTitle>
          <TrendingUp className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>4.8</div>
          <p className='text-xs text-muted-foreground'>Campaign score</p>
        </CardContent>
      </Card>
    </div>
  );
}

