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
import { ChartContainer, ChartTooltip } from '@/app/shared/ui/chart';
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  LineChart,
} from 'recharts';
import { TrendingUp, Eye, Heart, MousePointer, Download } from 'lucide-react';

const campaignData = [
  {
    campaign: 'Summer Collection',
    reach: 2400000,
    impressions: 4800000,
    engagement: 192000,
    clicks: 134400,
    conversions: 1240,
    spend: 8500,
    revenue: 28500,
    roi: 3.35,
    status: 'active',
  },
  {
    campaign: 'Brand Awareness Q4',
    reach: 1800000,
    impressions: 3600000,
    engagement: 144000,
    clicks: 100800,
    conversions: 890,
    spend: 12000,
    revenue: 22400,
    roi: 1.87,
    status: 'completed',
  },
  {
    campaign: 'Product Launch',
    reach: 950000,
    impressions: 1900000,
    engagement: 76000,
    clicks: 53200,
    conversions: 420,
    spend: 6500,
    revenue: 15800,
    roi: 2.43,
    status: 'completed',
  },
];

const performanceOverTime = [
  { date: 'Week 1', reach: 300000, engagement: 12000, conversions: 85 },
  { date: 'Week 2', reach: 650000, engagement: 26000, conversions: 195 },
  { date: 'Week 3', reach: 1200000, engagement: 48000, conversions: 385 },
  { date: 'Week 4', reach: 2400000, engagement: 96000, conversions: 758 },
];

const chartConfig = {
  reach: {
    label: 'Reach',
    color: 'hsl(var(--chart-1))',
  },
  engagement: {
    label: 'Engagement',
    color: 'hsl(var(--chart-2))',
  },
};

interface CampaignPerformanceReportProps {
  period: string;
  campaign: string;
}

export function CampaignPerformanceReport({
  period,
  campaign,
}: CampaignPerformanceReportProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  return (
    <div className='space-y-6'>
      {/* Performance Over Time Chart */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Campaign metrics over time</CardDescription>
            </div>
            <Button size='sm' variant='outline'>
              <Download className='w-4 h-4 mr-2' />
              Export Chart
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className='h-[300px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={performanceOverTime}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis
                  dataKey='date'
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className='bg-background border rounded-lg shadow-lg p-3'>
                          <p className='font-medium'>{label}</p>
                          {payload.map((entry, index) => (
                            <p key={index} style={{ color: entry.color }}>
                              {entry.name}: {formatNumber(Number(entry.value))}
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type='monotone'
                  dataKey='reach'
                  stroke={chartConfig.reach.color}
                  strokeWidth={2}
                  dot={{ fill: chartConfig.reach.color }}
                  name='Reach'
                />
                <Line
                  type='monotone'
                  dataKey='engagement'
                  stroke={chartConfig.engagement.color}
                  strokeWidth={2}
                  dot={{ fill: chartConfig.engagement.color }}
                  name='Engagement'
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Campaign Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Comparison</CardTitle>
          <CardDescription>
            Performance metrics across all campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {campaignData.map(camp => (
              <div key={camp.campaign} className='border rounded-lg p-4'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='flex items-center space-x-3'>
                    <h3 className='font-semibold'>{camp.campaign}</h3>
                    <Badge
                      variant={
                        camp.status === 'active' ? 'default' : 'secondary'
                      }
                    >
                      {camp.status}
                    </Badge>
                  </div>
                  <div className='text-right'>
                    <div className='text-sm text-muted-foreground'>ROI</div>
                    <div className='text-lg font-bold text-green-600'>
                      {camp.roi}x
                    </div>
                  </div>
                </div>

                <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
                  <div className='text-center'>
                    <div className='flex items-center justify-center space-x-1 mb-1'>
                      <Eye className='w-4 h-4 text-blue-500' />
                    </div>
                    <div className='text-sm font-semibold'>
                      {formatNumber(camp.reach)}
                    </div>
                    <div className='text-xs text-muted-foreground'>Reach</div>
                  </div>

                  <div className='text-center'>
                    <div className='flex items-center justify-center space-x-1 mb-1'>
                      <Heart className='w-4 h-4 text-red-500' />
                    </div>
                    <div className='text-sm font-semibold'>
                      {formatNumber(camp.engagement)}
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      Engagement
                    </div>
                  </div>

                  <div className='text-center'>
                    <div className='flex items-center justify-center space-x-1 mb-1'>
                      <MousePointer className='w-4 h-4 text-green-500' />
                    </div>
                    <div className='text-sm font-semibold'>
                      {formatNumber(camp.clicks)}
                    </div>
                    <div className='text-xs text-muted-foreground'>Clicks</div>
                  </div>

                  <div className='text-center'>
                    <div className='flex items-center justify-center space-x-1 mb-1'>
                      <TrendingUp className='w-4 h-4 text-purple-500' />
                    </div>
                    <div className='text-sm font-semibold'>
                      {camp.conversions}
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      Conversions
                    </div>
                  </div>

                  <div className='text-center'>
                    <div className='text-sm font-semibold'>
                      ${formatNumber(camp.revenue)}
                    </div>
                    <div className='text-xs text-muted-foreground'>Revenue</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
