'use client';

import React from 'react';

import { useDebouncedCallback } from '@mantine/hooks';

import { chatsService } from '@/services';

export const useMarkMessagesAsRead = () => {
  const messagesToMarkReadRef = React.useRef<number[]>([]);

  const markMessagesAsReadDebounced = useDebouncedCallback(async () => {
    if (messagesToMarkReadRef.current.length === 0) {
      return;
    }

    const messageIds = [...messagesToMarkReadRef.current];
    messagesToMarkReadRef.current = [];

    try {
      await chatsService().markMultipleAsRead(messageIds);
    } catch (error) {
      console.error('Failed to mark messages as read', error);
    }
  }, 500);

  const addMessageToMarkAsRead = React.useCallback(
    (messageId: number) => {
      if (!messagesToMarkReadRef.current.includes(messageId)) {
        messagesToMarkReadRef.current.push(messageId);
        markMessagesAsReadDebounced();
      }
    },
    [markMessagesAsReadDebounced],
  );

  return { addMessageToMarkAsRead };
};
