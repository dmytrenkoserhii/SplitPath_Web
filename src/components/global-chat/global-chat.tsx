'use client';

import { Modal } from '@mantine/core';
import { ActionIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { InfiniteData, useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { MessageCircle } from 'lucide-react';

import { ReactQueryTags } from '@/enums';
import { globalChatService, usersService } from '@/services';
import { GlobalMessage } from '@/types/global-chat';
import { PaginatedResponse } from '@/types/shared';
import { User } from '@/types/user';

import { GlobalChatInput } from './global-chat-input';
import { GlobalChatMessagesList } from './global-chat-messages-list';

export const GlobalChat = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const { data: userData } = useQuery<User>({
    queryKey: [ReactQueryTags.USER],
    queryFn: () =>
      usersService()
        .getCurrent()
        .then((res) => res.data),
  });

  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery<
    PaginatedResponse<GlobalMessage>,
    Error,
    InfiniteData<PaginatedResponse<GlobalMessage>, number>,
    [ReactQueryTags.GLOBAL_CHAT_MESSAGES],
    number
  >({
    queryKey: [ReactQueryTags.GLOBAL_CHAT_MESSAGES],
    queryFn: async ({ pageParam }) => {
      return globalChatService().getAllMessages(pageParam, 25);
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

  const allMessages: GlobalMessage[] = data
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
    <>
      <Modal opened={opened} onClose={close} title="Global Chat" size="xl">
        {userData && (
          <GlobalChatMessagesList
            messages={allMessages}
            currentUserId={userData.id}
            onScrollToTop={handleScrollToTop}
            isFetchingNextPage={isFetchingNextPage}
          />
        )}
        <GlobalChatInput />
      </Modal>

      <ActionIcon variant="filled" color="secondary" radius="xl" size="xl" onClick={open}>
        <MessageCircle size={24} />
      </ActionIcon>
    </>
  );
};
