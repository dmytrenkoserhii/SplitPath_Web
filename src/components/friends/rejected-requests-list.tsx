'use client';

import { friendsService } from '@/services';
import { Friend } from '@/types/friends';
import { User } from '@/types/user';
import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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
  const queryClient = useQueryClient();
  const { acceptFriendRequest, resendFriendRequest } = friendsService();

  const acceptRequestMutation = useMutation({
    mutationFn: (requestId: number) => acceptFriendRequest(requestId),
    onSuccess: () => {
      notifications.show({
        title: 'Friend request accepted',
        message: 'Friend request accepted successfully',
        color: 'green',
      });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
    onError: () => {
      notifications.show({
        title: 'Error',
        message: 'Failed to accept friend request',
        color: 'red',
      });
    },
  });

  const resendRequestMutation = useMutation({
    mutationFn: (requestId: number) => resendFriendRequest(requestId),
    onSuccess: () => {
      notifications.show({
        title: 'Friend request resent',
        message: 'Friend request resent successfully',
        color: 'green',
      });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
    onError: () => {
      notifications.show({
        title: 'Error',
        message: 'Failed to resend friend request',
        color: 'red',
      });
    },
  });

  const onAccept = (requestId: number) => {
    acceptRequestMutation.mutate(requestId);
  };

  const onResend = (requestId: number) => {
    resendRequestMutation.mutate(requestId);
  };

  return <div>RejectedRequestsList</div>;
};
