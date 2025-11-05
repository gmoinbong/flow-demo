'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/shared/ui/card';
import { Badge } from '@/app/shared/ui/badge';
import { Button } from '@/app/shared/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/shared/ui/tabs';
import { CampaignMetrics } from './campaign-metrics';
import { ContentApproval } from './content-approval';
import { CreatorManagement } from './creator-management';
import { PerformanceChart } from './performance-chart';
import { OptimizationSuggestions } from './optimization-suggestions';
import { BudgetReallocation } from './budget-reallocation';
import { ContractManagement } from './contract-management';
import {
  ArrowLeft,
  Pause,
  Settings,
  Share2,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  DollarSign,
} from 'lucide-react';
import Link from 'next/link';
import { getCampaignById } from '@/app/features/campaigns/lib/campaign-api';
import { getAllocationsByCampaign } from '@/app/features/campaigns/lib/campaign-api';
import { getMockCreators } from '@/app/features/creators/lib/creator-api';

interface LiveCampaignDashboardProps {
  campaignId: string;
}

export function LiveCampaignDashboard({
  campaignId,
}: LiveCampaignDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [campaign, setCampaign] = useState<any>(null);
  const [allocations, setAllocations] = useState<any[]>([]);
  const [creators, setCreators] = useState<any[]>([]);

  useEffect(() => {
    // Load campaign data
    const campaignData = getCampaignById(campaignId);
    setCampaign(campaignData);

    // Load allocations
    const allocationData = getAllocationsByCampaign(campaignId);
    setAllocations(allocationData);

    // Load creator details
    const allCreators = getMockCreators();
    setCreators(allCreators);
  }, [campaignId]);

  if (!campaign) {
    return (
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='text-center'>
          <p className='text-muted-foreground'>Loading campaign...</p>
        </div>
      </div>
    );
  }

  const totalReach = allocations.reduce(
    (sum, a) => sum + a.performance.reach,
    0
  );
  const totalEngagement = allocations.reduce(
    (sum, a) => sum + a.performance.engagement,
    0
  );
  const totalConversions = allocations.reduce(
    (sum, a) => sum + a.performance.conversions,
    0
  );
  const totalImpressions = totalReach * 2; // Estimate: 2 impressions per reach
  const engagementRate =
    totalReach > 0 ? (totalEngagement / totalReach) * 100 : 0;
  const avgCTR =
    allocations.length > 0
      ? allocations.reduce((sum, a) => sum + a.performance.ctr, 0) /
        allocations.length
      : 0;
  const spent = allocations.reduce((sum, a) => sum + a.currentBudget, 0);
  const revenue = totalConversions * 23; // Estimate: $23 per conversion
  const roi = spent > 0 ? revenue / spent : 0;

  const activeCreators = allocations.filter(a => a.status === 'active').length;
  const pendingContent = allocations.filter(a => a.status === 'pending').length;
  const approvedContent = allocations.filter(a => a.contractAccepted).length;

  const mockCampaign = {
    ...campaign,
    spent,
    creators: allocations.length,
    activeCreators,
    pendingContent,
    approvedContent,
    totalReach,
    totalImpressions,
    totalEngagements: totalEngagement,
    engagementRate: Number(engagementRate.toFixed(1)),
    clickThroughRate: Number(avgCTR.toFixed(1)),
    conversions: totalConversions,
    revenue: Math.round(revenue),
    roi: Number(roi.toFixed(2)),
  };

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <div className='flex items-center space-x-4'>
          <Button variant='ghost' size='sm' asChild>
            <Link href='/campaigns'>
              <ArrowLeft className='w-4 h-4 mr-2' />
              Back to Campaigns
            </Link>
          </Button>
          <div>
            <h1 className='text-3xl font-bold text-foreground'>
              {campaign.name}
            </h1>
            <div className='flex items-center space-x-4 mt-2'>
              <Badge
                variant={campaign.status === 'active' ? 'default' : 'secondary'}
              >
                {campaign.status}
              </Badge>
              <span className='text-sm text-muted-foreground'>
                {new Date(campaign.startDate).toLocaleDateString()} -{' '}
                {new Date(campaign.endDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className='flex items-center space-x-3'>
          <Button variant='outline' size='sm'>
            <Share2 className='w-4 h-4 mr-2' />
            Share Report
          </Button>
          <Button variant='outline' size='sm'>
            <Settings className='w-4 h-4 mr-2' />
            Settings
          </Button>
          <Button size='sm'>
            <Pause className='w-4 h-4 mr-2' />
            Pause Campaign
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8'>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center space-x-2 mb-2'>
              <Eye className='w-4 h-4 text-blue-500' />
              <span className='text-sm font-medium'>Reach</span>
            </div>
            <div className='text-2xl font-bold'>
              {totalReach >= 1000000
                ? `${(totalReach / 1000000).toFixed(1)}M`
                : `${(totalReach / 1000).toFixed(0)}K`}
            </div>
            <div className='text-xs text-green-600'>Live data</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center space-x-2 mb-2'>
              <Heart className='w-4 h-4 text-red-500' />
              <span className='text-sm font-medium'>Engagement</span>
            </div>
            <div className='text-2xl font-bold'>
              {mockCampaign.engagementRate}%
            </div>
            <div className='text-xs text-muted-foreground'>
              {totalEngagement} total
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center space-x-2 mb-2'>
              <MessageCircle className='w-4 h-4 text-blue-500' />
              <span className='text-sm font-medium'>CTR</span>
            </div>
            <div className='text-2xl font-bold'>
              {mockCampaign.clickThroughRate}%
            </div>
            <div className='text-xs text-muted-foreground'>Avg click rate</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center space-x-2 mb-2'>
              <TrendingUp className='w-4 h-4 text-green-500' />
              <span className='text-sm font-medium'>Conversions</span>
            </div>
            <div className='text-2xl font-bold'>
              {mockCampaign.conversions.toLocaleString()}
            </div>
            <div className='text-xs text-green-600'>Total sales</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center space-x-2 mb-2'>
              <DollarSign className='w-4 h-4 text-green-500' />
              <span className='text-sm font-medium'>Revenue</span>
            </div>
            <div className='text-2xl font-bold'>
              ${(mockCampaign.revenue / 1000).toFixed(0)}K
            </div>
            <div className='text-xs text-muted-foreground'>Est. revenue</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center space-x-2 mb-2'>
              <TrendingUp className='w-4 h-4 text-purple-500' />
              <span className='text-sm font-medium'>ROI</span>
            </div>
            <div className='text-2xl font-bold'>{mockCampaign.roi}x</div>
            <div className='text-xs text-green-600'>Return on spend</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className='grid w-full grid-cols-7'>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='content'>Content</TabsTrigger>
          <TabsTrigger value='creators'>Creators</TabsTrigger>
          <TabsTrigger value='contracts'>Contracts</TabsTrigger>
          <TabsTrigger value='budget'>Budget</TabsTrigger>
          <TabsTrigger value='analytics'>Analytics</TabsTrigger>
          <TabsTrigger value='optimize'>Optimize</TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='space-y-6'>
          <div className='grid lg:grid-cols-3 gap-6'>
            <div className='lg:col-span-2'>
              <PerformanceChart />
            </div>
            <div>
              <CampaignMetrics campaign={mockCampaign} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value='content' className='space-y-6'>
          <ContentApproval />
        </TabsContent>

        <TabsContent value='creators' className='space-y-6'>
          <CreatorManagement />
        </TabsContent>

        <TabsContent value='contracts' className='space-y-6'>
          <ContractManagement campaignId={campaignId} />
        </TabsContent>

        <TabsContent value='budget' className='space-y-6'>
          <BudgetReallocation campaignId={campaignId} />
        </TabsContent>

        <TabsContent value='analytics' className='space-y-6'>
          <div className='grid lg:grid-cols-2 gap-6'>
            <PerformanceChart />
            <Card>
              <CardHeader>
                <CardTitle>Detailed Analytics</CardTitle>
                <CardDescription>
                  Comprehensive performance breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Total Impressions
                    </span>
                    <span className='font-medium'>
                      {mockCampaign.totalImpressions.toLocaleString()}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Total Engagements
                    </span>
                    <span className='font-medium'>
                      {mockCampaign.totalEngagements.toLocaleString()}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Cost Per Engagement
                    </span>
                    <span className='font-medium'>
                      $
                      {mockCampaign.totalEngagements > 0
                        ? (
                            mockCampaign.spent / mockCampaign.totalEngagements
                          ).toFixed(2)
                        : '0.00'}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Cost Per Conversion
                    </span>
                    <span className='font-medium'>
                      $
                      {mockCampaign.conversions > 0
                        ? (
                            mockCampaign.spent / mockCampaign.conversions
                          ).toFixed(2)
                        : '0.00'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='optimize' className='space-y-6'>
          <OptimizationSuggestions />
        </TabsContent>
      </Tabs>
    </div>
  );
}
