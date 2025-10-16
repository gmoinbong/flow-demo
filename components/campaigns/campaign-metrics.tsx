import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Users, Clock } from 'lucide-react';

interface Campaign {
  budget: number;
  spent: number;
  creators: number;
  activeCreators: number;
  pendingContent: number;
  approvedContent: number;
}

interface CampaignMetricsProps {
  campaign: Campaign;
}

export function CampaignMetrics({ campaign }: CampaignMetricsProps) {
  const budgetUsed = (campaign.spent / campaign.budget) * 100;
  const contentApprovalRate =
    (campaign.approvedContent /
      (campaign.approvedContent + campaign.pendingContent)) *
    100;

  return (
    <div className='space-y-6'>
      {/* Budget Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Budget Tracking</CardTitle>
          <CardDescription>Campaign spend vs allocated budget</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground'>Spent</span>
            <span className='font-medium'>
              ${campaign.spent.toLocaleString()}
            </span>
          </div>
          <Progress value={budgetUsed} className='h-2' />
          <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground'>Budget</span>
            <span className='font-medium'>
              ${campaign.budget.toLocaleString()}
            </span>
          </div>
          <div className='flex items-center space-x-2'>
            {budgetUsed < 80 ? (
              <TrendingUp className='w-4 h-4 text-green-500' />
            ) : (
              <TrendingDown className='w-4 h-4 text-orange-500' />
            )}
            <span className='text-sm text-muted-foreground'>
              {budgetUsed < 80 ? 'On track' : 'Monitor closely'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Creator Status */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Creator Status</CardTitle>
          <CardDescription>
            Active creators and content pipeline
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <Users className='w-4 h-4 text-blue-500' />
              <span className='text-sm'>Active Creators</span>
            </div>
            <Badge variant='default'>
              {campaign.activeCreators}/{campaign.creators}
            </Badge>
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <Clock className='w-4 h-4 text-orange-500' />
              <span className='text-sm'>Pending Approval</span>
            </div>
            <Badge variant='secondary'>{campaign.pendingContent}</Badge>
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <TrendingUp className='w-4 h-4 text-green-500' />
              <span className='text-sm'>Approved Content</span>
            </div>
            <Badge variant='outline'>{campaign.approvedContent}</Badge>
          </div>

          <div className='pt-2'>
            <div className='flex justify-between text-sm mb-2'>
              <span className='text-muted-foreground'>Approval Rate</span>
              <span className='font-medium'>
                {contentApprovalRate.toFixed(0)}%
              </span>
            </div>
            <Progress value={contentApprovalRate} className='h-2' />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className='space-y-2'>
          <button className='w-full text-left p-2 text-sm hover:bg-muted rounded-md transition-colors'>
            Review pending content
          </button>
          <button className='w-full text-left p-2 text-sm hover:bg-muted rounded-md transition-colors'>
            Message all creators
          </button>
          <button className='w-full text-left p-2 text-sm hover:bg-muted rounded-md transition-colors'>
            Export performance report
          </button>
          <button className='w-full text-left p-2 text-sm hover:bg-muted rounded-md transition-colors'>
            Adjust campaign settings
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
