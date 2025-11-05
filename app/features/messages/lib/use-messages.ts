import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/features/auth';
import {
  getMessageThreads,
  getMessages,
  sendMessage,
  markMessagesAsRead,
} from './message-api';
import { getCampaignById } from '@/app/features/campaigns';
import type { MessageThread, Message } from '@/app/types';

export function useMessages() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCampaignId = searchParams.get('campaign');
  const { user } = useAuth();

  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(
    null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'creator') {
      router.push('/login');
      return;
    }

    // Load threads
    const loadedThreads = getMessageThreads(user.id, user.role);
    setThreads(loadedThreads);

    // Select thread from URL or first thread
    if (selectedCampaignId) {
      const thread = loadedThreads.find(
        t => t.campaignId === selectedCampaignId
      );
      if (thread) {
        setSelectedThread(thread);
        loadMessages(selectedCampaignId);
      }
    } else if (loadedThreads.length > 0) {
      setSelectedThread(loadedThreads[0]);
      loadMessages(loadedThreads[0].campaignId);
    }
  }, [user, router, selectedCampaignId]);

  const loadMessages = (campaignId: string) => {
    if (!user) return;
    const campaignMessages = getMessages(campaignId);
    setMessages(campaignMessages);
    markMessagesAsRead(campaignId, user.id);
    // Refresh threads to update unread count
    setThreads(getMessageThreads(user.id, user.role));
  };

  const handleSelectThread = (thread: MessageThread) => {
    setSelectedThread(thread);
    loadMessages(thread.campaignId);
    router.push(`/creator/messages?campaign=${thread.campaignId}`);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedThread || !user) return;

    const campaign = getCampaignById(selectedThread.campaignId);
    if (!campaign) return;

    sendMessage({
      campaignId: selectedThread.campaignId,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      receiverId: campaign.brandId,
      content: newMessage,
      read: false,
    });

    setNewMessage('');
    loadMessages(selectedThread.campaignId);
  };

  return {
    user,
    threads,
    selectedThread,
    messages,
    newMessage,
    setNewMessage,
    handleSelectThread,
    handleSendMessage,
  };
}

