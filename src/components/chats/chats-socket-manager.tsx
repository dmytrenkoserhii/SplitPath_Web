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

      // Determine if the message was sent by the current user
      const isMessageSentByMe = message.from.id === userData.id;

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
                    isSentByUser: isMessageSentByMe, // Use the determined flag
                  } as ChatPreview['lastMessage'],
                  // Only increment unreadCount if the message was NOT sent by the current user
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
      console.log('messages_read', readStatuses);

      if (!userData) {
        return;
      } // Collect unique chat partner IDs affected by these read statuses

      const affectedChatPartnerIds = new Set<number>();
      console.log('affectedChatPartnerIds', readStatuses);
      readStatuses.forEach((status) => {
        // Assuming the `userId` in readStatus is the reader's ID.
        // We need to find the sender of the message to update their chat preview.
        // This means we might need the message itself from the cache or more context.
        // For now, let's assume if the current user sent the message, and it's marked read,
        // it means the recipient (chat partner) read it.
        // If the current user is the one who read the message, this update is for their own view.

        // To accurately update, we need to know who the sender of the message is.
        // The server sends `readStatuses` without the sender's ID of the original message.
        // We might need to adjust the server to include `senderId` in `readStatus` or
        // fetch the message from the cache to determine its sender.
        // For simplicity, let's just mark the message as read in relevant chats.

        // Update individual chat messages
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
                        updated = true; // Determine if the message was sent by the current user // If it was, and the recipient (chat partner) read it, then mark it read for the current user's view. // If the current user is the reader (status.userId), then it was a message sent to them that they just read. // We primarily care about messages *sent by* the current user being read by the recipient.
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
              // Check if the read message belongs to this chat preview
              // This requires a more robust way to link `messageId` to `chatPreview.userId`.
              // We'll assume if the current user *is* the reader (status.userId), and the message was sent to them by this chat partner,
              // then the unread count should decrease.
              // If the current user *sent* the message, and it's now marked read, then the `isRead` status of the last message might change.

              // If the message is part of this chat, and the current user read it
              if (status.userId === userData.id) {
                // This means a message *from* this chat partner *to* the current user was read.
                // We need to identify messages sent by `chatPreview.userId` to `userData.id`
                // that were marked read in `readStatuses`.
                // For simplicity, we just decrement the unread count as messages are marked read by the current user.
                const queryState = queryClient
                  .getQueryCache()
                  .find<InfiniteData<PaginatedResponse<PrivateMessage>>>({
                    // Explicitly type the find result
                    queryKey: [
                      ReactQueryTags.PRIVATE_CHAT_MESSAGES,
                      chatPreview.userId,
                    ],
                  });

                // Check if queryState and its data exist before accessing pages
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
              } // If the current user sent the message and it was read by the chat partner

              if (
                chatPreview.lastMessage &&
                chatPreview.lastMessage.id === status.messageId &&
                chatPreview.lastMessage.isSentByUser &&
                status.userId === chatPreview.userId
              ) {
                // The chat partner read it
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
