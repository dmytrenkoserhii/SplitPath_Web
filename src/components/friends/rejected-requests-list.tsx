'use client';

import { friendsService } from '@/services';
import { Friend } from '@/types/friends';
import { User } from '@/types/user';
import { notifications } from '@mantine/notifications';

interface RejectedRequestsListProps {
  incomingRejected: Friend[];
  outgoingRejected: Friend[];
  currentUser: User;
}

export const RejectedRequestsList: React.FC<RejectedRequestsListProps> = ({
  incomingRejected,
  outgoingRejected,
  currentUser,
}) => {
  const onAccept = async (requestId: number) => {
    const response = await friendsService().acceptFriendRequest(requestId);
    if (response.response.ok) {
      notifications.show({
        title: 'Friend request accepted',
        message: 'Friend request accepted successfully',
        color: 'green',
      });
    } else {
      notifications.show({
        title: 'Error',
        message: 'Failed to accept friend request',
        color: 'red',
      });
    }
  };
  const onResend = async (requestId: number) => {
    const response = await friendsService().resendFriendRequest(requestId);
    if (response.response.ok) {
      notifications.show({
        title: 'Friend request resent',
        message: 'Friend request resent successfully',
        color: 'green',
      });
    } else {
      notifications.show({
        title: 'Error',
        message: 'Failed to resend friend request',
        color: 'red',
      });
    }
  };

  return <div>RejectedRequestsList</div>;
};
