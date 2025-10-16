'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const performanceData = [
  { date: 'Jan 15', reach: 120000, engagement: 4800, conversions: 45 },
  { date: 'Jan 16', reach: 185000, engagement: 7200, conversions: 68 },
  { date: 'Jan 17', reach: 245000, engagement: 9800, conversions: 92 },
  { date: 'Jan 18', reach: 320000, engagement: 12800, conversions: 125 },
  { date: 'Jan 19', reach: 410000, engagement: 16400, conversions: 158 },
  { date: 'Jan 20', reach: 520000, engagement: 20800, conversions: 195 },
  { date: 'Jan 21', reach: 640000, engagement: 25600, conversions: 238 },
  { date: 'Jan 22', reach: 780000, engagement: 31200, conversions: 285 },
  { date: 'Jan 23', reach: 920000, engagement: 36800, conversions: 332 },
  { date: 'Jan 24', reach: 1100000, engagement: 44000, conversions: 385 },
  { date: 'Jan 25', reach: 1300000, engagement: 52000, conversions: 445 },
  { date: 'Jan 26', reach: 1520000, engagement: 60800, conversions: 512 },
  { date: 'Jan 27', reach: 1750000, engagement: 70000, conversions: 585 },
  { date: 'Jan 28', reach: 2000000, engagement: 80000, conversions: 665 },
  { date: 'Today', reach: 2400000, engagement: 96000, conversions: 758 },
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
  conversions: {
    label: 'Conversions',
    color: 'hsl(var(--chart-3))',
  },
};

export function PerformanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Performance</CardTitle>
        <CardDescription>
          Real-time metrics over the campaign period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='h-[300px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart data={performanceData}>
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
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type='monotone'
                dataKey='reach'
                stackId='1'
                stroke={chartConfig.reach.color}
                fill={chartConfig.reach.color}
                fillOpacity={0.6}
              />
              <Area
                type='monotone'
                dataKey='engagement'
                stackId='2'
                stroke={chartConfig.engagement.color}
                fill={chartConfig.engagement.color}
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
