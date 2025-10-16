import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  FileText,
  Download,
} from 'lucide-react';

const monthlyFinancials = [
  { month: 'Oct', spend: 8500, revenue: 22400, profit: 13900 },
  { month: 'Nov', spend: 12000, revenue: 28500, profit: 16500 },
  { month: 'Dec', spend: 15000, revenue: 42000, profit: 27000 },
  { month: 'Jan', spend: 18500, revenue: 52000, profit: 33500 },
];

const paymentStatus = [
  { status: 'Paid', amount: 28500, count: 18, color: 'text-green-600' },
  { status: 'Pending', amount: 4200, count: 3, color: 'text-yellow-600' },
  { status: 'Processing', amount: 1800, count: 2, color: 'text-blue-600' },
  { status: 'Overdue', amount: 0, count: 0, color: 'text-red-600' },
];

const chartConfig = {
  spend: {
    label: 'Spend',
    color: 'hsl(var(--chart-1))',
  },
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--chart-2))',
  },
  profit: {
    label: 'Profit',
    color: 'hsl(var(--chart-3))',
  },
};

interface FinancialSummaryProps {
  period: string;
  campaign: string;
}

export function FinancialSummary({ period, campaign }: FinancialSummaryProps) {
  const totalSpend = monthlyFinancials.reduce(
    (sum, month) => sum + month.spend,
    0
  );
  const totalRevenue = monthlyFinancials.reduce(
    (sum, month) => sum + month.revenue,
    0
  );
  const totalProfit = totalRevenue - totalSpend;
  const profitMargin = (totalProfit / totalRevenue) * 100;

  return (
    <div className='space-y-6'>
      {/* Financial Overview */}
      <div className='grid md:grid-cols-4 gap-4'>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center space-x-2 mb-2'>
              <DollarSign className='w-5 h-5 text-green-500' />
              <span className='text-sm font-medium'>Total Revenue</span>
            </div>
            <div className='text-2xl font-bold'>
              ${totalRevenue.toLocaleString()}
            </div>
            <div className='text-sm text-green-600'>+28% vs last period</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center space-x-2 mb-2'>
              <CreditCard className='w-5 h-5 text-blue-500' />
              <span className='text-sm font-medium'>Total Spend</span>
            </div>
            <div className='text-2xl font-bold'>
              ${totalSpend.toLocaleString()}
            </div>
            <div className='text-sm text-blue-600'>+15% vs last period</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center space-x-2 mb-2'>
              <TrendingUp className='w-5 h-5 text-purple-500' />
              <span className='text-sm font-medium'>Net Profit</span>
            </div>
            <div className='text-2xl font-bold text-green-600'>
              ${totalProfit.toLocaleString()}
            </div>
            <div className='text-sm text-green-600'>+35% vs last period</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center space-x-2 mb-2'>
              <FileText className='w-5 h-5 text-orange-500' />
              <span className='text-sm font-medium'>Profit Margin</span>
            </div>
            <div className='text-2xl font-bold'>{profitMargin.toFixed(1)}%</div>
            <div className='text-sm text-green-600'>+4.2% vs last period</div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Trends */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Financial Trends</CardTitle>
              <CardDescription>
                Monthly spend, revenue, and profit over time
              </CardDescription>
            </div>
            <Button size='sm' variant='outline'>
              <Download className='w-4 h-4 mr-2' />
              Export Data
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className='h-[300px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <AreaChart data={monthlyFinancials}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis
                  dataKey='month'
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
                  dataKey='revenue'
                  stackId='1'
                  stroke={chartConfig.revenue.color}
                  fill={chartConfig.revenue.color}
                  fillOpacity={0.6}
                />
                <Area
                  type='monotone'
                  dataKey='spend'
                  stackId='2'
                  stroke={chartConfig.spend.color}
                  fill={chartConfig.spend.color}
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Payment Status */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Status</CardTitle>
          <CardDescription>Current status of creator payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid md:grid-cols-2 gap-6'>
            <div className='space-y-4'>
              {paymentStatus.map(status => (
                <div
                  key={status.status}
                  className='flex items-center justify-between p-3 border rounded-lg'
                >
                  <div className='flex items-center space-x-3'>
                    <Badge
                      variant={
                        status.status === 'Paid'
                          ? 'default'
                          : status.status === 'Overdue'
                            ? 'destructive'
                            : 'secondary'
                      }
                    >
                      {status.status}
                    </Badge>
                    <span className='font-medium'>{status.count} payments</span>
                  </div>
                  <span className={`font-semibold ${status.color}`}>
                    ${status.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className='space-y-4'>
              <div className='p-4 bg-green-50 rounded-lg border border-green-200'>
                <h4 className='font-semibold text-green-800 mb-2'>
                  Payment Health
                </h4>
                <p className='text-sm text-green-700 mb-3'>
                  95% of payments are on time with no overdue amounts. Excellent
                  payment management!
                </p>
                <Progress value={95} className='h-2' />
              </div>

              <div className='p-4 bg-blue-50 rounded-lg border border-blue-200'>
                <h4 className='font-semibold text-blue-800 mb-2'>
                  Next Payment Cycle
                </h4>
                <p className='text-sm text-blue-700'>
                  $4,200 in pending payments will be processed on February 1st
                  for 3 creators.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Management</CardTitle>
          <CardDescription>
            Quick actions for financial operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid md:grid-cols-3 gap-4'>
            <Button className='h-auto p-4 flex flex-col items-center space-y-2'>
              <FileText className='w-6 h-6' />
              <span>Generate Invoice</span>
            </Button>
            <Button
              variant='outline'
              className='h-auto p-4 flex flex-col items-center space-y-2 bg-transparent'
            >
              <Download className='w-6 h-6' />
              <span>Export Financial Report</span>
            </Button>
            <Button
              variant='outline'
              className='h-auto p-4 flex flex-col items-center space-y-2 bg-transparent'
            >
              <CreditCard className='w-6 h-6' />
              <span>Process Payments</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
