'use client';

import { useMessages, MessagesView } from '@/app/features/messages';

export default function CreatorMessagesPage() {
  const {
    user,
    threads,
    selectedThread,
    messages,
    newMessage,
    setNewMessage,
    handleSelectThread,
    handleSendMessage,
  } = useMessages();

  return (
    <MessagesView
      user={user}
      threads={threads}
      selectedThread={selectedThread}
      messages={messages}
      newMessage={newMessage}
      onNewMessageChange={setNewMessage}
      onSelectThread={handleSelectThread}
      onSendMessage={handleSendMessage}
    />
  );
}
