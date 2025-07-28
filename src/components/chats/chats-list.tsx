import { Stack, Text } from '@mantine/core';

import { ChatPreview } from '@/types/chats';

import { ChatsListItem } from './chats-list-item';

interface ChatListProps {
  id?: number;
  chats: ChatPreview[];
  onlineStatuses: { [key: number]: boolean };
}

export const ChatsList = ({ chats, id, onlineStatuses }: ChatListProps) => {
  if (chats.length === 0) {
    return (
      <Text c="dimmed" ta="center" py="xl">
        No chats
      </Text>
    );
  }

  return (
    <Stack>
      {chats.map((chat) => (
        <ChatsListItem
          key={chat.userId}
          chat={chat}
          isOpen={chat.userId === id}
          onlineStatus={onlineStatuses[chat.userId]}
        />
      ))}
    </Stack>
  );
};
