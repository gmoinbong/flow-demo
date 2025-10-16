'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getCurrentUser,
  getCampaignsByBrand,
  getAllocationsByCampaign,
} from '@/lib/auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, TrendingUp, Users, DollarSign, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default function CampaignsPage() {
  const [user, setUser] = useState(getCurrentUser());
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== 'brand') {
      router.push('/login');
      return;
    }

    const brandCampaigns = getCampaignsByBrand(user.id);
    setCampaigns(brandCampaigns);
  }, [user, router]);

  if (!user || user.role !== 'brand') {
    return null;
  }

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

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <div className='border-b bg-card'>
        <div className='container mx-auto px-6 py-6'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold'>Campaigns</h1>
              <p className='text-muted-foreground mt-1'>
                Manage and monitor all your influencer campaigns
              </p>
            </div>
            <Link href='/campaigns/new'>
              <Button size='lg'>
                <Plus className='w-5 h-5 mr-2' />
                Create Campaign
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-6 py-8'>
        {/* Stats Overview */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Campaigns
              </CardTitle>
              <BarChart3 className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{campaigns.length}</div>
              <p className='text-xs text-muted-foreground'>
                {activeCampaigns} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Budget
              </CardTitle>
              <DollarSign className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                ${totalBudget.toLocaleString()}
              </div>
              <p className='text-xs text-muted-foreground'>
                Across all campaigns
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Active Creators
              </CardTitle>
              <Users className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{totalCreators}</div>
              <p className='text-xs text-muted-foreground'>
                Working on campaigns
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Avg Performance
              </CardTitle>
              <TrendingUp className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>4.8</div>
              <p className='text-xs text-muted-foreground'>Campaign score</p>
            </CardContent>
          </Card>
        </div>

        {/* Campaigns List */}
        <div className='space-y-4'>
          {campaigns.length === 0 ? (
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
          ) : (
            campaigns.map(campaign => {
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
                <Card
                  key={campaign.id}
                  className='hover:shadow-md transition-shadow'
                >
                  <CardHeader>
                    <div className='flex items-start justify-between'>
                      <div className='flex-1'>
                        <div className='flex items-center gap-3 mb-2'>
                          <CardTitle className='text-xl'>
                            {campaign.name}
                          </CardTitle>
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
                        <CardDescription>
                          {campaign.description}
                        </CardDescription>
                      </div>
                      <Link href={`/campaigns/${campaign.id}`}>
                        <Button variant='outline'>View Details</Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
                      <div>
                        <p className='text-sm text-muted-foreground mb-1'>
                          Budget
                        </p>
                        <p className='font-semibold'>
                          ${campaign.budget.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className='text-sm text-muted-foreground mb-1'>
                          Creators
                        </p>
                        <p className='font-semibold'>{allocations.length}</p>
                      </div>
                      <div>
                        <p className='text-sm text-muted-foreground mb-1'>
                          Total Reach
                        </p>
                        <p className='font-semibold'>
                          {totalReach.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className='text-sm text-muted-foreground mb-1'>
                          Conversions
                        </p>
                        <p className='font-semibold'>{totalConversions}</p>
                      </div>
                      <div>
                        <p className='text-sm text-muted-foreground mb-1'>
                          Duration
                        </p>
                        <p className='font-semibold text-sm'>
                          {new Date(campaign.startDate).toLocaleDateString()} -{' '}
                          {new Date(campaign.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className='flex gap-2 mt-4'>
                      {campaign.platforms.map((platform: string) => (
                        <Badge key={platform} variant='outline'>
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
