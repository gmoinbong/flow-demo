'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';
import {
  getCurrentUser,
  getMessageThreads,
  getMessages,
  sendMessage,
  markMessagesAsRead,
  getCampaignById,
} from '@/lib/auth';

export default function CreatorMessagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCampaignId = searchParams.get('campaign');

  const [user, setUser] = useState(getCurrentUser());
  const [threads, setThreads] = useState(
    getMessageThreads(user?.id || '', user?.role || 'creator')
  );
  const [selectedThread, setSelectedThread] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
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
    const campaignMessages = getMessages(campaignId);
    setMessages(campaignMessages);
    markMessagesAsRead(campaignId, user?.id || '');
    // Refresh threads to update unread count
    setThreads(getMessageThreads(user?.id || '', user?.role || 'creator'));
  };

  const handleSelectThread = (thread: any) => {
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

  if (!user || user.role !== 'creator') {
    return null;
  }

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <div className='border-b bg-card'>
        <div className='container mx-auto px-6 py-4'>
          <div className='flex items-center gap-4'>
            <Link href='/creator/dashboard'>
              <Button variant='ghost' size='icon'>
                <ArrowLeft className='h-5 w-5' />
              </Button>
            </Link>
            <div>
              <h1 className='text-2xl font-bold'>Messages</h1>
              <p className='text-sm text-muted-foreground'>
                Communicate with brands
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-6 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]'>
          {/* Threads List */}
          <Card className='lg:col-span-1'>
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
            </CardHeader>
            <CardContent className='p-0'>
              <ScrollArea className='h-[calc(100vh-300px)]'>
                {threads.length === 0 ? (
                  <div className='p-6 text-center text-sm text-muted-foreground'>
                    No conversations yet
                  </div>
                ) : (
                  threads.map(thread => (
                    <div
                      key={thread.campaignId}
                      className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                        selectedThread?.campaignId === thread.campaignId
                          ? 'bg-muted'
                          : ''
                      }`}
                      onClick={() => handleSelectThread(thread)}
                    >
                      <div className='flex items-start gap-3'>
                        <Avatar className='h-10 w-10'>
                          <AvatarFallback>
                            {thread.brandName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center justify-between mb-1'>
                            <p className='font-medium text-sm truncate'>
                              {thread.campaignName}
                            </p>
                            {thread.unreadCount > 0 && (
                              <Badge variant='destructive' className='ml-2'>
                                {thread.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <p className='text-xs text-muted-foreground truncate'>
                            {thread.lastMessage.content}
                          </p>
                          <p className='text-xs text-muted-foreground mt-1'>
                            {new Date(
                              thread.lastMessage.createdAt
                            ).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Messages */}
          <Card className='lg:col-span-2'>
            {selectedThread ? (
              <>
                <CardHeader className='border-b'>
                  <div className='flex items-center gap-3'>
                    <Avatar>
                      <AvatarFallback>
                        {selectedThread.brandName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className='text-lg'>
                        {selectedThread.campaignName}
                      </CardTitle>
                      <p className='text-sm text-muted-foreground'>
                        {selectedThread.brandName}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='p-0 flex flex-col h-[calc(100vh-380px)]'>
                  <ScrollArea className='flex-1 p-6'>
                    <div className='space-y-4'>
                      {messages.map(message => {
                        const isOwn = message.senderId === user.id;
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}
                            >
                              <div
                                className={`rounded-lg p-3 ${
                                  isOwn
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                }`}
                              >
                                <p className='text-sm'>{message.content}</p>
                              </div>
                              <p className='text-xs text-muted-foreground mt-1 px-1'>
                                {new Date(message.createdAt).toLocaleTimeString(
                                  undefined,
                                  {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                  <div className='border-t p-4'>
                    <div className='flex gap-2'>
                      <Input
                        placeholder='Type a message...'
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        onKeyPress={e => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                      >
                        <Send className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className='flex items-center justify-center h-full'>
                <div className='text-center text-muted-foreground'>
                  <p>Select a conversation to start messaging</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
