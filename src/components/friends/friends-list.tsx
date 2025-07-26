'use client';

import { useRouter } from 'next/navigation';

import { Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';

import { useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

import { ReactQueryTags } from '@/enums';
import { friendsService } from '@/services';
import { Friend } from '@/types/friends';
import { User } from '@/types/user';

import { FriendsListItem } from './friends-list-item';

interface FriendsListProps {
  friends: Friend[];
  currentUser: User;
}

export const FriendsList = ({ friends, currentUser }: FriendsListProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { deleteFriend } = friendsService();

  const deleteFriendMutation = useMutation({
    mutationFn: async (friendId: number) => {
      const serviceResponse = await deleteFriend(friendId);
      if (!serviceResponse.response.ok) {
        const errorMessage = serviceResponse.statusText || 'Failed to delete friend.';
        throw new Error(errorMessage);
      }
      return serviceResponse;
    },
    onSuccess: (data, variables) => {
      notifications.show({
        title: 'Friend deleted',
        message: 'Friend deleted successfully!',
        color: 'green',
      });
      queryClient.invalidateQueries({ queryKey: [ReactQueryTags.FRIENDS] });
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to delete friend.',
        color: 'red',
      });
    },
  });

  const handleDeleteFriend = (friendId: number) => {
    deleteFriendMutation.mutate(friendId);
  };

  const onMessage = async (friendId: number) => {
    router.push(`/chats/${friendId}`);
  };

  if (friends.length === 0) {
    return (
      <Text c="dimmed" ta="center" py="xl">
        No friends yet
      </Text>
    );
  }

  return (
    <Stack>
      {friends.map((friend) => (
        <FriendsListItem
          key={friend.id}
          friend={friend}
          currentUser={currentUser}
          onDelete={handleDeleteFriend}
          onMessage={onMessage}
        />
      ))}
    </Stack>
  );
};
