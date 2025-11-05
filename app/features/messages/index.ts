// Public API for messages feature
export { useMessages } from './lib/use-messages';
export { MessagesView } from './ui/messages-view';
export {
  getMessages,
  sendMessage,
  getMessageThreads,
  markMessagesAsRead,
  getTotalUnreadMessages,
} from './lib/message-api';
export type { Message, MessageThread } from '@/app/types';

