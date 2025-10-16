'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CreatorCard } from './creator-card';
import { CreatorFilters } from './creator-filters';
import { Search, SlidersHorizontal, Sparkles, TrendingUp } from 'lucide-react';

// Mock creator data with realistic metrics
const mockCreators = [
  {
    id: 1,
    name: 'Sarah Johnson',
    handle: '@sarahjstyle',
    platform: 'Instagram',
    followers: 125000,
    engagement: 4.8,
    avgViews: 45000,
    niche: ['Fashion', 'Lifestyle'],
    location: 'Los Angeles, CA',
    age: 28,
    gender: 'Female',
    languages: ['English'],
    rates: { post: 2500, story: 800, reel: 3200 },
    aiScore: 94,
    roiPrediction: 3.2,
    audienceAge: '25-34 (45%)',
    audienceGender: 'Female (78%)',
    audienceLocation: 'US (65%), CA (12%)',
    recentCampaigns: ['Fashion Nova', 'Sephora', 'Nike'],
    avatar: '/fashion-influencer-woman.png',
    verified: true,
    responseRate: 95,
    completionRate: 98,
  },
  {
    id: 2,
    name: 'Marcus Chen',
    handle: '@marcusfitness',
    platform: 'TikTok',
    followers: 89000,
    engagement: 6.2,
    avgViews: 180000,
    niche: ['Fitness', 'Health'],
    location: 'New York, NY',
    age: 32,
    gender: 'Male',
    languages: ['English', 'Mandarin'],
    rates: { post: 1800, story: 600, reel: 2400 },
    aiScore: 91,
    roiPrediction: 4.1,
    audienceAge: '18-24 (52%)',
    audienceGender: 'Male (58%)',
    audienceLocation: 'US (58%), UK (15%)',
    recentCampaigns: ['MyProtein', 'Gymshark', 'Fitbit'],
    avatar: '/fitness-influencer-man.png',
    verified: true,
    responseRate: 88,
    completionRate: 96,
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    handle: '@emmabeauty',
    platform: 'YouTube',
    followers: 245000,
    engagement: 3.9,
    avgViews: 95000,
    niche: ['Beauty', 'Skincare'],
    location: 'Miami, FL',
    age: 26,
    gender: 'Female',
    languages: ['English', 'Spanish'],
    rates: { post: 4200, story: 1200, reel: 5000 },
    aiScore: 89,
    roiPrediction: 2.8,
    audienceAge: '25-34 (48%)',
    audienceGender: 'Female (85%)',
    audienceLocation: 'US (45%), MX (20%)',
    recentCampaigns: ['Fenty Beauty', 'The Ordinary', 'Glossier'],
    avatar: '/beauty-influencer-latina.png',
    verified: true,
    responseRate: 92,
    completionRate: 94,
  },
  {
    id: 4,
    name: 'Alex Thompson',
    handle: '@alextech',
    platform: 'Instagram',
    followers: 67000,
    engagement: 5.4,
    avgViews: 28000,
    niche: ['Technology', 'Gaming'],
    location: 'Seattle, WA',
    age: 29,
    gender: 'Male',
    languages: ['English'],
    rates: { post: 1500, story: 450, reel: 1800 },
    aiScore: 87,
    roiPrediction: 3.5,
    audienceAge: '18-24 (38%)',
    audienceGender: 'Male (72%)',
    audienceLocation: 'US (68%), CA (18%)',
    recentCampaigns: ['Samsung', 'Razer', 'Discord'],
    avatar: '/tech-influencer-man.png',
    verified: false,
    responseRate: 85,
    completionRate: 91,
  },
  {
    id: 5,
    name: 'Zoe Williams',
    handle: '@zoetravel',
    platform: 'Instagram',
    followers: 156000,
    engagement: 4.3,
    avgViews: 52000,
    niche: ['Travel', 'Photography'],
    location: 'London, UK',
    age: 31,
    gender: 'Female',
    languages: ['English', 'French'],
    rates: { post: 2800, story: 900, reel: 3500 },
    aiScore: 92,
    roiPrediction: 3.0,
    audienceAge: '25-34 (42%)',
    audienceGender: 'Female (68%)',
    audienceLocation: 'UK (35%), US (25%)',
    recentCampaigns: ['Airbnb', 'Canon', 'Booking.com'],
    avatar: '/travel-influencer-woman.png',
    verified: true,
    responseRate: 90,
    completionRate: 97,
  },
];

