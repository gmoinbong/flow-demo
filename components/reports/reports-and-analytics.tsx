'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CampaignPerformanceReport } from './campaign-performance-report';
import { ROIAnalysis } from './roi-analysis';
import { CreatorPerformanceReport } from './creator-performance-report';
import { FinancialSummary } from './financial-summary';
import {
  Download,
  Calendar,
  Filter,
  TrendingUp,
  BarChart3,
  DollarSign,
  Users,
} from 'lucide-react';

export function ReportsAndAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('last-30-days');
  const [selectedCampaign, setSelectedCampaign] = useState('all');

  const handleExportReport = (type: string) => {
    console.log(`[v0] Exporting ${type} report for period: ${selectedPeriod}`);
    // Handle export logic
  };

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>
            Reports & Analytics
          </h1>
          <p className='text-muted-foreground'>
            Comprehensive insights into your campaign performance and ROI
          </p>
        </div>

        <div className='flex items-center space-x-3'>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className='w-48'>
              <Calendar className='w-4 h-4 mr-2' />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='last-7-days'>Last 7 days</SelectItem>
              <SelectItem value='last-30-days'>Last 30 days</SelectItem>
              <SelectItem value='last-90-days'>Last 90 days</SelectItem>
              <SelectItem value='last-year'>Last year</SelectItem>
              <SelectItem value='custom'>Custom range</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
            <SelectTrigger className='w-48'>
              <Filter className='w-4 h-4 mr-2' />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All campaigns</SelectItem>
              <SelectItem value='summer-collection'>
                Summer Collection Launch
              </SelectItem>
              <SelectItem value='brand-awareness'>
                Brand Awareness Q4
              </SelectItem>
              <SelectItem value='product-launch'>Product Launch</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={() => handleExportReport('comprehensive')}>
            <Download className='w-4 h-4 mr-2' />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center space-x-2 mb-2'>
              <TrendingUp className='w-5 h-5 text-green-500' />
              <span className='text-sm font-medium'>Total ROI</span>
            </div>
            <div className='text-3xl font-bold'>3.42x</div>
            <div className='text-sm text-green-600'>+0.18x vs last period</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center space-x-2 mb-2'>
              <DollarSign className='w-5 h-5 text-blue-500' />
              <span className='text-sm font-medium'>Total Revenue</span>
            </div>
            <div className='text-3xl font-bold'>$142K</div>
            <div className='text-sm text-green-600'>+28% vs last period</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center space-x-2 mb-2'>
              <BarChart3 className='w-5 h-5 text-purple-500' />
              <span className='text-sm font-medium'>Avg Engagement</span>
            </div>
            <div className='text-3xl font-bold'>4.6%</div>
            <div className='text-sm text-green-600'>+0.4% vs last period</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center space-x-2 mb-2'>
              <Users className='w-5 h-5 text-orange-500' />
              <span className='text-sm font-medium'>Active Creators</span>
            </div>
            <div className='text-3xl font-bold'>24</div>
            <div className='text-sm text-green-600'>+6 vs last period</div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Tabs */}
      <Tabs defaultValue='performance' className='space-y-6'>
        <TabsList className='grid w-full grid-cols-4'>
          <TabsTrigger value='performance'>Campaign Performance</TabsTrigger>
          <TabsTrigger value='roi'>ROI Analysis</TabsTrigger>
          <TabsTrigger value='creators'>Creator Performance</TabsTrigger>
          <TabsTrigger value='financial'>Financial Summary</TabsTrigger>
        </TabsList>

        <TabsContent value='performance'>
          <CampaignPerformanceReport
            period={selectedPeriod}
            campaign={selectedCampaign}
          />
        </TabsContent>

        <TabsContent value='roi'>
          <ROIAnalysis period={selectedPeriod} campaign={selectedCampaign} />
        </TabsContent>

        <TabsContent value='creators'>
          <CreatorPerformanceReport
            period={selectedPeriod}
            campaign={selectedCampaign}
          />
        </TabsContent>

        <TabsContent value='financial'>
          <FinancialSummary
            period={selectedPeriod}
            campaign={selectedCampaign}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
