'use client';

import { chatsService } from '@/services';
import { PrivateMessage } from '@/types/chats';
import { PaginatedResponse } from '@/types/shared';
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import { ChatMessagesList } from './chat-messages-list';
import { User } from '@/types/user';
import { Box } from '@mantine/core';
import { ReactQueryTags } from '@/enums';

interface ChatMessagesListHandlerProps {
  friend: User;
  currentUserId: number;
}

export const ChatMessagesListHandler = ({
  friend,
  currentUserId,
}: ChatMessagesListHandlerProps) => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<
    PaginatedResponse<PrivateMessage>,
    Error,
    InfiniteData<PaginatedResponse<PrivateMessage>, number>,
    [ReactQueryTags.PRIVATE_CHAT_MESSAGES, number],
    number
  >({
    queryKey: [ReactQueryTags.PRIVATE_CHAT_MESSAGES, friend.id],
    queryFn: async ({ pageParam }) => {
      return chatsService().getChatMessages(friend.id, pageParam, 20);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.items || lastPage.items.length === 0) {
        return undefined;
      }
      const { currentPage, totalPages } = lastPage.meta;
      if (currentPage < totalPages) {
        return currentPage + 1;
      }
      return undefined;
    },
  });

  if (status === 'error' && error) {
    console.error('Error fetching chat messages:', error.message);
  }

  const allMessages: PrivateMessage[] = data
    ? data.pages
        .map((page) => page.items)
        .flat()
        .reverse()
    : [];

  const handleScrollToTop = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <Box
      data-testid='chat-messages-list-handler'
      mah='calc(100dvh - 60px - 60px - 35px - 100px)'
    >
      <ChatMessagesList
        messages={allMessages}
        currentUserId={currentUserId}
        friend={friend}
        isFetchingNextPage={isFetchingNextPage}
        onScrollToTop={handleScrollToTop}
      />
    </Box>
  );
};
