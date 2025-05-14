'use client';

import { friendsService } from '@/services';
import { Friend } from '@/types/friends';
import { User } from '@/types/user';
import { Tabs, Stack } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PendingRequestsListItem } from './pending-requests-list-item';

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
  const queryClient = useQueryClient();
  const { acceptFriendRequest, rejectFriendRequest, deleteFriend } =
    friendsService();

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

  const rejectRequestMutation = useMutation({
    mutationFn: (requestId: number) => rejectFriendRequest(requestId),
    onSuccess: () => {
      notifications.show({
        title: 'Friend request rejected',
        message: 'Friend request rejected successfully',
        color: 'green',
      });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
    onError: () => {
      notifications.show({
        title: 'Error',
        message: 'Failed to reject friend request',
        color: 'red',
      });
    },
  });

  const deleteRequestMutation = useMutation({
    mutationFn: (requestId: number) => deleteFriend(requestId),
    onSuccess: () => {
      notifications.show({
        title: 'Friend request deleted',
        message: 'Friend request deleted successfully',
        color: 'green',
      });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
    onError: () => {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete friend request',
        color: 'red',
      });
    },
  });

  const onAcceptIncoming = (requestId: number) => {
    acceptRequestMutation.mutate(requestId);
  };

  const onRejectIncoming = (requestId: number) => {
    rejectRequestMutation.mutate(requestId);
  };

  const onDeleteOutgoing = (requestId: number) => {
    deleteRequestMutation.mutate(requestId);
  };

  return (
    <Tabs orientation='vertical' defaultValue='incoming'>
      <Tabs.List mr='md'>
        <Tabs.Tab value='incoming'>
          Incoming ({incomingRequests.length})
        </Tabs.Tab>
        <Tabs.Tab value='outgoing'>
          Outgoing ({outgoingRequests.length})
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value='incoming'>
        <Stack>
          {incomingRequests.map((friend) => (
            <PendingRequestsListItem
              key={friend.id}
              friend={friend}
              onAcceptIncoming={onAcceptIncoming}
              onRejectIncoming={onRejectIncoming}
              onDeleteOutgoing={onDeleteOutgoing}
              currentUser={currentUser}
            />
          ))}
        </Stack>
      </Tabs.Panel>

      <Tabs.Panel value='outgoing'>
        <Stack>
          {outgoingRequests.map((friend) => (
            <PendingRequestsListItem
              key={friend.id}
              friend={friend}
              onAcceptIncoming={onAcceptIncoming}
              onRejectIncoming={onRejectIncoming}
              onDeleteOutgoing={onDeleteOutgoing}
              currentUser={currentUser}
            />
          ))}
        </Stack>
      </Tabs.Panel>
    </Tabs>
  );
};
