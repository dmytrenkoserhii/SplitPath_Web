'use client';

import { friendsService } from '@/services';
import { Friend } from '@/types/friends';
import { User } from '@/types/user';
import { notifications } from '@mantine/notifications';

interface PendingRequestsListProps {
  incomingRequests: Friend[];
  outgoingRequests: Friend[];
  currentUser: User;
}

export const PendingRequestsList: React.FC<PendingRequestsListProps> = ({
  incomingRequests,
  outgoingRequests,
  currentUser,
}) => {
  const onAcceptIncoming = async (requestId: number) => {
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

  const onRejectIncoming = async (requestId: number) => {
    const response = await friendsService().rejectFriendRequest(requestId);
    if (response.response.ok) {
      notifications.show({
        title: 'Friend request rejected',
        message: 'Friend request rejected successfully',
        color: 'green',
      });
    } else {
      notifications.show({
        title: 'Error',
        message: 'Failed to reject friend request',
        color: 'red',
      });
    }
  };

  const onDeleteOutgoing = async (requestId: number) => {
    const response = await friendsService().deleteFriend(requestId);
    if (response.response.ok) {
      notifications.show({
        title: 'Friend request deleted',
        message: 'Friend request deleted successfully',
        color: 'green',
      });
    } else {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete friend request',
        color: 'red',
      });
    }
  };

  return <div>PendingRequestsList</div>;
};
