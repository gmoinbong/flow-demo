import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'campaign_approved',
    message:
      'Summer Collection Launch campaign was approved by @fashionista_jane',
    time: '2 hours ago',
    status: 'success',
  },
  {
    id: 2,
    type: 'content_submitted',
    message: 'New content submitted for Brand Awareness Q4 campaign',
    time: '4 hours ago',
    status: 'pending',
  },
  {
    id: 3,
    type: 'payment_processed',
    message: 'Payment of $2,500 processed for @lifestyle_blogger',
    time: '1 day ago',
    status: 'success',
  },
  {
    id: 4,
    type: 'deadline_approaching',
    message: 'Content deadline approaching for Summer Collection Launch',
    time: '2 days ago',
    status: 'warning',
  },
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates from your campaigns</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {activities.map(activity => (
            <div key={activity.id} className='flex items-start space-x-3'>
              <div className='flex-shrink-0 mt-1'>
                {activity.status === 'success' && (
                  <CheckCircle className='w-4 h-4 text-green-500' />
                )}
                {activity.status === 'pending' && (
                  <Clock className='w-4 h-4 text-yellow-500' />
                )}
                {activity.status === 'warning' && (
                  <AlertCircle className='w-4 h-4 text-orange-500' />
                )}
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-sm text-foreground'>{activity.message}</p>
                <p className='text-xs text-muted-foreground mt-1'>
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
