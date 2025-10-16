'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function CreatorFilters() {
  const [followersRange, setFollowersRange] = useState([10000, 1000000]);
  const [engagementRange, setEngagementRange] = useState([2, 8]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  const platforms = ['Instagram', 'TikTok', 'YouTube', 'Twitter', 'LinkedIn'];
  const niches = [
    'Fashion',
    'Beauty',
    'Fitness',
    'Technology',
    'Travel',
    'Food',
    'Lifestyle',
    'Gaming',
  ];
  const locations = [
    'United States',
    'Canada',
    'United Kingdom',
    'Australia',
    'Germany',
    'France',
  ];

  const toggleSelection = (
    item: string,
    list: string[],
    setList: (list: string[]) => void
  ) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const clearAllFilters = () => {
    setFollowersRange([10000, 1000000]);
    setEngagementRange([2, 8]);
    setSelectedPlatforms([]);
    setSelectedNiches([]);
    setSelectedLocations([]);
  };

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg'>Filters</CardTitle>
          <Button variant='ghost' size='sm' onClick={clearAllFilters}>
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Followers Range */}
        <div className='space-y-3'>
          <Label className='text-sm font-medium'>Followers</Label>
          <div className='px-2'>
            <Slider
              value={followersRange}
              onValueChange={setFollowersRange}
              max={1000000}
              min={1000}
              step={1000}
              className='w-full'
            />
          </div>
          <div className='flex justify-between text-xs text-muted-foreground'>
            <span>{followersRange[0].toLocaleString()}</span>
            <span>{followersRange[1].toLocaleString()}</span>
          </div>
        </div>

        {/* Engagement Range */}
        <div className='space-y-3'>
          <Label className='text-sm font-medium'>Engagement Rate (%)</Label>
          <div className='px-2'>
            <Slider
              value={engagementRange}
              onValueChange={setEngagementRange}
              max={10}
              min={0}
              step={0.1}
              className='w-full'
            />
          </div>
          <div className='flex justify-between text-xs text-muted-foreground'>
            <span>{engagementRange[0]}%</span>
            <span>{engagementRange[1]}%</span>
          </div>
        </div>

        {/* Platforms */}
        <div className='space-y-3'>
          <Label className='text-sm font-medium'>Platforms</Label>
          <div className='space-y-2'>
            {platforms.map(platform => (
              <div key={platform} className='flex items-center space-x-2'>
                <Checkbox
                  id={platform}
                  checked={selectedPlatforms.includes(platform)}
                  onCheckedChange={() =>
                    toggleSelection(
                      platform,
                      selectedPlatforms,
                      setSelectedPlatforms
                    )
                  }
                />
                <Label htmlFor={platform} className='text-sm'>
                  {platform}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Niches */}
        <div className='space-y-3'>
          <Label className='text-sm font-medium'>Niches</Label>
          <div className='space-y-2'>
            {niches.map(niche => (
              <div key={niche} className='flex items-center space-x-2'>
                <Checkbox
                  id={niche}
                  checked={selectedNiches.includes(niche)}
                  onCheckedChange={() =>
                    toggleSelection(niche, selectedNiches, setSelectedNiches)
                  }
                />
                <Label htmlFor={niche} className='text-sm'>
                  {niche}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className='space-y-3'>
          <Label className='text-sm font-medium'>Location</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder='Select location' />
            </SelectTrigger>
            <SelectContent>
              {locations.map(location => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Verification Status */}
        <div className='space-y-3'>
          <Label className='text-sm font-medium'>Creator Status</Label>
          <div className='space-y-2'>
            <div className='flex items-center space-x-2'>
              <Checkbox id='verified' />
              <Label htmlFor='verified' className='text-sm'>
                Verified creators only
              </Label>
            </div>
            <div className='flex items-center space-x-2'>
              <Checkbox id='responsive' />
              <Label htmlFor='responsive' className='text-sm'>
                High response rate (90%+)
              </Label>
            </div>
            <div className='flex items-center space-x-2'>
              <Checkbox id='reliable' />
              <Label htmlFor='reliable' className='text-sm'>
                High completion rate (95%+)
              </Label>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(selectedPlatforms.length > 0 || selectedNiches.length > 0) && (
          <div className='space-y-2'>
            <Label className='text-sm font-medium'>Active Filters</Label>
            <div className='flex flex-wrap gap-1'>
              {selectedPlatforms.map(platform => (
                <Badge key={platform} variant='secondary' className='text-xs'>
                  {platform}
                </Badge>
              ))}
              {selectedNiches.map(niche => (
                <Badge key={niche} variant='secondary' className='text-xs'>
                  {niche}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
