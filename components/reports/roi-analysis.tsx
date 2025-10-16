import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, DollarSign, Target, Calculator } from 'lucide-react';

const roiData = [
  { category: 'Fashion', spend: 15000, revenue: 52000, roi: 3.47 },
  { category: 'Beauty', spend: 8500, revenue: 24500, roi: 2.88 },
  { category: 'Lifestyle', spend: 12000, revenue: 28800, roi: 2.4 },
  { category: 'Fitness', spend: 6500, revenue: 19500, roi: 3.0 },
];

const costBreakdown = [
  { item: 'Creator Payments', amount: 28500, percentage: 68 },
  { item: 'Platform Fees', amount: 4200, percentage: 10 },
  { item: 'Content Production', amount: 6300, percentage: 15 },
  { item: 'Ad Spend', amount: 2800, percentage: 7 },
];

const chartConfig = {
  roi: {
    label: 'ROI',
    color: 'hsl(var(--chart-1))',
  },
  spend: {
    label: 'Spend',
    color: 'hsl(var(--chart-2))',
  },
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--chart-3))',
  },
};

interface ROIAnalysisProps {
  period: string;
  campaign: string;
}

export function ROIAnalysis({ period, campaign }: ROIAnalysisProps) {
  const totalSpend = costBreakdown.reduce((sum, item) => sum + item.amount, 0);
  const totalRevenue = 125000;
  const overallROI = totalRevenue / totalSpend;

  return (
    <div className='space-y-6'>
      {/* ROI Overview */}
      <div className='grid md:grid-cols-3 gap-6'>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center space-x-2 mb-4'>
              <Calculator className='w-5 h-5 text-blue-500' />
              <span className='font-medium'>Overall ROI</span>
            </div>
            <div className='text-3xl font-bold text-green-600 mb-2'>
              {overallROI.toFixed(2)}x
            </div>
            <div className='text-sm text-muted-foreground'>
              For every $1 spent, you earned ${overallROI.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center space-x-2 mb-4'>
              <DollarSign className='w-5 h-5 text-green-500' />
              <span className='font-medium'>Total Profit</span>
            </div>
            <div className='text-3xl font-bold mb-2'>
              ${(totalRevenue - totalSpend).toLocaleString()}
            </div>
            <div className='text-sm text-muted-foreground'>
              Revenue minus total spend
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center space-x-2 mb-4'>
              <Target className='w-5 h-5 text-purple-500' />
              <span className='font-medium'>Target Achievement</span>
            </div>
            <div className='text-3xl font-bold text-green-600 mb-2'>114%</div>
            <div className='text-sm text-muted-foreground'>
              Exceeded target ROI of 2.5x
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ROI by Category */}
      <Card>
        <CardHeader>
          <CardTitle>ROI by Category</CardTitle>
          <CardDescription>
            Performance breakdown across different content categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className='h-[300px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={roiData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis
                  dataKey='category'
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
                <Bar
                  dataKey='roi'
                  fill={chartConfig.roi.color}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Cost Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Breakdown</CardTitle>
          <CardDescription>
            Where your campaign budget was allocated
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {costBreakdown.map(item => (
              <div
                key={item.item}
                className='flex items-center justify-between'
              >
                <div className='flex-1'>
                  <div className='flex items-center justify-between mb-2'>
                    <span className='font-medium'>{item.item}</span>
                    <div className='flex items-center space-x-2'>
                      <span className='text-sm text-muted-foreground'>
                        {item.percentage}%
                      </span>
                      <span className='font-semibold'>
                        ${item.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <Progress value={item.percentage} className='h-2' />
                </div>
              </div>
            ))}
          </div>

          <div className='mt-6 pt-4 border-t'>
            <div className='flex items-center justify-between'>
              <span className='font-semibold'>Total Campaign Spend</span>
              <span className='text-lg font-bold'>
                ${totalSpend.toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ROI Insights */}
      <Card>
        <CardHeader>
          <CardTitle>ROI Insights & Recommendations</CardTitle>
          <CardDescription>
            Data-driven insights to improve future campaign performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid md:grid-cols-2 gap-4'>
            <div className='p-4 bg-green-50 rounded-lg border border-green-200'>
              <div className='flex items-center space-x-2 mb-2'>
                <TrendingUp className='w-4 h-4 text-green-600' />
                <span className='font-semibold text-green-800'>
                  Top Performer
                </span>
              </div>
              <p className='text-sm text-green-700'>
                Fashion content delivered the highest ROI at 3.47x. Consider
                allocating more budget to this category.
              </p>
            </div>

            <div className='p-4 bg-blue-50 rounded-lg border border-blue-200'>
              <div className='flex items-center space-x-2 mb-2'>
                <Target className='w-4 h-4 text-blue-600' />
                <span className='font-semibold text-blue-800'>
                  Optimization Opportunity
                </span>
              </div>
              <p className='text-sm text-blue-700'>
                Lifestyle content has potential for improvement. Consider
                testing different creator types or content formats.
              </p>
            </div>

            <div className='p-4 bg-purple-50 rounded-lg border border-purple-200'>
              <div className='flex items-center space-x-2 mb-2'>
                <Calculator className='w-4 h-4 text-purple-600' />
                <span className='font-semibold text-purple-800'>
                  Cost Efficiency
                </span>
              </div>
              <p className='text-sm text-purple-700'>
                Creator payments represent 68% of spend but drive 85% of
                results. This allocation is highly efficient.
              </p>
            </div>

            <div className='p-4 bg-orange-50 rounded-lg border border-orange-200'>
              <div className='flex items-center space-x-2 mb-2'>
                <DollarSign className='w-4 h-4 text-orange-600' />
                <span className='font-semibold text-orange-800'>
                  Budget Recommendation
                </span>
              </div>
              <p className='text-sm text-orange-700'>
                Based on current performance, increasing budget by 25% could
                yield an additional $31K in revenue.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
