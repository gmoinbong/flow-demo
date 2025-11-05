import type { UserRole } from './user';

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

