import type { Message, MessageThread, UserRole } from '@/app/types';
import { getCampaignById } from '@/app/features/campaigns/lib/campaign-api';
import { getCurrentUser } from '@/app/features/auth/lib/auth-api';
import { saveNotification } from '@/app/features/notifications/lib/notification-api';

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
  const notification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId: message.receiverId,
    type: 'message' as const,
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

