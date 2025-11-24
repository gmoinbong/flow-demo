'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/app/shared/ui/button';
import { Input } from '@/app/shared/ui/input';
import { Card, CardContent } from '@/app/shared/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/shared/ui/select';
import { CreatorFilters } from './creator-filters';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useCreators } from '../lib/use-creators';
import { Skeleton } from '@/app/shared/ui/skeleton';

export function CreatorDiscovery() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('ai-score');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);
  const { creators, isLoading } = useCreators({ status: 'active' });

  const handleCreatorSelect = (creatorId: string) => {
    setSelectedCreators(prev =>
      prev.includes(creatorId)
        ? prev.filter(id => id !== creatorId)
        : [...prev, creatorId]
    );
  };

  const filteredCreators = useMemo(() => {
    if (!creators) return [];

    return creators
      .filter(creator => {
        const searchLower = searchQuery.toLowerCase();
        const displayName = creator.displayName || '';
        return (
          displayName.toLowerCase().includes(searchLower) ||
          creator.bio?.toLowerCase().includes(searchLower)
        );
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'ai-score':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'engagement':
            return 0;
          case 'followers':
            return 0;
          case 'roi':
            return 0;
          default:
            return 0;
        }
      });
  }, [creators, searchQuery, sortBy]);

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

      <div className='grid lg:grid-cols-4 gap-8'>
        {/* Filters Sidebar */}
        {showFilters && (
          <div className='lg:col-span-1'>
            <CreatorFilters />
          </div>
        )}

        {/* Creator Grid */}
        <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
          {isLoading ? (
            <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-6'>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i}>
                  <CardContent className='p-6'>
                    <Skeleton className='h-48 w-full' />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredCreators.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-muted-foreground'>
                No creators found matching your criteria.
              </p>
              {searchQuery && (
                <Button
                  variant='outline'
                  className='mt-4'
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-6'>
              {filteredCreators.map(creator => (
                <Card key={creator.id} className='overflow-hidden hover:shadow-lg transition-shadow'>
                  <CardContent className='p-0'>
                    <div className='p-6'>
                      {/* Avatar and Name */}
                      <div className='flex items-center space-x-4 mb-4'>
                        <div className='w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-2xl font-bold text-primary'>
                          {creator.displayName?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div className='flex-1 min-w-0'>
                          <h3 className='font-semibold text-lg truncate'>
                            {creator.displayName || 'Unknown Creator'}
                          </h3>
                          {creator.bio && (
                            <p className='text-sm text-muted-foreground line-clamp-2'>
                              {creator.bio}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Social Profiles */}
                      {creator.socialProfiles && creator.socialProfiles.length > 0 && (
                        <div className='space-y-2 mb-4'>
                          {creator.socialProfiles.map((profile: { id: string; platform: string; username: string; followersDeclared: number | null }) => (
                            <div
                              key={profile.id}
                              className='flex items-center justify-between text-sm p-2 bg-muted/50 rounded'
                            >
                              <div className='flex items-center space-x-2'>
                                <span className='font-medium capitalize'>{profile.platform}</span>
                                <span className='text-muted-foreground'>@{profile.username}</span>
                              </div>
                              {profile.followersDeclared && (
                                <span className='text-muted-foreground'>
                                  {profile.followersDeclared.toLocaleString()} followers
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Niches */}
                      {creator.socialProfiles?.[0]?.niches && creator.socialProfiles[0].niches.length > 0 && (
                        <div className='flex flex-wrap gap-2 mb-4'>
                          {creator.socialProfiles[0].niches.slice(0, 3).map((niche: string, idx: number) => (
                            <span
                              key={idx}
                              className='px-2 py-1 text-xs bg-primary/10 text-primary rounded-full'
                            >
                              {niche}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Location */}
                      {creator.socialProfiles?.[0]?.location && (
                        <p className='text-sm text-muted-foreground mb-4'>
                          📍 {creator.socialProfiles[0].location}
                        </p>
                      )}

                      {/* Actions */}
                      <div className='flex gap-2 mt-4'>
                        <Button
                          variant='outline'
                          className='flex-1'
                          onClick={() => handleCreatorSelect(creator.id)}
                        >
                          {selectedCreators.includes(creator.id) ? 'Selected' : 'Select'}
                        </Button>
                        <Button variant='default' className='flex-1'>
                          Contact
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
