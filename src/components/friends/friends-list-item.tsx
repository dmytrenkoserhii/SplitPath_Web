'use client';

import {
  Avatar,
  Box,
  Button,
  Group,
  Indicator,
  Paper,
  Stack,
  Text,
} from '@mantine/core';

import { User } from '@/types/user';
import { Friend } from '@/types/friends';
import { useRouter } from 'next/navigation';

interface FriendsListItemProps {
  friend: Friend;
  currentUser: User;
  onDelete: (id: number) => void;
  onMessage: (id: number) => void;
}

export const FriendsListItem = ({
  friend,
  currentUser,
  onDelete,
  onMessage,
}: FriendsListItemProps) => {
  const router = useRouter();

  const onFriendClick = () => {
    router.push(`/friends/${friend.id}`);
  };

  const onMessageClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    // We need to pass the user id, not the friend id
    // We search for the user and not friend request
    onMessage(userToDisplay.id);
  };

  const onDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDelete(friend.id);
  };

  const userToDisplay =
    friend.sender.id === currentUser.id ? friend.receiver : friend.sender;
  const isFriendOnline = userToDisplay.isOnline === true;

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
            <Indicator
              size={12}
              color='green'
              withBorder
              offset={6}
              position='bottom-end'
              processing
              disabled={!isFriendOnline}
            >
              <Avatar
                src={userToDisplay.account?.avatarUrl}
                size='md'
                radius='xl'
                color='initials'
                name={userToDisplay.account.username}
                variant='outline'
              />
            </Indicator>
          </Box>
          <Stack gap={0}>
            <Text fw={500}>{userToDisplay.account.username}</Text>
            <Text c='dimmed'>{userToDisplay.email}</Text>
          </Stack>
        </Group>

        <Group gap='xs'>
          <Button
            color='blue'
            variant='outline'
            radius='sm'
            onClick={onMessageClick}
          >
            Message
          </Button>
          <Button
            color='red'
            variant='outline'
            radius='sm'
            onClick={onDeleteClick}
          >
            Delete
          </Button>
        </Group>
      </Group>
    </Paper>
  );
};
