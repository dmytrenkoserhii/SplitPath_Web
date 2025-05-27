'use client';

import { ReactQueryTags } from '@/enums';
import { chatsService } from '@/services';
import { ChatPreview, PrivateMessage } from '@/types/chats';
import { PaginatedResponse } from '@/types/shared';
import { useDebouncedCallback } from '@mantine/hooks';
import { useQueryClient, InfiniteData } from '@tanstack/react-query';
import React from 'react';

export const useMarkMessagesAsRead = () => {
  const queryClient = useQueryClient();
  const messagesToMarkReadRef = React.useRef<number[]>([]);

  const markMessagesAsReadDebounced = useDebouncedCallback(async () => {
    console.log('MARKING MESSAGES AS READ');
    if (messagesToMarkReadRef.current.length === 0) {
      return;
    }

    const messageIds = [...messagesToMarkReadRef.current];
    messagesToMarkReadRef.current = [];

    try {
      console.log('MARKING MESSAGES AS READ 2');
      await chatsService().markMultipleAsRead(messageIds);

      // // Update message list query data
      // queryClient
      //   .getQueryCache()
      //   .getAll()
      //   .forEach((query) => {
      //     const queryKey = query.queryKey;
      //     if (
      //       queryKey[0] === ReactQueryTags.PRIVATE_CHAT_MESSAGES &&
      //       queryKey[1]
      //     ) {
      //       const friendId = queryKey[1] as number;
      //       queryClient.setQueryData<
      //         InfiniteData<PaginatedResponse<PrivateMessage>>
      //       >([ReactQueryTags.PRIVATE_CHAT_MESSAGES, friendId], (oldData) => {
      //         if (!oldData) return undefined;
      //         return {
      //           ...oldData,
      //           pages: oldData.pages.map((page) => ({
      //             ...page,
      //             items: page.items.map((msg) =>
      //               messageIds.includes(msg.id) ? { ...msg, read: true } : msg
      //             ),
      //           })),
      //         };
      //       });
      //     }
      //   });

      // // Update chat previews query data
      // queryClient.setQueryData<ChatPreview[]>(
      //   [ReactQueryTags.CHAT_PREVIEWS],
      //   (oldData) =>
      //     oldData?.map((chatPreview) => {
      //       // Find if any of the marked messages belong to this chat preview
      //       // This simple check assumes the last message for a chat is marked as read.
      //       // A more robust solution might involve iterating through messageIds and
      //       // checking if they were sent by/to the user in this chat preview.
      //       // However, given the context of marking messages as read in the current chat view,
      //       // it's likely these messages do pertain to the active chat.
      //       const markedMessagesInThisChat = messageIds.filter((msgId) => {
      //         // This is a heuristic. Ideally, you'd know which chat each messageId belongs to.
      //         // For simplicity, we assume if we're marking messages read, it's for the currently viewed chat.
      //         // A more precise check would involve mapping messageId back to its `from.id` or `to.id`
      //         // and comparing with `chatPreview.userId`.
      //         return true; // placeholder, refine based on actual message structure and chat context
      //       }).length;

      //       // Decrement unread count by the number of messages successfully marked as read in this chat
      //       const newUnreadCount = Math.max(
      //         0,
      //         chatPreview.unreadCount - markedMessagesInThisChat
      //       );

      //       return {
      //         ...chatPreview,
      //         unreadCount: newUnreadCount,
      //         lastMessage:
      //           chatPreview.lastMessage &&
      //           messageIds.includes(chatPreview.lastMessage.id)
      //             ? { ...chatPreview.lastMessage, isRead: true }
      //             : chatPreview.lastMessage,
      //       };
      //     })
      // );
    } catch (error) {
      console.error('Failed to mark messages as read', error);
      // Optionally, re-add messages to the queue if the API call failed
      // messagesToMarkReadRef.current.push(...messageIds);
    }
  }, 500);

  const addMessageToMarkAsRead = React.useCallback(
    (messageId: number) => {
      if (!messagesToMarkReadRef.current.includes(messageId)) {
        messagesToMarkReadRef.current.push(messageId);
        markMessagesAsReadDebounced();
        console.log(messagesToMarkReadRef.current);
        console.log('DEBOUNCED');
      }
    },
    [markMessagesAsReadDebounced]
  );

  return { addMessageToMarkAsRead };
};
