export type UserRole = 'brand' | 'creator';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company?: string;
  companySize?: string;
  jobRole?: string;
  // Creator-specific fields
  instagramHandle?: string;
  tiktokHandle?: string;
  youtubeHandle?: string;
  niche?: string[];
  followers?: {
    instagram?: number;
    tiktok?: number;
    youtube?: number;
  };
  onboardingComplete?: boolean;
}

export interface Campaign {
  id: string;
  brandId: string;
  name: string;
  description: string;
  budget: number;
  goals: string[];
  targetAudience: string;
  platforms: string[];
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  createdAt: string;
}

export interface CampaignAllocation {
  id: string;
  campaignId: string;
  creatorId: string;
  allocatedBudget: number;
  currentBudget: number;
  performance: {
    reach: number;
    engagement: number;
    conversions: number;
    ctr: number;
  };
  status: 'pending' | 'accepted' | 'active' | 'completed' | 'declined';
  trackingLink?: string;
  contractAccepted?: boolean;
  contractAcceptedAt?: string;
  createdAt: string;
}

// Notification and message interfaces
export interface Notification {
  id: string;
  userId: string;
  type:
    | 'campaign_invite'
    | 'contract_update'
    | 'payment'
    | 'message'
    | 'budget_change'
    | 'content_approval';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: any;
}

