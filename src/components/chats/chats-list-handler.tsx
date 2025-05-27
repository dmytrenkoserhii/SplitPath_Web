'use client';

import { useQuery } from '@tanstack/react-query';
import { chatsService, friendsService } from '@/services';
import { ChatsList } from '.';
import { Text } from '@mantine/core';
import { ReactQueryTags } from '@/enums';

interface ChatsListHandlerProps {
  id?: number;
}

export const ChatsListHandler = ({ id }: ChatsListHandlerProps) => {
  const {
    data: chatsPreviews,
    isLoading,
    error,
  } = useQuery({
    queryKey: [ReactQueryTags.CHAT_PREVIEWS],
    queryFn: () => chatsService().getChatPreviews(),
  });

  const { data: onlineStatuses, isLoading: isOnlineStatusLoading } = useQuery<{
    [key: number]: boolean;
  }>({
    queryKey: [ReactQueryTags.FRIENDS_ONLINE_STATUS],
    queryFn: () =>
      friendsService()
        .getFriendsOnlineStatus()
        .then((res) => res.data),
    enabled: !!chatsPreviews && chatsPreviews.length > 0,
  });

  if (isLoading) {
    return <Text>Loading chats...</Text>;
  }

  if (error) {
    return <Text>Error loading chats.</Text>;
  }

  return (
    <ChatsList
      id={id}
      chats={chatsPreviews || []}
      onlineStatuses={onlineStatuses || {}}
    />
  );
};
