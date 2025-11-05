import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/shared/ui/card';
import { Button } from '@/app/shared/ui/button';
import { Badge } from '@/app/shared/ui/badge';
import {
  TrendingUp,
  Target,
  Users,
  Clock,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';

const suggestions = [
  {
    id: 1,
    type: 'performance',
    priority: 'high',
    title: 'Boost Underperforming Content',
    description:
      '3 posts are performing below average. Consider promoting them or requesting creator optimization.',
    impact: '15-25% increase in reach',
    action: 'Review Content',
    icon: TrendingUp,
  },
  {
    id: 2,
    type: 'targeting',
    priority: 'medium',
    title: 'Expand Target Audience',
    description:
      'Your current audience shows high engagement. Consider expanding to similar demographics.',
    impact: '30% more potential reach',
    action: 'Adjust Targeting',
    icon: Target,
  },
  {
    id: 3,
    type: 'creators',
    priority: 'high',
    title: 'Add Micro-Influencers',
    description:
      'Micro-influencers in your niche show 40% higher engagement rates for similar campaigns.',
    impact: '20% better engagement',
    action: 'Find Creators',
    icon: Users,
  },
  {
    id: 4,
    type: 'timing',
    priority: 'low',
    title: 'Optimize Posting Times',
    description:
      'Your audience is most active between 6-8 PM. Schedule more content during peak hours.',
    impact: '10-15% more engagement',
    action: 'Update Schedule',
    icon: Clock,
  },
];

export function OptimizationSuggestions() {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant='destructive'>High Priority</Badge>;
      case 'medium':
        return <Badge variant='secondary'>Medium Priority</Badge>;
      case 'low':
        return <Badge variant='outline'>Low Priority</Badge>;
      default:
        return <Badge variant='secondary'>Priority</Badge>;
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center space-x-2'>
        <Lightbulb className='w-6 h-6 text-yellow-500' />
        <div>
          <h2 className='text-2xl font-bold'>AI Optimization Suggestions</h2>
          <p className='text-muted-foreground'>
            Data-driven recommendations to improve campaign performance
          </p>
        </div>
      </div>

      {/* Performance Overview */}
      <Card className='bg-gradient-to-r from-green-50 to-blue-50 border-green-200'>
        <CardContent className='p-6'>
          <div className='flex items-start space-x-4'>
            <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0'>
              <TrendingUp className='w-6 h-6 text-green-600' />
            </div>
            <div>
              <h3 className='font-semibold text-foreground mb-2'>
                Campaign Health Score: 87/100
              </h3>
              <p className='text-sm text-muted-foreground mb-3'>
                Your campaign is performing well! Implementing the high-priority
                suggestions below could boost performance by up to 25%.
              </p>
              <div className='flex flex-wrap gap-2'>
                <Badge variant='secondary'>ROI: 3.35x (Above Target)</Badge>
                <Badge variant='secondary'>Engagement: 4.2% (Good)</Badge>
                <Badge variant='secondary'>
                  Budget Utilization: 57% (On Track)
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suggestions */}
      <div className='grid gap-4'>
        {suggestions.map(suggestion => {
          const IconComponent = suggestion.icon;
          return (
            <Card
              key={suggestion.id}
              className={`border-l-4 ${getPriorityColor(suggestion.priority)}`}
            >
              <CardContent className='p-6'>
                <div className='flex items-start justify-between'>
                  <div className='flex items-start space-x-4 flex-1'>
                    <div className='w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0'>
                      <IconComponent className='w-5 h-5 text-muted-foreground' />
                    </div>
                    <div className='flex-1'>
                      <div className='flex items-center space-x-2 mb-2'>
                        <h3 className='font-semibold'>{suggestion.title}</h3>
                        {getPriorityBadge(suggestion.priority)}
                      </div>
                      <p className='text-sm text-muted-foreground mb-2'>
                        {suggestion.description}
                      </p>
                      <div className='flex items-center space-x-2'>
                        <Badge variant='outline' className='text-xs'>
                          Expected Impact: {suggestion.impact}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button size='sm' className='ml-4'>
                    {suggestion.action}
                    <ArrowRight className='w-3 h-3 ml-1' />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Additional AI Insights</CardTitle>
          <CardDescription>Advanced analytics and predictions</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid md:grid-cols-2 gap-4'>
            <div className='p-4 bg-muted rounded-lg'>
              <h4 className='font-semibold mb-2'>Trend Analysis</h4>
              <p className='text-sm text-muted-foreground'>
                Fashion content performs 23% better on weekends. Consider
                scheduling more posts for Friday-Sunday.
              </p>
            </div>
            <div className='p-4 bg-muted rounded-lg'>
              <h4 className='font-semibold mb-2'>Competitor Insights</h4>
              <p className='text-sm text-muted-foreground'>
                Similar campaigns in your industry are using 15% more video
                content with higher engagement rates.
              </p>
            </div>
            <div className='p-4 bg-muted rounded-lg'>
              <h4 className='font-semibold mb-2'>Seasonal Forecast</h4>
              <p className='text-sm text-muted-foreground'>
                Summer fashion content typically peaks in the next 2 weeks.
                Consider increasing budget allocation.
              </p>
            </div>
            <div className='p-4 bg-muted rounded-lg'>
              <h4 className='font-semibold mb-2'>ROI Prediction</h4>
              <p className='text-sm text-muted-foreground'>
                Based on current trends, your campaign is projected to achieve
                3.8x ROI by completion.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
