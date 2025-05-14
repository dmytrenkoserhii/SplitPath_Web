'use client';

import { friendsService } from '@/services';
import { Friend } from '@/types/friends';
import { User } from '@/types/user';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';

interface FriendsListProps {
  friends: Friend[];
  currentUser: User;
}

export const FriendsList = ({ friends, currentUser }: FriendsListProps) => {
  const router = useRouter();

  const onDelete = async (friendId: number) => {
    const response = await friendsService().deleteFriend(friendId);
    if (response.response.ok) {
      notifications.show({
        title: 'Friend deleted',
        message: 'Friend deleted successfully',
        color: 'green',
      });
    } else {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete friend',
        color: 'red',
      });
    }
  };

  const onMessage = async (friendId: number) => {
    router.push(`/chats/${friendId}`);
  };

  return <div>FriendsList</div>;
};
