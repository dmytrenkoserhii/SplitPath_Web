'use client';

import { Avatar, Box, Button, Group, Paper, Stack, Text } from '@mantine/core';

import { User } from '@/types/user';
import { Friend } from '@/types/friends';
import { useRouter } from 'next/navigation';

interface RejectedRequestsListItemProps {
  friend: Friend;
  currentUser: User;
  onAccept: (id: number) => void;
  onResend: (id: number) => void;
}

export const RejectedRequestsListItem = ({
  friend,
  currentUser,
  onAccept,
  onResend,
}: RejectedRequestsListItemProps) => {
  const router = useRouter();

  const onFriendClick = () => {
    router.push(`/friends/${friend.id}`);
  };

  const onAcceptClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onAccept(friend.id);
  };

  const onResendClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onResend(friend.id);
  };

  const userToDisplay =
    friend.sender.id === currentUser.id ? friend.receiver : friend.sender;
  const actionButton =
    currentUser.id === friend.sender.id ? (
      <Button
        color='blue'
        variant='outline'
        radius='sm'
        onClick={onResendClick}
      >
        Resend
      </Button>
    ) : (
      <Button
        color='green'
        variant='outline'
        radius='sm'
        onClick={onAcceptClick}
      >
        Accept
      </Button>
    );

  return (
    <Paper
      shadow='sm'
      withBorder
      style={{ cursor: 'pointer' }}
      onClick={onFriendClick}
    >
      <Group justify='space-between' p='sm'>
        <Group gap='sm'>
          <Box pos='relative'>
            <Avatar
              src={userToDisplay.account.avatarUrl}
              size='md'
              radius='xl'
              color='initials'
              name={userToDisplay.account.username}
              variant='outline'
            />
          </Box>
          <Stack gap={0}>
            <Text fw={500}>{userToDisplay.account.username}</Text>
            <Text c='dimmed'>{userToDisplay.email}</Text>
          </Stack>
        </Group>

        <Group gap='xs'>{actionButton}</Group>
      </Group>
    </Paper>
  );
};
