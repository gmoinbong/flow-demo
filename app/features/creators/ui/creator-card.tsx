'use client';

import { Button } from '@/app/shared/ui/button';
import { Card, CardContent, CardHeader } from '@/app/shared/ui/card';
import { Badge } from '@/app/shared/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/shared/ui/avatar';
import { Progress } from '@/app/shared/ui/progress';
import {
  Heart,
  Eye,
  Users,
  MapPin,
  CheckCircle,
  Star,
  TrendingUp,
  MessageCircle,
  Bookmark,
} from 'lucide-react';
import { Checkbox } from '@/app/shared/ui/checkbox';

interface Creator {
  id: number;
  name: string;
  handle: string;
  platform: string;
  followers: number;
  engagement: number;
  avgViews: number;
  niche: string[];
  location: string;
  age: number;
  gender: string;
  languages: string[];
  rates: { post: number; story: number; reel: number };
  aiScore: number;
  roiPrediction: number;
  audienceAge: string;
  audienceGender: string;
  audienceLocation: string;
  recentCampaigns: string[];
  avatar: string;
  verified: boolean;
  responseRate: number;
  completionRate: number;
}

interface CreatorCardProps {
  creator: Creator;
  isSelected: boolean;
  onSelect: () => void;
}

export function CreatorCard({
  creator,
  isSelected,
  onSelect,
}: CreatorCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <Card
      className={`relative transition-all hover:shadow-lg ${isSelected ? 'ring-2 ring-primary' : ''}`}
    >
      {/* Selection Checkbox */}
      <div className='absolute top-4 right-4 z-10'>
        <Checkbox checked={isSelected} onCheckedChange={onSelect} />
      </div>

      <CardHeader className='pb-4'>
        <div className='flex items-start space-x-3'>
          <Avatar className='w-16 h-16'>
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
          <div className='flex-1 min-w-0'>
            <div className='flex items-center space-x-2 mb-1'>
              <h3 className='font-semibold text-foreground truncate'>
                {creator.name}
              </h3>
              {creator.verified && (
                <CheckCircle className='w-4 h-4 text-blue-500 flex-shrink-0' />
              )}
            </div>
            <p className='text-sm text-muted-foreground mb-2'>
              {creator.handle}
            </p>
            <div className='flex items-center space-x-2 text-xs text-muted-foreground'>
              <MapPin className='w-3 h-3' />
              <span>{creator.location}</span>
            </div>
          </div>
        </div>

        {/* AI Score Badge */}
        <div className='flex items-center justify-between mt-3'>
          <div className='flex items-center space-x-2'>
            <Star className='w-4 h-4 text-yellow-500' />
            <span className={`font-semibold ${getScoreColor(creator.aiScore)}`}>
              {creator.aiScore}% Match
            </span>
          </div>
          <Badge variant='secondary' className='text-xs'>
            {creator.platform}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* Key Metrics */}
        <div className='grid grid-cols-3 gap-3 text-center'>
          <div>
            <div className='flex items-center justify-center space-x-1 mb-1'>
              <Users className='w-3 h-3 text-muted-foreground' />
            </div>
            <div className='text-sm font-semibold'>
              {formatNumber(creator.followers)}
            </div>
            <div className='text-xs text-muted-foreground'>Followers</div>
          </div>
          <div>
            <div className='flex items-center justify-center space-x-1 mb-1'>
              <Heart className='w-3 h-3 text-muted-foreground' />
            </div>
            <div className='text-sm font-semibold'>{creator.engagement}%</div>
            <div className='text-xs text-muted-foreground'>Engagement</div>
          </div>
          <div>
            <div className='flex items-center justify-center space-x-1 mb-1'>
              <Eye className='w-3 h-3 text-muted-foreground' />
            </div>
            <div className='text-sm font-semibold'>
              {formatNumber(creator.avgViews)}
            </div>
            <div className='text-xs text-muted-foreground'>Avg Views</div>
          </div>
        </div>

        {/* ROI Prediction */}
        <div className='bg-green-50 rounded-lg p-3'>
          <div className='flex items-center space-x-2 mb-2'>
            <TrendingUp className='w-4 h-4 text-green-600' />
            <span className='text-sm font-semibold text-green-800'>
              Predicted ROI
            </span>
          </div>
          <div className='text-lg font-bold text-green-600'>
            {creator.roiPrediction}x
          </div>
          <div className='text-xs text-green-700'>
            Based on similar campaigns
          </div>
        </div>

        {/* Niche Tags */}
        <div className='flex flex-wrap gap-1'>
          {creator.niche.map(tag => (
            <Badge key={tag} variant='outline' className='text-xs'>
              {tag}
            </Badge>
          ))}
        </div>

        {/* Rates */}
        <div className='text-xs text-muted-foreground'>
          <div className='flex justify-between'>
            <span>Post:</span>
            <span className='font-medium'>
              ${creator.rates.post.toLocaleString()}
            </span>
          </div>
          <div className='flex justify-between'>
            <span>Story:</span>
            <span className='font-medium'>
              ${creator.rates.story.toLocaleString()}
            </span>
          </div>
          <div className='flex justify-between'>
            <span>Reel:</span>
            <span className='font-medium'>
              ${creator.rates.reel.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Performance Indicators */}
        <div className='space-y-2'>
          <div className='flex justify-between text-xs'>
            <span className='text-muted-foreground'>Response Rate</span>
            <span className='font-medium'>{creator.responseRate}%</span>
          </div>
          <Progress value={creator.responseRate} className='h-1' />
        </div>

        {/* Action Buttons */}
        <div className='flex space-x-2 pt-2'>
          <Button size='sm' className='flex-1'>
            <MessageCircle className='w-3 h-3 mr-1' />
            Contact
          </Button>
          <Button size='sm' variant='outline'>
            <Bookmark className='w-3 h-3' />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
