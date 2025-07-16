import { Group, Paper, Stack, Text } from '@mantine/core';

import dayjs from 'dayjs';

import { GlobalMessage } from '@/types/global-chat';

interface GlobalChatMessagesListItemProps {
  message: GlobalMessage;
  currentUserId: number;
}

export const GlobalChatMessagesListItem = ({
  message,
  currentUserId,
}: GlobalChatMessagesListItemProps) => {
  const isCurrentUser = message.from.id === currentUserId;

  const messagePosition = isCurrentUser ? 'flex-end' : 'flex-start';
  const messageBackgroungColor = isCurrentUser ? 'secondary.8' : 'dark.5';
  const messageTextColor = isCurrentUser ? 'white' : 'gray.3';

  const borderTopRightRadius = isCurrentUser ? 4 : 16;
  const borderTopLeftRadius = isCurrentUser ? 16 : 4;

  const messageTime = dayjs(message.createdAt).format('HH:mm');

  return (
    <Stack align={messagePosition} gap="xs">
      <Group justify={messagePosition}>
        {isCurrentUser && (
          <Text size="xs" c="dimmed" mt="auto" pb="xs">
            {messageTime}
          </Text>
        )}

        {/* TODO: Add username */}
        <Paper
          p="sm"
          radius="lg"
          style={{
            maxWidth: '70%',
            borderTopRightRadius,
            borderTopLeftRadius,
          }}
          bg={messageBackgroungColor}
          mb={6}
        >
          <Text c={messageTextColor} style={{ wordBreak: 'break-word' }}>
            {message.content}
          </Text>
        </Paper>

        {!isCurrentUser && (
          <>
            <Text size="xs" c="dimmed" mt="auto" pb="xs">
              {messageTime}
            </Text>
          </>
        )}
      </Group>
    </Stack>
  );
};
