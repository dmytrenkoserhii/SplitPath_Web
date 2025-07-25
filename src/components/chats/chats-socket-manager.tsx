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

      const isMessageSentByMe = message.from.id === userData.id;

      queryClient.setQueryData<ChatPreview[]>(
        [ReactQueryTags.CHAT_PREVIEWS],
        (oldData) => {
          const chatExists = oldData?.some(
            (chatPreview) => chatPreview.userId === chatPartnerId
          );

          if (!chatExists) {
            queryClient.invalidateQueries({
              queryKey: [ReactQueryTags.CHAT_PREVIEWS],
            });
            return oldData;
          }

          return oldData?.map((chatPreview) =>
            chatPreview.userId === chatPartnerId
              ? {
                  ...chatPreview,
                  lastMessage: {
                    id: message.id,
                    content: message.content,
                    createdAt: message.createdAt,
                    isRead: message.read,
                    isSentByUser: isMessageSentByMe,
                  } as ChatPreview['lastMessage'],
                  unreadCount: isMessageSentByMe
                    ? chatPreview.unreadCount
                    : chatPreview.unreadCount + 1,
                }
              : chatPreview
          );
        }
      );
    };

    const onMessagesRead = (
      readStatuses: {
        messageId: number;
        userId: number;
        readAt: string;
      }[]
    ) => {
      if (!userData) {
        return;
      }

      const affectedChatPartnerIds = new Set<number>();
      readStatuses.forEach((status) => {
        queryClient
          .getQueryCache()
          .getAll()
          .forEach((query) => {
            const queryKey = query.queryKey;
            if (
              queryKey[0] === ReactQueryTags.PRIVATE_CHAT_MESSAGES &&
              typeof queryKey[1] === 'number'
            ) {
              const chatPartnerId = queryKey[1] as number;
              queryClient.setQueryData<
                InfiniteData<PaginatedResponse<PrivateMessage>>
              >(
                [ReactQueryTags.PRIVATE_CHAT_MESSAGES, chatPartnerId],
                (oldData) => {
                  if (!oldData) return undefined;
                  let updated = false;
                  const newPages = oldData.pages.map((page) => ({
                    ...page,
                    items: page.items.map((msg) => {
                      const status = readStatuses.find(
                        (rs) => rs.messageId === msg.id
                      );
                      if (status && !msg.read) {
                        updated = true;
                        if (
                          msg.from.id === userData.id &&
                          chatPartnerId === status.userId
                        ) {
                          return { ...msg, read: true };
                        }
                      }
                      return msg;
                    }),
                  }));
                  return updated ? { ...oldData, pages: newPages } : oldData;
                }
              );
            }
          });
      });

      queryClient.setQueryData<ChatPreview[]>(
        [ReactQueryTags.CHAT_PREVIEWS],
        (oldData) => {
          if (!oldData) return [];

          return oldData.map((chatPreview) => {
            let newUnreadCount = chatPreview.unreadCount;
            let lastMessageIsRead = chatPreview.lastMessage?.isRead;

            readStatuses.forEach((status) => {
              if (status.userId === userData.id) {
                const queryState = queryClient
                  .getQueryCache()
                  .find<InfiniteData<PaginatedResponse<PrivateMessage>>>({
                    queryKey: [
                      ReactQueryTags.PRIVATE_CHAT_MESSAGES,
                      chatPreview.userId,
                    ],
                  });

                const messageWasFromThisChatPartner =
                  queryState?.state.data?.pages.some((page) =>
                    page.items.some(
                      (msg: PrivateMessage) =>
                        msg.id === status.messageId &&
                        msg.from.id === chatPreview.userId &&
                        msg.to.id === userData.id
                    )
                  );

                if (messageWasFromThisChatPartner && newUnreadCount > 0) {
                  newUnreadCount = Math.max(0, newUnreadCount - 1);
                }
              }

              if (
                chatPreview.lastMessage &&
                chatPreview.lastMessage.id === status.messageId &&
                chatPreview.lastMessage.isSentByUser &&
                status.userId === chatPreview.userId
              ) {
                lastMessageIsRead = true;
              }
            });

            return {
              ...chatPreview,
              unreadCount: newUnreadCount,
              lastMessage: chatPreview.lastMessage
                ? { ...chatPreview.lastMessage, isRead: lastMessageIsRead }
                : chatPreview.lastMessage,
            };
          });
        }
      );
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
    privateChatsSocket.on('messages_read', onMessagesRead);
    privateChatsSocket.on('typing_status', onTypingStatus);

    return () => {
      privateChatsSocket.off('new_private_message', onNewPrivateMessage);
      privateChatsSocket.off('messages_read', onMessagesRead);
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
