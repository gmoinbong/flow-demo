import type { User, UserRole, Campaign, CampaignAllocation } from '@/app/types';
import { getCurrentUser, setCurrentUser } from '@/app/features/auth/lib/auth-api';
import {
  getCampaigns,
  saveCampaign,
  saveAllocation,
  generateTrackingLink,
} from './campaign-api';
import { initializeMockCreators } from '@/app/features/creators/lib/creator-api';
import { saveNotification } from '@/app/features/notifications/lib/notification-api';

export function initializeDemoNotifications(
  userId: string,
  userRole: UserRole
): void {
  if (typeof window === 'undefined') return;

  const { getNotifications } = require('@/app/features/notifications/lib/notification-api');
  const existingNotifications = getNotifications(userId);
  if (existingNotifications.length > 0) return;

  if (userRole === 'creator') {
    const demoNotifications = [
      {
        id: `notif_demo_1_${userId}`,
        userId,
        type: 'campaign_invite' as const,
        title: 'New Campaign Invitation',
        message:
          "You've been invited to join the Summer Collection Launch campaign",
        read: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        actionUrl: '/creator/dashboard',
      },
      {
        id: `notif_demo_2_${userId}`,
        userId,
        type: 'payment' as const,
        title: 'Payment Received',
        message:
          "You've received $2,500 for the Summer Collection Launch campaign",
        read: false,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: `notif_demo_3_${userId}`,
        userId,
        type: 'budget_change' as const,
        title: 'Budget Increased',
        message:
          'Your budget allocation increased by 15% due to strong performance',
        read: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    demoNotifications.forEach(notification => {
      saveNotification(notification);
    });
  }
}

export function initializeDemoData(): void {
  if (typeof window === 'undefined') return;

  // Initialize mock creators first
  initializeMockCreators();

  // Check if demo campaign already exists
  const campaigns = getCampaigns();
  const demoCampaignExists = campaigns.some(c => c.id === 'demo_campaign_1');
  if (demoCampaignExists) return;

  // Create a demo brand user
  const demoBrand: User = {
    id: 'demo_brand_1',
    email: 'demo@fashionbrand.com',
    name: 'Fashion Forward Co.',
    role: 'brand',
    company: 'Fashion Forward Co.',
    companySize: '50-200',
    jobRole: 'Marketing Manager',
    onboardingComplete: true,
  };

  // Create demo campaign
  const demoCampaign: Campaign = {
    id: 'demo_campaign_1',
    brandId: demoBrand.id,
    name: 'Summer Collection Launch',
    description:
      'Promote our new summer collection featuring sustainable fashion pieces. Looking for authentic content that showcases the versatility and quality of our products.',
    budget: 15000,
    goals: ['Brand Awareness', 'Product Sales', 'Social Engagement'],
    targetAudience: 'Fashion, Lifestyle, Sustainability enthusiasts aged 18-35',
    platforms: ['Instagram', 'TikTok'],
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    status: 'active',
    createdAt: new Date().toISOString(),
  };

  saveCampaign(demoCampaign);

  // Get current user if they're a creator
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.role === 'creator') {
    // Create an accepted allocation for the current creator
    const demoAllocation: CampaignAllocation = {
      id: `alloc_demo_${currentUser.id}`,
      campaignId: demoCampaign.id,
      creatorId: currentUser.id,
      allocatedBudget: 2500,
      currentBudget: 2500,
      performance: {
        reach: 12400,
        engagement: 4.2,
        conversions: 87,
        ctr: 0.7,
      },
      status: 'active',
      trackingLink: generateTrackingLink(demoCampaign.id, currentUser.id),
      contractAccepted: true,
      contractAcceptedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    saveAllocation(demoAllocation);
  }
}

