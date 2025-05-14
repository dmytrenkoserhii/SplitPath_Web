'use client';

import { useRouter } from 'next/navigation';

import { Avatar, Box, Button, Group, Paper, Stack, Text } from '@mantine/core';

import { User } from '@/types/user';
import { Friend } from '@/types/friends';

interface PendingRequestsListItemProps {
  friend: Friend;
  onAcceptIncoming: (id: number) => void;
  onRejectIncoming: (id: number) => void;
  onDeleteOutgoing: (id: number) => void;
  currentUser: User;
}

export const PendingRequestsListItem = ({
  friend,
  onAcceptIncoming,
  onRejectIncoming,
  onDeleteOutgoing,
  currentUser,
}: PendingRequestsListItemProps) => {
  const router = useRouter();

  const onFriendClick = () => {
    router.push(`/friends/${friend.id}`);
  };

  const onAcceptIncomingClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onAcceptIncoming(friend.id);
  };

  const onRejectIncomingClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onRejectIncoming(friend.id);
  };

  const onDeleteOutgoingClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDeleteOutgoing(friend.id);
  };

  const userToDisplay =
    friend.sender.id === currentUser.id ? friend.receiver : friend.sender;
  const actionButtons =
    currentUser.id === friend.sender.id ? (
      <Button
        color='red'
        variant='outline'
        radius='sm'
        onClick={onDeleteOutgoingClick}
      >
        Delete
      </Button>
    ) : (
      <>
        <Button
          color='green'
          variant='outline'
          radius='sm'
          onClick={onAcceptIncomingClick}
        >
          Accept
        </Button>
        <Button
          color='red'
          variant='outline'
          radius='sm'
          onClick={onRejectIncomingClick}
        >
          Reject
        </Button>
      </>
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

        <Group gap='xs'>{actionButtons}</Group>
      </Group>
    </Paper>
  );
};
