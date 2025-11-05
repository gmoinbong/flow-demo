import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/shared/ui/card';
import { Badge } from '@/app/shared/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/shared/ui/avatar';
import { Progress } from '@/app/shared/ui/progress';
import { Star, TrendingUp, Eye, Heart, DollarSign } from 'lucide-react';

const creatorPerformance = [
  {
    id: 1,
    name: 'Sarah Johnson',
    handle: '@sarahjstyle',
    avatar: '/fashion-influencer-woman.png',
    platform: 'Instagram',
    totalReach: 145000,
    totalEngagement: 6960,
    engagementRate: 4.8,
    conversions: 28,
    revenue: 8400,
    spend: 2500,
    roi: 3.36,
    contentPieces: 4,
    avgPerformance: 92,
  },
  {
    id: 2,
    name: 'Emma Rodriguez',
    handle: '@emmabeauty',
    avatar: '/beauty-influencer-latina.png',
    platform: 'YouTube',
    totalReach: 89000,
    totalEngagement: 3471,
    engagementRate: 3.9,
    conversions: 22,
    revenue: 6600,
    spend: 4200,
    roi: 1.57,
    contentPieces: 3,
    avgPerformance: 78,
  },
  {
    id: 3,
    name: 'Zoe Williams',
    handle: '@zoetravel',
    avatar: '/travel-influencer-woman.png',
    platform: 'Instagram',
    totalReach: 156000,
    totalEngagement: 6708,
    engagementRate: 4.3,
    conversions: 35,
    revenue: 10500,
    spend: 2800,
    roi: 3.75,
    contentPieces: 4,
    avgPerformance: 88,
  },
  {
    id: 4,
    name: 'Marcus Chen',
    handle: '@marcusfitness',
    avatar: '/fitness-influencer-man.png',
    platform: 'TikTok',
    totalReach: 67000,
    totalEngagement: 4154,
    engagementRate: 6.2,
    conversions: 15,
    revenue: 4500,
    spend: 1800,
    roi: 2.5,
    contentPieces: 3,
    avgPerformance: 85,
  },
];

interface CreatorPerformanceReportProps {
  period: string;
  campaign: string;
}

export function CreatorPerformanceReport({
  period,
  campaign,
}: CreatorPerformanceReportProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const sortedCreators = [...creatorPerformance].sort((a, b) => b.roi - a.roi);

  return (
    <div className='space-y-6'>
      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Creators</CardTitle>
          <CardDescription>
            Ranked by ROI and overall performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {sortedCreators.map((creator, index) => (
              <div key={creator.id} className='border rounded-lg p-4'>
                <div className='flex items-start justify-between mb-4'>
                  <div className='flex items-center space-x-4'>
                    <div className='relative'>
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
                      {index < 3 && (
                        <div className='absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center'>
                          <span className='text-xs font-bold text-white'>
                            {index + 1}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className='flex items-center space-x-2 mb-1'>
                        <h3 className='font-semibold'>{creator.name}</h3>
                        <Badge variant='outline' className='text-xs'>
                          {creator.platform}
                        </Badge>
                      </div>
                      <p className='text-sm text-muted-foreground mb-1'>
                        {creator.handle}
                      </p>
                      <div className='flex items-center space-x-2'>
                        <Star className='w-4 h-4 text-yellow-500' />
                        <span
                          className={`text-sm font-medium ${getPerformanceColor(creator.avgPerformance)}`}
                        >
                          {creator.avgPerformance}% Performance Score
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='text-2xl font-bold text-green-600'>
                      {creator.roi.toFixed(2)}x
                    </div>
                    <div className='text-sm text-muted-foreground'>ROI</div>
                  </div>
                </div>

                <div className='grid grid-cols-2 md:grid-cols-6 gap-4'>
                  <div className='text-center'>
                    <div className='flex items-center justify-center space-x-1 mb-1'>
                      <Eye className='w-4 h-4 text-blue-500' />
                    </div>
                    <div className='text-sm font-semibold'>
                      {formatNumber(creator.totalReach)}
                    </div>
                    <div className='text-xs text-muted-foreground'>Reach</div>
                  </div>

                  <div className='text-center'>
                    <div className='flex items-center justify-center space-x-1 mb-1'>
                      <Heart className='w-4 h-4 text-red-500' />
                    </div>
                    <div className='text-sm font-semibold'>
                      {creator.engagementRate}%
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      Engagement
                    </div>
                  </div>

                  <div className='text-center'>
                    <div className='flex items-center justify-center space-x-1 mb-1'>
                      <TrendingUp className='w-4 h-4 text-green-500' />
                    </div>
                    <div className='text-sm font-semibold'>
                      {creator.conversions}
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      Conversions
                    </div>
                  </div>

                  <div className='text-center'>
                    <div className='flex items-center justify-center space-x-1 mb-1'>
                      <DollarSign className='w-4 h-4 text-green-500' />
                    </div>
                    <div className='text-sm font-semibold'>
                      ${formatNumber(creator.revenue)}
                    </div>
                    <div className='text-xs text-muted-foreground'>Revenue</div>
                  </div>

                  <div className='text-center'>
                    <div className='text-sm font-semibold'>
                      {creator.contentPieces}
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      Content Pieces
                    </div>
                  </div>

                  <div className='text-center'>
                    <div className='text-sm font-semibold'>
                      ${creator.spend.toLocaleString()}
                    </div>
                    <div className='text-xs text-muted-foreground'>Spend</div>
                  </div>
                </div>

                <div className='mt-4'>
                  <div className='flex justify-between text-sm mb-2'>
                    <span className='text-muted-foreground'>
                      Performance Score
                    </span>
                    <span className='font-medium'>
                      {creator.avgPerformance}%
                    </span>
                  </div>
                  <Progress value={creator.avgPerformance} className='h-2' />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Creator Performance Insights</CardTitle>
          <CardDescription>Key findings and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid md:grid-cols-2 gap-4'>
            <div className='p-4 bg-green-50 rounded-lg border border-green-200'>
              <h4 className='font-semibold text-green-800 mb-2'>
                Top ROI Creator
              </h4>
              <p className='text-sm text-green-700'>
                Zoe Williams delivered the highest ROI at 3.75x with excellent
                engagement rates and conversion performance.
              </p>
            </div>

            <div className='p-4 bg-blue-50 rounded-lg border border-blue-200'>
              <h4 className='font-semibold text-blue-800 mb-2'>
                Engagement Leader
              </h4>
              <p className='text-sm text-blue-700'>
                Marcus Chen achieved the highest engagement rate at 6.2%,
                showing strong audience connection on TikTok.
              </p>
            </div>

            <div className='p-4 bg-purple-50 rounded-lg border border-purple-200'>
              <h4 className='font-semibold text-purple-800 mb-2'>
                Reach Champion
              </h4>
              <p className='text-sm text-purple-700'>
                Zoe Williams generated the highest total reach at 156K,
                effectively expanding brand awareness.
              </p>
            </div>

            <div className='p-4 bg-orange-50 rounded-lg border border-orange-200'>
              <h4 className='font-semibold text-orange-800 mb-2'>
                Improvement Opportunity
              </h4>
              <p className='text-sm text-orange-700'>
                Emma Rodriguez shows potential for optimization. Consider
                adjusting content strategy or audience targeting.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
