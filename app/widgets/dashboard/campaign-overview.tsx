import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/shared/ui/card';
import { Badge } from '@/app/shared/ui/badge';
import { Button } from '@/app/shared/ui/button';
import { Eye, Heart, MessageCircle } from 'lucide-react';

const campaigns = [
  {
    id: 1,
    name: 'Summer Collection Launch',
    status: 'active',
    creators: 12,
    reach: '2.4M',
    engagement: '4.2%',
    budget: '$15,000',
    spent: '$8,500',
  },
  {
    id: 2,
    name: 'Brand Awareness Q4',
    status: 'draft',
    creators: 0,
    reach: '0',
    engagement: '0%',
    budget: '$25,000',
    spent: '$0',
  },
];

export function CampaignOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Campaigns</CardTitle>
        <CardDescription>Monitor your campaign performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {campaigns.map(campaign => (
            <div
              key={campaign.id}
              className='flex items-center justify-between p-4 border rounded-lg'
            >
              <div className='flex-1'>
                <div className='flex items-center space-x-3 mb-2'>
                  <h3 className='font-semibold'>{campaign.name}</h3>
                  <Badge
                    variant={
                      campaign.status === 'active' ? 'default' : 'secondary'
                    }
                  >
                    {campaign.status}
                  </Badge>
                </div>
                <div className='flex items-center space-x-6 text-sm text-muted-foreground'>
                  <span className='flex items-center'>
                    <Eye className='w-4 h-4 mr-1' />
                    {campaign.reach} reach
                  </span>
                  <span className='flex items-center'>
                    <Heart className='w-4 h-4 mr-1' />
                    {campaign.engagement} engagement
                  </span>
                  <span className='flex items-center'>
                    <MessageCircle className='w-4 h-4 mr-1' />
                    {campaign.creators} creators
                  </span>
                </div>
              </div>
              <div className='text-right'>
                <div className='text-sm font-medium'>
                  {campaign.spent} / {campaign.budget}
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  className='mt-2 bg-transparent'
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
