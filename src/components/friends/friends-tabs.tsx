'use client';

import React from 'react';

import { Center, Loader, Tabs, Text } from '@mantine/core';

import { useQuery } from '@tanstack/react-query';

import { FriendsList, PendingRequestsList, RejectedRequestsList } from '@/components/friends';
import { FriendRequestDirection, FriendStatus, ReactQueryTags } from '@/enums';
import { queryClient } from '@/lib';
import { friendsService, usersService } from '@/services';
import { Friend } from '@/types/friends';
import { User } from '@/types/user';

export const FriendsTabs = () => {
  const {
    data: userData,
    isLoading: isUserLoading,
    error: userError,
  } = useQuery<User>({
    queryKey: [ReactQueryTags.USER],
    queryFn: () =>
      usersService()
        .getCurrent()
        .then((res) => res.data),
  });

  const { data: friendsData, isLoading: isFriendsLoading } = useQuery({
    queryKey: [ReactQueryTags.FRIENDS],
    queryFn: () =>
      friendsService()
        .getFriendsList()
        .then((res) => res.data),
    enabled: !!userData,
  });

  const { data: incomingRequestsData, isLoading: isIncomingRequestsLoading } = useQuery({
    queryKey: [ReactQueryTags.FRIEND_REQUESTS_INCOMING],
    queryFn: () =>
      friendsService()
        .getFriendRequests({
          status: FriendStatus.PENDING,
          direction: FriendRequestDirection.INCOMING,
          page: 1,
          limit: 10,
        })
        .then((res) => res.data),
    enabled: !!userData,
  });

  const { data: outgoingRequestsData, isLoading: isOutgoingRequestsLoading } = useQuery({
    queryKey: [ReactQueryTags.FRIEND_REQUESTS_OUTGOING],
    queryFn: () =>
      friendsService()
        .getFriendRequests({
          status: FriendStatus.PENDING,
          direction: FriendRequestDirection.OUTGOING,
          page: 1,
          limit: 10,
        })
        .then((res) => res.data),
    enabled: !!userData,
  });

  const { data: rejectedIncomingRequestsData, isLoading: isRejectedIncomingLoading } = useQuery({
    queryKey: [ReactQueryTags.FRIEND_REQUESTS_REJECTED_INCOMING],
    queryFn: () =>
      friendsService()
        .getFriendRequests({
          status: FriendStatus.REJECTED,
          direction: FriendRequestDirection.INCOMING,
          page: 1,
          limit: 10,
        })
        .then((res) => res.data),
    enabled: !!userData,
  });

  const { data: rejectedOutgoingRequestsData, isLoading: isRejectedOutgoingLoading } = useQuery({
    queryKey: [ReactQueryTags.FRIEND_REQUESTS_REJECTED_OUTGOING],
    queryFn: () =>
      friendsService()
        .getFriendRequests({
          status: FriendStatus.REJECTED,
          direction: FriendRequestDirection.OUTGOING,
          page: 1,
          limit: 10,
        })
        .then((res) => res.data),
    enabled: !!userData,
  });

  const { data: onlineStatuses, isLoading: isOnlineStatusLoading } = useQuery<{
    [key: number]: boolean;
  }>({
    queryKey: [ReactQueryTags.FRIENDS_ONLINE_STATUS],
    queryFn: () =>
      friendsService()
        .getFriendsOnlineStatus()
        .then((res) => res.data),
    enabled: !!friendsData && friendsData.items.length > 0,
  });

  // Separate effect for merging online statuses
  React.useEffect(() => {
    if (friendsData && onlineStatuses && userData) {
      const updatedFriendsItems = friendsData.items.map((friend) => {
        const friendUser = friend.sender.id === userData.id ? friend.receiver : friend.sender;
        const isOnline = onlineStatuses[friendUser.id] || false;

        if (friend.sender.id === friendUser.id) {
          return { ...friend, sender: { ...friend.sender, isOnline } };
        } else {
          return { ...friend, receiver: { ...friend.receiver, isOnline } };
        }
      });

      queryClient.setQueryData(
        [ReactQueryTags.FRIENDS],
        (oldData: { items: Friend[]; meta?: any } | undefined) => ({
          ...oldData,
          items: updatedFriendsItems,
        }),
      );
    }
  }, [friendsData, onlineStatuses, userData, queryClient]);

  if (isUserLoading) {
    return (
      <Center py="xl">
        <Loader size="md" />
      </Center>
    );
  }

  if (userError || !userData) {
    return (
      <Center py="xl">
        <Text c="red">Failed to load user data</Text>
      </Center>
    );
  }

  const isPendingLoading = isIncomingRequestsLoading || isOutgoingRequestsLoading;
  const isRejectedLoading = isRejectedIncomingLoading || isRejectedOutgoingLoading;

  return (
    <Tabs color="primary" defaultValue="friends">
      <Tabs.List mb="md" grow>
        <Tabs.Tab value="friends" color="primary">
          Friends ({isFriendsLoading ? '...' : (friendsData?.items?.length ?? 0)})
        </Tabs.Tab>
        <Tabs.Tab value="pending" color="blue">
          Pending ({isPendingLoading ? '...' : (incomingRequestsData?.items?.length ?? 0)})
        </Tabs.Tab>
        <Tabs.Tab value="rejected" color="red">
          Rejected ({isRejectedLoading ? '...' : (rejectedIncomingRequestsData?.items?.length ?? 0)}
          )
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="friends">
        {isFriendsLoading ? (
          <Center py="md">
            <Loader size="sm" />
          </Center>
        ) : (
          <FriendsList friends={friendsData?.items ?? []} currentUser={userData} />
        )}
      </Tabs.Panel>

      <Tabs.Panel value="pending">
        {isPendingLoading ? (
          <Center py="md">
            <Loader size="sm" />
          </Center>
        ) : (
          <PendingRequestsList
            incomingRequests={incomingRequestsData?.items ?? []}
            outgoingRequests={outgoingRequestsData?.items ?? []}
            currentUser={userData}
          />
        )}
      </Tabs.Panel>

      <Tabs.Panel value="rejected">
        {isRejectedLoading ? (
          <Center py="md">
            <Loader size="sm" />
          </Center>
        ) : (
          <RejectedRequestsList
            incomingRejected={rejectedIncomingRequestsData?.items ?? []}
            outgoingRejected={rejectedOutgoingRequestsData?.items ?? []}
            currentUser={userData}
          />
        )}
      </Tabs.Panel>
    </Tabs>
  );
};
