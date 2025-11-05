import type { Notification } from '@/app/types';

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

