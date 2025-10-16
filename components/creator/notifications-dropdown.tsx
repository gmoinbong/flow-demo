'use client';

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
} from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface NotificationsDropdownProps {
  userId: string;
}

export function NotificationsDropdown({ userId }: NotificationsDropdownProps) {
  const [notifications, setNotifications] = useState(getNotifications(userId));
  const [unreadCount, setUnreadCount] = useState(
    getUnreadNotificationCount(userId)
  );
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications(getNotifications(userId));
      setUnreadCount(getUnreadNotificationCount(userId));
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [userId]);

  const handleNotificationClick = (notification: any) => {
    markNotificationAsRead(notification.id);
    setNotifications(getNotifications(userId));
    setUnreadCount(getUnreadNotificationCount(userId));
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead(userId);
    setNotifications(getNotifications(userId));
    setUnreadCount(0);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'campaign_invite':
        return '🎯';
      case 'contract_update':
        return '📝';
      case 'payment':
        return '💰';
      case 'message':
        return '💬';
      case 'budget_change':
        return '📊';
      case 'content_approval':
        return '✅';
      default:
        return '🔔';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='relative'>
          <Bell className='h-5 w-5' />
          {unreadCount > 0 && (
            <Badge
              variant='destructive'
              className='absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs'
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-80'>
        <DropdownMenuLabel className='flex items-center justify-between'>
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant='ghost'
              size='sm'
              onClick={handleMarkAllAsRead}
              className='h-auto p-1 text-xs'
            >
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className='max-h-96 overflow-y-auto'>
          {notifications.length === 0 ? (
            <div className='p-4 text-center text-sm text-muted-foreground'>
              No notifications
            </div>
          ) : (
            notifications.slice(0, 10).map(notification => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${!notification.read ? 'bg-muted/50' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className='flex items-start gap-2 w-full'>
                  <span className='text-lg'>
                    {getNotificationIcon(notification.type)}
                  </span>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium leading-tight'>
                      {notification.title}
                    </p>
                    <p className='text-xs text-muted-foreground mt-1 line-clamp-2'>
                      {notification.message}
                    </p>
                    <p className='text-xs text-muted-foreground mt-1'>
                      {new Date(notification.createdAt).toLocaleDateString(
                        undefined,
                        {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className='w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1' />
                  )}
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
