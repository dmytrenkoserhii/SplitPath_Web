'use client';

import { Stack, Paper, Group, Text } from '@mantine/core';
import { PrivateMessage } from '@/types/chats';
import { useInView } from 'react-intersection-observer';
import React from 'react';
import { Check, CheckCheck } from 'lucide-react';

interface ChatMessagesListItemProps {
  message: PrivateMessage;
  currentUserId: number;
  addMessageToMarkAsRead: (messageId: number) => void;
}

export const ChatMessagesListItem = ({
  message,
  currentUserId,
  addMessageToMarkAsRead,
}: ChatMessagesListItemProps) => {
  const isCurrentUser = message.from.id === currentUserId;

  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  React.useEffect(() => {
    if (inView && !isCurrentUser && !message.read) {
      addMessageToMarkAsRead(message.id);
    }
  }, [inView, isCurrentUser, message, addMessageToMarkAsRead]);

  const messagePosition = isCurrentUser ? 'flex-end' : 'flex-start';
  const messageBackgroundColor = isCurrentUser ? 'secondary.8' : 'dark.5';
  const messageTextColor = isCurrentUser ? 'white' : 'gray.3';

  const borderTopRightRadius = isCurrentUser ? 4 : 16;
  const borderTopLeftRadius = isCurrentUser ? 16 : 4;

  const messageTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Stack align={messagePosition} gap='xs' ref={ref}>
      <Group justify={messagePosition}>
        {isCurrentUser && (
          <Group mt='auto' pb='xs' align='center' justify='center' gap='xs'>
            {message.read ? (
              <CheckCheck
                size={16}
                style={{ color: 'var(--mantine-color-secondary-5)' }}
              />
            ) : (
              <Check size={16} />
            )}
            <Text size='xs' c='dimmed' mt='auto'>
              {messageTime}
            </Text>
          </Group>
        )}
        <Paper
          p='sm'
          radius='lg'
          style={{
            maxWidth: '70%',
            borderTopRightRadius,
            borderTopLeftRadius,
          }}
          bg={messageBackgroundColor}
          mb={6}
        >
          <Text
            c={messageTextColor}
            style={{
              wordBreak: 'break-word',
            }}
          >
            {message.content}
          </Text>
        </Paper>
        {!isCurrentUser && (
          <Group mt='auto' pb='xs'>
            <Text size='xs' c='dimmed' mt='auto'>
              {messageTime}
            </Text>
          </Group>
        )}
      </Group>
    </Stack>
  );
};
