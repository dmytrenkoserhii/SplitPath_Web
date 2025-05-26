'use client';

import { ReactQueryTags } from '@/enums';
import { getPrivateChatsSocket } from '@/lib';
import { usersService } from '@/services';
import { PrivateMessage, ChatPreview } from '@/types/chats';
import { User } from '@/types/user';
import { PaginatedResponse } from '@/types/shared';
import { InfiniteData, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';

export const ChatsSocketManager = () => {
  const privateChatsSocket = React.useMemo(() => getPrivateChatsSocket(), []);
  const queryClient = useQueryClient();

  const { data: userData } = useQuery<User>({
    queryKey: [ReactQueryTags.USER],
    queryFn: () =>
      usersService()
        .getCurrent()
        .then((res) => res.data),
  });

  React.useEffect(() => {
    const onNewPrivateMessage = (message: PrivateMessage) => {
      console.log('new_private_message', message);

      if (!userData) {
        return;
      }

      const chatPartnerId =
        message.from.id === userData.id ? message.to.id : message.from.id;

      const queryKey = [ReactQueryTags.PRIVATE_CHAT_MESSAGES, chatPartnerId];

      queryClient.setQueryData<InfiniteData<PaginatedResponse<PrivateMessage>>>(
        queryKey,
        (oldData) => {
          if (!oldData) {
            return undefined;
          }

          const newData = {
            ...oldData,
            pages: oldData.pages.map((page, index) => {
              // When we fetch the initial messages, it's the first page
              // When we scroll to top and get the next page, it's the second+ page
              // When we receive a new message, we want to show it as the latest message
              // So we need to insert it at the beginning of the first page
              if (index === 0) {
                return {
                  ...page,
                  items: [message, ...page.items],
                };
              }
              return page;
            }),
          };
          return newData;
        }
      );

      queryClient.setQueryData<ChatPreview[]>(
        [ReactQueryTags.CHAT_PREVIEWS],
        (oldData) => {
          return oldData?.map((chatPreview) =>
            chatPreview.userId === chatPartnerId
              ? {
                  ...chatPreview,
                  lastMessage: {
                    id: message.id,
                    content: message.content,
                    createdAt: message.createdAt,
                    isRead: message.read,
                    isSentByUser: message.from.id === userData.id,
                  } as ChatPreview['lastMessage'],
                  unreadCount: chatPreview.unreadCount + 1,
                }
              : chatPreview
          );
        }
      );
    };

    const onMessageRead = (message: PrivateMessage) => {
      console.log('message_read', message);
    };

    const onTypingStatus = ({
      userId,
      receiverId,
      isTyping,
    }: {
      userId: number;
      receiverId: string;
      isTyping: boolean;
    }) => {
      console.log('typing_status', userId, receiverId, isTyping);

      if (!userData) {
        return;
      }

      queryClient.setQueryData<ChatPreview[]>(
        [ReactQueryTags.CHAT_PREVIEWS],
        (oldData) => {
          if (!oldData) {
            return [];
          }

          return oldData.map((chat) =>
            chat.userId === userId ? { ...chat, isTyping } : chat
          );
        }
      );
    };

    privateChatsSocket.on('new_private_message', onNewPrivateMessage);
    privateChatsSocket.on('message_read', onMessageRead);
    privateChatsSocket.on('typing_status', onTypingStatus);

    return () => {
      privateChatsSocket.off('new_private_message', onNewPrivateMessage);
      privateChatsSocket.off('message_read', onMessageRead);
      privateChatsSocket.off('typing_status', onTypingStatus);
    };
  }, [privateChatsSocket, userData, queryClient]);

  React.useEffect(() => {
    privateChatsSocket.connect();

    return () => {
      privateChatsSocket.disconnect();
    };
  }, []);

  return null;
};
