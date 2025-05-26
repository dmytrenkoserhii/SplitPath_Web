import { Avatar, Group, Indicator, Paper, Stack, Text } from '@mantine/core';
import { ChatPreview } from '@/types/chats';
import dayjs from 'dayjs';
import Link from 'next/link';

interface ChatsListItemProps {
  chat: ChatPreview;
  isOpen: boolean;
  onlineStatus: boolean;
}

export const ChatsListItem = ({
  chat,
  isOpen,
  onlineStatus,
}: ChatsListItemProps) => {
  console.log(chat);
  return (
    <Link
      href={`/chats/${chat.userId}`}
      style={{ textDecoration: 'none' }}
      prefetch={false}
    >
      <Paper
        shadow='sm'
        withBorder
        style={{ cursor: 'pointer' }}
        styles={{
          root: {
            borderColor: isOpen ? 'var(--mantine-color-primary-5)' : '',
          },
        }}
      >
        <Group justify='space-between' p='sm' wrap='nowrap'>
          <Group gap='sm' wrap='nowrap'>
            <Indicator
              size={12}
              color='green'
              withBorder
              offset={6}
              position='bottom-end'
              processing
              disabled={!onlineStatus}
            >
              <Avatar
                src={chat.avatarUrl}
                size='md'
                radius='xl'
                color='initials'
                name={chat.username}
                variant='outline'
              />
            </Indicator>
            <Stack gap={4}>
              <Text fw={500}>{chat.username}</Text>
              <Text size='sm' c='dimmed' lineClamp={1}>
                {chat.isTyping ? 'Typing...' : chat.lastMessage.content}
              </Text>
            </Stack>
          </Group>

          <Stack gap={4} align='center'>
            <Text size='xs' c='dimmed'>
              {dayjs(chat.lastMessage.createdAt).format('HH:mm')}
            </Text>
            {chat.unreadCount ? (
              <Text
                size='xs'
                bg='secondary'
                c='white'
                px={8}
                py={2}
                style={{ borderRadius: '10px' }}
              >
                {chat.unreadCount}
              </Text>
            ) : null}
          </Stack>
        </Group>
      </Paper>
    </Link>
  );
};
