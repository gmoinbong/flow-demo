import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  MessageCircle,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';

const campaignCreators = [
  {
    id: 1,
    name: 'Sarah Johnson',
    handle: '@sarahjstyle',
    avatar: '/fashion-influencer-woman.png',
    platform: 'Instagram',
    status: 'active',
    deliverables: { completed: 3, total: 4 },
    performance: { reach: 145000, engagement: 4.8, conversions: 28 },
    lastActivity: '2 hours ago',
    responseRate: 95,
    onTime: true,
  },
  {
    id: 2,
    name: 'Emma Rodriguez',
    handle: '@emmabeauty',
    avatar: '/beauty-influencer-latina.png',
    platform: 'YouTube',
    status: 'active',
    deliverables: { completed: 2, total: 3 },
    performance: { reach: 89000, engagement: 3.9, conversions: 22 },
    lastActivity: '4 hours ago',
    responseRate: 92,
    onTime: true,
  },
  {
    id: 3,
    name: 'Marcus Chen',
    handle: '@marcusfitness',
    avatar: '/fitness-influencer-man.png',
    platform: 'TikTok',
    status: 'pending',
    deliverables: { completed: 1, total: 3 },
    performance: { reach: 67000, engagement: 6.2, conversions: 15 },
    lastActivity: '1 day ago',
    responseRate: 88,
    onTime: false,
  },
  {
    id: 4,
    name: 'Zoe Williams',
    handle: '@zoetravel',
    avatar: '/travel-influencer-woman.png',
    platform: 'Instagram',
    status: 'active',
    deliverables: { completed: 4, total: 4 },
    performance: { reach: 156000, engagement: 4.3, conversions: 35 },
    lastActivity: '6 hours ago',
    responseRate: 90,
    onTime: true,
  },
];

export function CreatorManagement() {
  const getStatusIcon = (status: string, onTime: boolean) => {
    if (status === 'active' && onTime)
      return <CheckCircle className='w-4 h-4 text-green-500' />;
    if (status === 'active' && !onTime)
      return <AlertTriangle className='w-4 h-4 text-orange-500' />;
    if (status === 'pending')
      return <Clock className='w-4 h-4 text-yellow-500' />;
    return <Clock className='w-4 h-4 text-gray-500' />;
  };

  const getStatusBadge = (status: string, onTime: boolean) => {
    if (status === 'active' && onTime)
      return <Badge variant='default'>Active</Badge>;
    if (status === 'active' && !onTime)
      return <Badge variant='secondary'>Behind Schedule</Badge>;
    if (status === 'pending') return <Badge variant='outline'>Pending</Badge>;
    return <Badge variant='secondary'>Inactive</Badge>;
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold'>Creator Management</h2>
          <p className='text-muted-foreground'>
            Monitor creator performance and deliverables
          </p>
        </div>
        <Button>
          <MessageCircle className='w-4 h-4 mr-2' />
          Message All
        </Button>
      </div>

      <div className='grid gap-6'>
        {campaignCreators.map(creator => (
          <Card key={creator.id}>
            <CardContent className='p-6'>
              <div className='flex items-start justify-between mb-4'>
                <div className='flex items-center space-x-4'>
                  <Avatar className='w-12 h-12'>
                    <AvatarImage
                      src={creator.avatar || '/placeholder.svg'}
                      alt={creator.name}
                    />
                    <AvatarFallback>
                      {creator.name
                        .split(' ')
                        .map(n => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className='flex items-center space-x-2 mb-1'>
                      <h3 className='font-semibold'>{creator.name}</h3>
                      {getStatusIcon(creator.status, creator.onTime)}
                    </div>
                    <p className='text-sm text-muted-foreground mb-1'>
                      {creator.handle}
                    </p>
                    <div className='flex items-center space-x-2'>
                      <Badge variant='outline' className='text-xs'>
                        {creator.platform}
                      </Badge>
                      {getStatusBadge(creator.status, creator.onTime)}
                    </div>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='text-xs text-muted-foreground'>Last active</p>
                  <p className='text-sm font-medium'>{creator.lastActivity}</p>
                </div>
              </div>

              <div className='grid md:grid-cols-4 gap-6'>
                {/* Deliverables Progress */}
                <div>
                  <h4 className='text-sm font-medium mb-2'>Deliverables</h4>
                  <div className='space-y-2'>
                    <div className='flex justify-between text-sm'>
                      <span className='text-muted-foreground'>Progress</span>
                      <span className='font-medium'>
                        {creator.deliverables.completed}/
                        {creator.deliverables.total}
                      </span>
                    </div>
                    <Progress
                      value={
                        (creator.deliverables.completed /
                          creator.deliverables.total) *
                        100
                      }
                      className='h-2'
                    />
                  </div>
                </div>

                {/* Performance Metrics */}
                <div>
                  <h4 className='text-sm font-medium mb-2'>Performance</h4>
                  <div className='space-y-1'>
                    <div className='flex justify-between text-xs'>
                      <span className='text-muted-foreground'>Reach</span>
                      <span className='font-medium'>
                        {creator.performance.reach.toLocaleString()}
                      </span>
                    </div>
                    <div className='flex justify-between text-xs'>
                      <span className='text-muted-foreground'>Engagement</span>
                      <span className='font-medium'>
                        {creator.performance.engagement}%
                      </span>
                    </div>
                    <div className='flex justify-between text-xs'>
                      <span className='text-muted-foreground'>Conversions</span>
                      <span className='font-medium'>
                        {creator.performance.conversions}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reliability */}
                <div>
                  <h4 className='text-sm font-medium mb-2'>Reliability</h4>
                  <div className='space-y-1'>
                    <div className='flex justify-between text-xs'>
                      <span className='text-muted-foreground'>
                        Response Rate
                      </span>
                      <span className='font-medium'>
                        {creator.responseRate}%
                      </span>
                    </div>
                    <div className='flex justify-between text-xs'>
                      <span className='text-muted-foreground'>On Time</span>
                      <span
                        className={`font-medium ${creator.onTime ? 'text-green-600' : 'text-orange-600'}`}
                      >
                        {creator.onTime ? 'Yes' : 'Behind'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className='flex flex-col space-y-2'>
                  <Button
                    size='sm'
                    variant='outline'
                    className='bg-transparent'
                  >
                    <MessageCircle className='w-3 h-3 mr-1' />
                    Message
                  </Button>
                  <Button
                    size='sm'
                    variant='outline'
                    className='bg-transparent'
                  >
                    <TrendingUp className='w-3 h-3 mr-1' />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