export interface Message {
  id: string;
  campaignId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  receiverId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface MessageThread {
  campaignId: string;
  campaignName: string;
  brandId: string;
  brandName: string;
  creatorId: string;
  creatorName: string;
  lastMessage: Message;
  unreadCount: number;
}

// Auth helpers
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

export function setCurrentUser(user: User): void {
  localStorage.setItem('user', JSON.stringify(user));
}

export function logout(): void {
  localStorage.removeItem('user');
  localStorage.removeItem('campaigns');
  localStorage.removeItem('allocations');
  localStorage.removeItem('mockCreators'); // Updated: Remove mock creators on logout
  localStorage.removeItem('notifications');
  localStorage.removeItem('messages');
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

export function requireAuth(role?: UserRole): User {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('Not authenticated');
  }
  if (role && user.role !== role) {
    throw new Error(`Requires ${role} role`);
  }
  return user;
}

// Campaign helpers
export function getCampaigns(): Campaign[] {
  if (typeof window === 'undefined') return [];
  const campaignsStr = localStorage.getItem('campaigns');
  return campaignsStr ? JSON.parse(campaignsStr) : [];
}

export function saveCampaign(campaign: Campaign): void {
  const campaigns = getCampaigns();
  const existingIndex = campaigns.findIndex(c => c.id === campaign.id);
  if (existingIndex >= 0) {
    campaigns[existingIndex] = campaign;
  } else {
    campaigns.push(campaign);
  }
  localStorage.setItem('campaigns', JSON.stringify(campaigns));
}

export function getCampaignById(id: string): Campaign | null {
  const campaigns = getCampaigns();
  return campaigns.find(c => c.id === id) || null;
}

export function getCampaignsByBrand(brandId: string): Campaign[] {
  return getCampaigns().filter(c => c.brandId === brandId);
}

// Allocation helpers
export function getAllocations(): CampaignAllocation[] {
  if (typeof window === 'undefined') return [];
  const allocationsStr = localStorage.getItem('allocations');
  return allocationsStr ? JSON.parse(allocationsStr) : [];
}

export function saveAllocation(allocation: CampaignAllocation): void {
  const allocations = getAllocations();
  const existingIndex = allocations.findIndex(a => a.id === allocation.id);
  if (existingIndex >= 0) {
    allocations[existingIndex] = allocation;
  } else {
    allocations.push(allocation);
  }
  localStorage.setItem('allocations', JSON.stringify(allocations));
}

export function getAllocationsByCampaign(
  campaignId: string
): CampaignAllocation[] {
  return getAllocations().filter(a => a.campaignId === campaignId);
}

export function getAllocationsByCreator(
  creatorId: string
): CampaignAllocation[] {
  return getAllocations().filter(a => a.creatorId === creatorId);
}

export function acceptContract(allocationId: string): void {
  const allocations = getAllocations();
  const allocation = allocations.find(a => a.id === allocationId);
  if (allocation) {
    allocation.contractAccepted = true;
    allocation.contractAcceptedAt = new Date().toISOString();
    allocation.status = 'active';
    saveAllocation(allocation);
  }
}

export function declineContract(allocationId: string): void {
  const allocations = getAllocations();
  const allocation = allocations.find(a => a.id === allocationId);
  if (allocation) {
    allocation.status = 'declined' as any;
    saveAllocation(allocation);
  }
}

// Generate unique tracking link
export function generateTrackingLink(
  campaignId: string,
  creatorId: string
): string {
  const baseUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://app.influencehub.com';
  const trackingCode = `${campaignId.slice(0, 8)}-${creatorId.slice(0, 8)}`;
  return `${baseUrl}/track/${trackingCode}`;
}

// Budget reallocation logic (±25% based on performance)
export function reallocateBudget(campaignId: string): void {
  const allocations = getAllocationsByCampaign(campaignId);
  if (allocations.length === 0) return;

  // Calculate performance scores
  const scores = allocations.map(allocation => {
    const { reach, engagement, conversions } = allocation.performance;
    // Weighted score: 40% reach, 30% engagement, 30% conversions
    const score = reach * 0.4 + engagement * 0.3 + conversions * 0.3;
    return { allocation, score };
  });

  // Sort by score
  scores.sort((a, b) => b.score - a.score);

  // Get top and bottom performers
  const topPerformers = scores.slice(0, Math.ceil(scores.length * 0.3));
  const bottomPerformers = scores.slice(-Math.ceil(scores.length * 0.3));

  // Reallocate: +25% to top, -25% from bottom
  topPerformers.forEach(({ allocation }) => {
    allocation.currentBudget = allocation.allocatedBudget * 1.25;
    saveAllocation(allocation);
  });

  bottomPerformers.forEach(({ allocation }) => {
    allocation.currentBudget = allocation.allocatedBudget * 0.75;
    saveAllocation(allocation);
  });
}

// Mock creators for matching
export interface Creator {
  id: string;
  name: string;
  email: string;
  role: 'creator';
  instagramHandle?: string;
  tiktokHandle?: string;
  youtubeHandle?: string;
  niche: string[];
  followers: {
    instagram?: number;
    tiktok?: number;
    youtube?: number;
  };
  engagement: number;
  location: string;
  onboardingComplete: boolean;
}

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

interface MatchScore {
  creator: Creator;
  score: number;
  reasons: string[];
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

export function createAllocationsForCampaign(
  campaign: Campaign,
  topN = 5
): CampaignAllocation[] {
  const matches = matchCreatorsForCampaign(campaign);
  const topMatches = matches.slice(0, topN);

  // Parse budget range
  const budgetStr = campaign.budget.toString();
  let totalBudget = 25000; // default
  if (budgetStr.includes('-')) {
    const [min, max] = budgetStr
      .split('-')
      .map(s => Number.parseInt(s.replace(/\D/g, '')));
    totalBudget = (min + max) / 2;
  } else {
    totalBudget = Number.parseInt(budgetStr.replace(/\D/g, '')) || 25000;
  }

  // Allocate budget proportionally based on scores
  const totalScore = topMatches.reduce((sum, m) => sum + m.score, 0);
  const allocations: CampaignAllocation[] = [];

  topMatches.forEach(match => {
    const budgetShare = (match.score / totalScore) * totalBudget;
    const allocation: CampaignAllocation = {
      id: `alloc_${Date.now()}_${match.creator.id}`,
      campaignId: campaign.id,
      creatorId: match.creator.id,
      allocatedBudget: Math.round(budgetShare),
      currentBudget: Math.round(budgetShare),
      performance: {
        reach: Math.floor(Math.random() * 10000) + 5000,
        engagement: Math.floor(Math.random() * 500) + 200,
        conversions: Math.floor(Math.random() * 50) + 10,
        ctr: 0,
      },
      status: 'pending',
      trackingLink: generateTrackingLink(campaign.id, match.creator.id),
      contractAccepted: false,
      createdAt: new Date().toISOString(),
    };
    // Calculate CTR
    allocation.performance.ctr =
      (allocation.performance.conversions / allocation.performance.reach) * 100;
    allocations.push(allocation);
    saveAllocation(allocation);
  });

  return allocations;
}

// Notification helper functions
export function getNotifications(userId: string): Notification[] {
  if (typeof window === 'undefined') return [];
  const notificationsStr = localStorage.getItem('notifications');
  const allNotifications: Notification[] = notificationsStr
    ? JSON.parse(notificationsStr)
    : [];
  return allNotifications
    .filter(n => n.userId === userId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function saveNotification(notification: Notification): void {
  const notificationsStr = localStorage.getItem('notifications');
  const notifications: Notification[] = notificationsStr
    ? JSON.parse(notificationsStr)
    : [];
  notifications.push(notification);
  localStorage.setItem('notifications', JSON.stringify(notifications));
}

export function markNotificationAsRead(notificationId: string): void {
  const notificationsStr = localStorage.getItem('notifications');
  if (!notificationsStr) return;
  const notifications: Notification[] = JSON.parse(notificationsStr);
  const notification = notifications.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }
}

export function markAllNotificationsAsRead(userId: string): void {
  const notificationsStr = localStorage.getItem('notifications');
  if (!notificationsStr) return;
  const notifications: Notification[] = JSON.parse(notificationsStr);
  notifications.forEach(n => {
    if (n.userId === userId) {
      n.read = true;
    }
  });
  localStorage.setItem('notifications', JSON.stringify(notifications));
}

export function getUnreadNotificationCount(userId: string): number {
  return getNotifications(userId).filter(n => !n.read).length;
}

// Message helper functions
export function getMessages(campaignId: string): Message[] {
  if (typeof window === 'undefined') return [];
  const messagesStr = localStorage.getItem('messages');
  const allMessages: Message[] = messagesStr ? JSON.parse(messagesStr) : [];
  return allMessages
    .filter(m => m.campaignId === campaignId)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
}

export function sendMessage(
  message: Omit<Message, 'id' | 'createdAt'>
): Message {
  const newMessage: Message = {
    ...message,
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };

  const messagesStr = localStorage.getItem('messages');
  const messages: Message[] = messagesStr ? JSON.parse(messagesStr) : [];
  messages.push(newMessage);
  localStorage.setItem('messages', JSON.stringify(messages));

  // Create notification for receiver
  const notification: Notification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId: message.receiverId,
    type: 'message',
    title: `New message from ${message.senderName}`,
    message: message.content.substring(0, 100),
    read: false,
    createdAt: new Date().toISOString(),
    actionUrl: `/creator/messages?campaign=${message.campaignId}`,
  };
  saveNotification(notification);

  return newMessage;
}

export function markMessagesAsRead(campaignId: string, userId: string): void {
  const messagesStr = localStorage.getItem('messages');
  if (!messagesStr) return;
  const messages: Message[] = JSON.parse(messagesStr);
  messages.forEach(m => {
    if (m.campaignId === campaignId && m.receiverId === userId) {
      m.read = true;
    }
  });
  localStorage.setItem('messages', JSON.stringify(messages));
}

export function getMessageThreads(
  userId: string,
  userRole: UserRole
): MessageThread[] {
  if (typeof window === 'undefined') return [];
  const messagesStr = localStorage.getItem('messages');
  if (!messagesStr) return [];

  const allMessages: Message[] = JSON.parse(messagesStr);
  const userMessages = allMessages.filter(
    m => m.senderId === userId || m.receiverId === userId
  );

  const threadMap = new Map<string, MessageThread>();

  userMessages.forEach(message => {
    const campaign = getCampaignById(message.campaignId);
    if (!campaign) return;

    if (!threadMap.has(message.campaignId)) {
      const isCreator = userRole === 'creator';
      const otherUserId = isCreator
        ? campaign.brandId
        : message.senderId;

      threadMap.set(message.campaignId, {
        campaignId: message.campaignId,
        campaignName: campaign.name,
        brandId: campaign.brandId,
        brandName: campaign.name,
        creatorId: isCreator ? userId : message.senderId,
        creatorName: isCreator
          ? getCurrentUser()?.name || ''
          : message.senderName,
        lastMessage: message,
        unreadCount: 0,
      });
    }

    const thread = threadMap.get(message.campaignId)!;
    if (new Date(message.createdAt) > new Date(thread.lastMessage.createdAt)) {
      thread.lastMessage = message;
    }
    if (!message.read && message.receiverId === userId) {
      thread.unreadCount++;
    }
  });

  return Array.from(threadMap.values()).sort(
    (a, b) =>
      new Date(b.lastMessage.createdAt).getTime() -
      new Date(a.lastMessage.createdAt).getTime()
  );
}

export function getTotalUnreadMessages(userId: string): number {
  if (typeof window === 'undefined') return 0;
  const messagesStr = localStorage.getItem('messages');
  if (!messagesStr) return 0;
  const messages: Message[] = JSON.parse(messagesStr);
  return messages.filter(m => m.receiverId === userId && !m.read).length;
}

export function initializeDemoNotifications(
  userId: string,
  userRole: UserRole
): void {
  if (typeof window === 'undefined') return;

  const existingNotifications = getNotifications(userId);
  if (existingNotifications.length > 0) return;

  if (userRole === 'creator') {
    const demoNotifications: Notification[] = [
      {
        id: `notif_demo_1_${userId}`,
        userId,
        type: 'campaign_invite',
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
        type: 'payment',
        title: 'Payment Received',
        message:
          "You've received $2,500 for the Summer Collection Launch campaign",
        read: false,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: `notif_demo_3_${userId}`,
        userId,
        type: 'budget_change',
        title: 'Budget Increased',
        message:
          'Your budget allocation increased by 15% due to strong performance',
        read: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    const notificationsStr = localStorage.getItem('notifications');
    const allNotifications: Notification[] = notificationsStr
      ? JSON.parse(notificationsStr)
      : [];
    allNotifications.push(...demoNotifications);
    localStorage.setItem('notifications', JSON.stringify(allNotifications));
  }
}

// Initialize demo campaign for creators
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
