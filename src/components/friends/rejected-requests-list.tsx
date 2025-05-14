'use client';

import { friendsService } from '@/services';
import { Friend } from '@/types/friends';
import { User } from '@/types/user';
import { Tabs, Stack } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RejectedRequestsListItem } from './rejected-requests-list-item';

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

  return (
    <Tabs orientation='vertical' defaultValue='incoming'>
      <Tabs.List mr='md'>
        <Tabs.Tab value='incoming' color='red'>
          Incoming ({incomingRejected.length})
        </Tabs.Tab>
        <Tabs.Tab value='outgoing' color='red'>
          Outgoing ({outgoingRejected.length})
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value='incoming'>
        <Stack>
          {incomingRejected.map((friend) => (
            <RejectedRequestsListItem
              key={friend.id}
              friend={friend}
              currentUser={currentUser}
              onAccept={onAccept}
              onResend={onResend}
            />
          ))}
        </Stack>
      </Tabs.Panel>

      <Tabs.Panel value='outgoing'>
        <Stack>
          {outgoingRejected.map((friend) => (
            <RejectedRequestsListItem
              key={friend.id}
              friend={friend}
              currentUser={currentUser}
              onAccept={onAccept}
              onResend={onResend}
            />
          ))}
        </Stack>
      </Tabs.Panel>
    </Tabs>
  );
};
