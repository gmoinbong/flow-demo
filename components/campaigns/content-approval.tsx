'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Check, X, MessageCircle, Heart, Share } from 'lucide-react';

const pendingContent = [
  {
    id: 1,
    creator: 'Sarah Johnson',
    handle: '@sarahjstyle',
    avatar: '/fashion-influencer-woman.png',
    platform: 'Instagram',
    type: 'Post',
    content:
      'New summer collection drop! 🌞 These pieces are absolutely stunning and perfect for the season. Link in bio for 20% off! #SummerStyle #Fashion',
    image: '/fashion-summer-outfit.png',
    submittedAt: '2 hours ago',
    metrics: { likes: 0, comments: 0, shares: 0 },
    status: 'pending',
  },
  {
    id: 2,
    creator: 'Emma Rodriguez',
    handle: '@emmabeauty',
    avatar: '/beauty-influencer-latina.png',
    platform: 'Instagram',
    type: 'Story',
    content:
      'Getting ready with the new summer palette! The colors are so vibrant and long-lasting ✨',
    image: '/beauty-makeup-tutorial.png',
    submittedAt: '4 hours ago',
    metrics: { likes: 0, comments: 0, shares: 0 },
    status: 'pending',
  },
  {
    id: 3,
    creator: 'Zoe Williams',
    handle: '@zoetravel',
    avatar: '/travel-influencer-woman.png',
    platform: 'Instagram',
    type: 'Reel',
    content:
      'Summer vibes with the perfect travel outfit! Comfortable yet stylish for any adventure 🌴',
    image: '/travel-outfit-summer.png',
    submittedAt: '6 hours ago',
    metrics: { likes: 0, comments: 0, shares: 0 },
    status: 'pending',
  },
];

export function ContentApproval() {
  const [selectedContent, setSelectedContent] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');

  const handleApprove = (contentId: number) => {
    console.log(`[v0] Approving content ${contentId}`);
    // Handle approval logic
  };

  const handleReject = (contentId: number) => {
    console.log(
      `[v0] Rejecting content ${contentId} with feedback: ${feedback}`
    );
    // Handle rejection logic
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold'>Content Approval</h2>
          <p className='text-muted-foreground'>
            Review and approve creator content before it goes live
          </p>
        </div>
        <Badge variant='secondary'>{pendingContent.length} pending</Badge>
      </div>

      <div className='grid lg:grid-cols-2 gap-6'>
        {/* Content List */}
        <div className='space-y-4'>
          {pendingContent.map(content => (
            <Card
              key={content.id}
              className={`cursor-pointer transition-all ${selectedContent === content.id ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setSelectedContent(content.id)}
            >
              <CardContent className='p-4'>
                <div className='flex items-start space-x-3'>
                  <Avatar className='w-10 h-10'>
                    <AvatarImage
                      src={content.avatar || '/placeholder.svg'}
                      alt={content.creator}
                    />
                    <AvatarFallback>
                      {content.creator
                        .split(' ')
                        .map(n => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center space-x-2 mb-1'>
                      <span className='font-semibold text-sm'>
                        {content.creator}
                      </span>
                      <Badge variant='outline' className='text-xs'>
                        {content.platform}
                      </Badge>
                      <Badge variant='secondary' className='text-xs'>
                        {content.type}
                      </Badge>
                    </div>
                    <p className='text-sm text-muted-foreground mb-2'>
                      {content.handle}
                    </p>
                    <p className='text-sm line-clamp-2'>{content.content}</p>
                    <p className='text-xs text-muted-foreground mt-2'>
                      Submitted {content.submittedAt}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Preview */}
        {selectedContent && (
          <div className='space-y-4'>
            {(() => {
              const content = pendingContent.find(
                c => c.id === selectedContent
              );
              if (!content) return null;

              return (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className='text-lg'>Content Preview</CardTitle>
                      <CardDescription>
                        Review content before approval
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      {/* Mock Social Media Post */}
                      <div className='border rounded-lg p-4 bg-white'>
                        <div className='flex items-center space-x-3 mb-3'>
                          <Avatar className='w-8 h-8'>
                            <AvatarImage
                              src={content.avatar || '/placeholder.svg'}
                              alt={content.creator}
                            />
                            <AvatarFallback>
                              {content.creator
                                .split(' ')
                                .map(n => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className='font-semibold text-sm'>
                              {content.creator}
                            </div>
                            <div className='text-xs text-muted-foreground'>
                              {content.handle}
                            </div>
                          </div>
                        </div>

                        <div className='mb-3'>
                          <img
                            src={content.image || '/placeholder.svg'}
                            alt='Content preview'
                            className='w-full rounded-lg'
                          />
                        </div>

                        <p className='text-sm mb-3'>{content.content}</p>

                        <div className='flex items-center space-x-4 text-muted-foreground'>
                          <div className='flex items-center space-x-1'>
                            <Heart className='w-4 h-4' />
                            <span className='text-xs'>
                              {content.metrics.likes}
                            </span>
                          </div>
                          <div className='flex items-center space-x-1'>
                            <MessageCircle className='w-4 h-4' />
                            <span className='text-xs'>
                              {content.metrics.comments}
                            </span>
                          </div>
                          <div className='flex items-center space-x-1'>
                            <Share className='w-4 h-4' />
                            <span className='text-xs'>
                              {content.metrics.shares}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Feedback */}
                      <div className='space-y-2'>
                        <label className='text-sm font-medium'>
                          Feedback (optional)
                        </label>
                        <Textarea
                          placeholder='Add feedback or revision requests...'
                          value={feedback}
                          onChange={e => setFeedback(e.target.value)}
                          rows={3}
                        />
                      </div>

                      {/* Actions */}
                      <div className='flex space-x-3'>
                        <Button
                          className='flex-1'
                          onClick={() => handleApprove(content.id)}
                        >
                          <Check className='w-4 h-4 mr-2' />
                          Approve
                        </Button>
                        <Button
                          variant='outline'
                          className='flex-1 bg-transparent'
                          onClick={() => handleReject(content.id)}
                        >
                          <X className='w-4 h-4 mr-2' />
                          Request Changes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