export function CreatorDiscovery() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('ai-score');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCreators, setSelectedCreators] = useState<number[]>([]);

  const handleCreatorSelect = (creatorId: number) => {
    setSelectedCreators(prev =>
      prev.includes(creatorId)
        ? prev.filter(id => id !== creatorId)
        : [...prev, creatorId]
    );
  };

  const filteredCreators = mockCreators
    .filter(
      creator =>
        creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.niche.some(n =>
          n.toLowerCase().includes(searchQuery.toLowerCase())
        )
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'ai-score':
          return b.aiScore - a.aiScore;
        case 'engagement':
          return b.engagement - a.engagement;
        case 'followers':
          return b.followers - a.followers;
        case 'roi':
          return b.roiPrediction - a.roiPrediction;
        default:
          return 0;
      }
    });

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      {/* Header */}
      <div className='mb-8'>
        <div className='flex items-center space-x-2 mb-4'>
          <Sparkles className='w-6 h-6 text-primary' />
          <h1 className='text-3xl font-bold text-foreground'>
            AI Creator Recommendations
          </h1>
        </div>
        <p className='text-muted-foreground'>
          Discover the perfect creators for your campaign with AI-powered
          matching and ROI predictions.
        </p>
      </div>

      {/* Search and Controls */}
      <div className='flex flex-col lg:flex-row gap-4 mb-8'>
        <div className='flex-1 relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
          <Input
            placeholder='Search creators by name, handle, or niche...'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className='pl-10'
          />
        </div>

        <div className='flex gap-3'>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className='w-48'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='ai-score'>AI Match Score</SelectItem>
              <SelectItem value='engagement'>Engagement Rate</SelectItem>
              <SelectItem value='followers'>Followers</SelectItem>
              <SelectItem value='roi'>ROI Prediction</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant='outline'
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className='w-4 h-4 mr-2' />
            Filters
          </Button>

          {selectedCreators.length > 0 && (
            <Button>Contact Selected ({selectedCreators.length})</Button>
          )}
        </div>
      </div>

      {/* AI Insights Banner */}
      <Card className='mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'>
        <CardContent className='p-6'>
          <div className='flex items-start space-x-4'>
            <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0'>
              <TrendingUp className='w-6 h-6 text-primary' />
            </div>
            <div>
              <h3 className='font-semibold text-foreground mb-2'>
                AI Insights for Your Campaign
              </h3>
              <p className='text-sm text-muted-foreground mb-3'>
                Based on your campaign goals and target audience, we've
                identified {filteredCreators.length} highly compatible creators
                with an average predicted ROI of 3.2x.
              </p>
              <div className='flex flex-wrap gap-2'>
                <Badge variant='secondary'>
                  Fashion creators performing 23% above average
                </Badge>
                <Badge variant='secondary'>
                  Micro-influencers showing 15% higher engagement
                </Badge>
                <Badge variant='secondary'>Female audience match: 78%</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='grid lg:grid-cols-4 gap-8'>
        {/* Filters Sidebar */}
        {showFilters && (
          <div className='lg:col-span-1'>
            <CreatorFilters />
          </div>
        )}

        {/* Creator Grid */}
        <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
          <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-6'>
            {filteredCreators.map(creator => (
              <CreatorCard
                key={creator.id}
                creator={creator}
                isSelected={selectedCreators.includes(creator.id)}
                onSelect={() => handleCreatorSelect(creator.id)}
              />
            ))}
          </div>

          {filteredCreators.length === 0 && (
            <div className='text-center py-12'>
              <p className='text-muted-foreground'>
                No creators found matching your criteria.
              </p>
              <Button
                variant='outline'
                className='mt-4 bg-transparent'
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
