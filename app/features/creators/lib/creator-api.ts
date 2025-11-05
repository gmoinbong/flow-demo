import type { Creator, MatchScore } from '@/app/types';
import type { Campaign } from '@/app/types';

// Initialize mock creators if they don't exist
export function initializeMockCreators(): void {
  if (typeof window === 'undefined') return;

  const existingCreators = localStorage.getItem('mockCreators');
  if (existingCreators) return;

  const mockCreators: Creator[] = [
    {
      id: 'creator_1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'creator',
      instagramHandle: 'sarahjfashion',
      tiktokHandle: 'sarahjstyle',
      niche: ['Fashion & Beauty', 'Travel & Lifestyle'],
      followers: { instagram: 125000, tiktok: 89000 },
      engagement: 4.2,
      location: 'Los Angeles, CA',
      onboardingComplete: true,
    },
    {
      id: 'creator_2',
      name: 'Marcus Chen',
      email: 'marcus@example.com',
      role: 'creator',
      instagramHandle: 'marcusfitness',
      youtubeHandle: 'marcusfitnessjourney',
      niche: ['Health & Fitness', 'Sports'],
      followers: { instagram: 78000, youtube: 45000 },
      engagement: 5.1,
      location: 'New York, NY',
      onboardingComplete: true,
    },
    {
      id: 'creator_3',
      name: 'Emma Rodriguez',
      email: 'emma@example.com',
      role: 'creator',
      instagramHandle: 'emmafoodie',
      tiktokHandle: 'emmacooks',
      youtubeHandle: 'emmarecipes',
      niche: ['Food & Cooking', 'Travel & Lifestyle'],
      followers: { instagram: 210000, tiktok: 156000, youtube: 89000 },
      engagement: 6.3,
      location: 'Miami, FL',
      onboardingComplete: true,
    },
    {
      id: 'creator_4',
      name: 'Alex Thompson',
      email: 'alex@example.com',
      role: 'creator',
      instagramHandle: 'alextech',
      youtubeHandle: 'alextechreviews',
      niche: ['Technology', 'Gaming'],
      followers: { instagram: 95000, youtube: 234000 },
      engagement: 4.8,
      location: 'San Francisco, CA',
      onboardingComplete: true,
    },
    {
      id: 'creator_5',
      name: 'Zoe Williams',
      email: 'zoe@example.com',
      role: 'creator',
      instagramHandle: 'zoebeauty',
      tiktokHandle: 'zoeglam',
      niche: ['Fashion & Beauty', 'Entertainment'],
      followers: { instagram: 342000, tiktok: 567000 },
      engagement: 7.2,
      location: 'London, UK',
      onboardingComplete: true,
    },
    {
      id: 'creator_6',
      name: 'David Park',
      email: 'david@example.com',
      role: 'creator',
      instagramHandle: 'davidbusiness',
      youtubeHandle: 'davidbiztalks',
      niche: ['Business & Finance', 'Education'],
      followers: { instagram: 67000, youtube: 123000 },
      engagement: 3.9,
      location: 'Chicago, IL',
      onboardingComplete: true,
    },
  ];

  localStorage.setItem('mockCreators', JSON.stringify(mockCreators));
}

export function getMockCreators(): Creator[] {
  if (typeof window === 'undefined') return [];
  initializeMockCreators();
  const creatorsStr = localStorage.getItem('mockCreators');
  return creatorsStr ? JSON.parse(creatorsStr) : [];
}

export function matchCreatorsForCampaign(campaign: Campaign): MatchScore[] {
  const creators = getMockCreators();
  const scores: MatchScore[] = [];

  creators.forEach(creator => {
    let score = 0;
    const reasons: string[] = [];

    // Niche matching (40% weight)
    const campaignInterests =
      campaign.targetAudience
        ?.toLowerCase()
        .split(',')
        .map(s => s.trim()) || [];
    const nicheMatch = creator.niche.some(niche =>
      campaignInterests.some(
        interest =>
          niche.toLowerCase().includes(interest) ||
          interest.includes(niche.toLowerCase())
      )
    );
    if (nicheMatch) {
      score += 40;
      reasons.push('Content niche matches campaign interests');
    }

    // Follower count matching (25% weight)
    const totalFollowers =
      (creator.followers.instagram || 0) +
      (creator.followers.tiktok || 0) +
      (creator.followers.youtube || 0);
    if (totalFollowers >= 50000 && totalFollowers <= 500000) {
      score += 25;
      reasons.push('Optimal audience size for campaign reach');
    } else if (totalFollowers > 500000) {
      score += 20;
      reasons.push('Large audience reach');
    } else if (totalFollowers >= 10000) {
      score += 15;
      reasons.push('Growing audience base');
    }

    // Engagement rate (20% weight)
    if (creator.engagement >= 5) {
      score += 20;
      reasons.push('High engagement rate');
    } else if (creator.engagement >= 3) {
      score += 15;
      reasons.push('Good engagement rate');
    } else {
      score += 10;
      reasons.push('Moderate engagement');
    }

    // Platform matching (15% weight)
    const campaignPlatforms = campaign.platforms || [];
    let platformMatches = 0;
    if (campaignPlatforms.includes('Instagram') && creator.instagramHandle)
      platformMatches++;
    if (campaignPlatforms.includes('TikTok') && creator.tiktokHandle)
      platformMatches++;
    if (campaignPlatforms.includes('YouTube') && creator.youtubeHandle)
      platformMatches++;

    if (platformMatches >= 2) {
      score += 15;
      reasons.push('Active on multiple campaign platforms');
    } else if (platformMatches === 1) {
      score += 10;
      reasons.push('Active on campaign platform');
    }

    // Only include creators with score > 50
    if (score >= 50) {
      scores.push({ creator, score, reasons });
    }
  });

  // Sort by score descending
  return scores.sort((a, b) => b.score - a.score);
}

