'use client';

import { Tabs, Loader, Center, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { friendsService, usersService } from '@/services';
import { FriendStatus, FriendRequestDirection, ReactQueryTags } from '@/enums';
import {
  FriendsList,
  PendingRequestsList,
  RejectedRequestsList,
} from '@/components/friends';
import { User } from '@/types/user';
import { getFriendsSocket, queryClient } from '@/lib';
import React from 'react';
import { Friend } from '@/types/friends';

const friendsSocket = getFriendsSocket();

export const FriendsTabs = () => {
  const [isConnected, setIsConnected] = React.useState(friendsSocket.connected);

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

  const { data: incomingRequestsData, isLoading: isIncomingRequestsLoading } =
    useQuery({
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

  const { data: outgoingRequestsData, isLoading: isOutgoingRequestsLoading } =
    useQuery({
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

  const {
    data: rejectedIncomingRequestsData,
    isLoading: isRejectedIncomingLoading,
  } = useQuery({
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

  const {
    data: rejectedOutgoingRequestsData,
    isLoading: isRejectedOutgoingLoading,
  } = useQuery({
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

  // --- WebSocket Logic ---
  React.useEffect(() => {
    const updateQueryItems = (
      queryKey: any[],
      updater: (items: Friend[] | undefined) => Friend[]
    ) => {
      queryClient.setQueryData(
        queryKey,
        (oldData: { items: Friend[]; meta?: any } | undefined) => {
          const oldItems = oldData?.items || [];
          const newItems = updater(oldItems);
          return { items: newItems, meta: oldData?.meta };
        }
      );
    };

    const onNewFriendRequest = (request: Friend) => {
      console.log('WS Event: new_friend_request', request);
      updateQueryItems(
        [ReactQueryTags.FRIEND_REQUESTS_INCOMING],
        (oldItems) => [request, ...(oldItems || [])]
      );
    };

    const onFriendRequestAccepted = (friend: Friend) => {
      console.log('WS Event: friend_request_accepted', friend);
      updateQueryItems([ReactQueryTags.FRIEND_REQUESTS_OUTGOING], (oldItems) =>
        (oldItems || []).filter((req) => req.id !== friend.id)
      );
      updateQueryItems([ReactQueryTags.FRIENDS], (oldItems) => [
        friend,
        ...(oldItems || []),
      ]);
    };

    const onFriendRequestRejected = (request: Friend) => {
      console.log('WS Event: friend_request_rejected', request);
      updateQueryItems([ReactQueryTags.FRIEND_REQUESTS_OUTGOING], (oldItems) =>
        (oldItems || []).filter((req) => req.id !== request.id)
      );
      updateQueryItems(
        [ReactQueryTags.FRIEND_REQUESTS_REJECTED_OUTGOING],
        (oldItems) => [request, ...(oldItems || [])]
      );
    };

    const onFriendDeleted = (friend: Friend) => {
      console.log('WS Event: friend_deleted', friend);
      updateQueryItems([ReactQueryTags.FRIENDS], (oldItems) =>
        (oldItems || []).filter((f) => f.id !== friend.id)
      );
    };

    const onFriendRequestResent = (request: Friend) => {
      console.log('WS Event: friend_request_resent', request);
      updateQueryItems(
        [ReactQueryTags.FRIEND_REQUESTS_REJECTED_INCOMING],
        (oldItems) => (oldItems || []).filter((req) => req.id !== request.id)
      );
      updateQueryItems(
        [ReactQueryTags.FRIEND_REQUESTS_INCOMING],
        (oldItems) => {
          const filteredItems = (oldItems || []).filter(
            (req) => req.id !== request.id
          );
          return [request, ...filteredItems];
        }
      );
    };

    const onFriendStatusChanged = ({
      userId,
      isOnline,
    }: {
      userId: number;
      isOnline: boolean;
    }) => {
      console.log('WS Event: friend_status_changed', { userId, isOnline });
      if (!userData) return;

      queryClient.setQueryData(
        [ReactQueryTags.FRIENDS_ONLINE_STATUS],
        (oldData: { [key: number]: boolean } | undefined) => {
          if (!oldData) return oldData;

          const newItems = { ...oldData, [userId]: isOnline };
          return newItems;
        }
      );
    };

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    friendsSocket.on('new_friend_request', onNewFriendRequest);
    friendsSocket.on('friend_request_accepted', onFriendRequestAccepted);
    friendsSocket.on('friend_request_rejected', onFriendRequestRejected);
    friendsSocket.on('friend_deleted', onFriendDeleted);
    friendsSocket.on('friend_request_resent', onFriendRequestResent);
    friendsSocket.on('friend_status_changed', onFriendStatusChanged);

    friendsSocket.on('connect', onConnect);
    friendsSocket.on('disconnect', onDisconnect);

    return () => {
      friendsSocket.off('new_friend_request', onNewFriendRequest);
      friendsSocket.off('friend_request_accepted', onFriendRequestAccepted);
      friendsSocket.off('friend_request_rejected', onFriendRequestRejected);
      friendsSocket.off('friend_deleted', onFriendDeleted);
      friendsSocket.off('friend_request_resent', onFriendRequestResent);
      friendsSocket.off('friend_status_changed', onFriendStatusChanged);

      friendsSocket.off('connect', onConnect);
      friendsSocket.off('disconnect', onDisconnect);
    };
  }, [queryClient, userData]);

  // Separate effect for merging online statuses
  React.useEffect(() => {
    console.log('RUN');
    if (friendsData && onlineStatuses && userData) {
      console.log('friendsData', friendsData);
      console.log('onlineStatuses', onlineStatuses);
      console.log('userData', userData);
      const updatedFriendsItems = friendsData.items.map((friend) => {
        const friendUser =
          friend.sender.id === userData.id ? friend.receiver : friend.sender;
        const isOnline = onlineStatuses[friendUser.id] || false;

        if (friend.sender.id === friendUser.id) {
          return { ...friend, sender: { ...friend.sender, isOnline } };
        } else {
          return { ...friend, receiver: { ...friend.receiver, isOnline } };
        }
      });
      console.log('updatedFriendsItems', updatedFriendsItems);

      queryClient.setQueryData(
        [ReactQueryTags.FRIENDS],
        (oldData: { items: Friend[]; meta?: any } | undefined) => ({
          ...oldData,
          items: updatedFriendsItems,
        })
      );
    }
  }, [friendsData, onlineStatuses, userData, queryClient]);

  if (isUserLoading) {
    return (
      <Center py='xl'>
        <Loader size='md' />
      </Center>
    );
  }

  if (userError || !userData) {
    return (
      <Center py='xl'>
        <Text c='red'>Failed to load user data</Text>
      </Center>
    );
  }

  const isPendingLoading =
    isIncomingRequestsLoading || isOutgoingRequestsLoading;
  const isRejectedLoading =
    isRejectedIncomingLoading || isRejectedOutgoingLoading;

  return (
    <Tabs color='primary' defaultValue='friends'>
      <Tabs.List mb='md' grow>
        <Tabs.Tab value='friends' color='primary'>
          Friends ({isFriendsLoading ? '...' : friendsData?.items?.length ?? 0})
        </Tabs.Tab>
        <Tabs.Tab value='pending' color='blue'>
          Pending (
          {isPendingLoading ? '...' : incomingRequestsData?.items?.length ?? 0})
        </Tabs.Tab>
        <Tabs.Tab value='rejected' color='red'>
          Rejected (
          {isRejectedLoading
            ? '...'
            : rejectedIncomingRequestsData?.items?.length ?? 0}
          )
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value='friends'>
        {isConnected ? (
          <Text>Connected to friends socket</Text>
        ) : (
          <Text>Not connected to friends socket</Text>
        )}
        {isFriendsLoading ? (
          <Center py='md'>
            <Loader size='sm' />
          </Center>
        ) : (
          <FriendsList
            friends={friendsData?.items ?? []}
            currentUser={userData}
          />
        )}
      </Tabs.Panel>

      <Tabs.Panel value='pending'>
        {isPendingLoading ? (
          <Center py='md'>
            <Loader size='sm' />
          </Center>
        ) : (
          <PendingRequestsList
            incomingRequests={incomingRequestsData?.items ?? []}
            outgoingRequests={outgoingRequestsData?.items ?? []}
            currentUser={userData}
          />
        )}
      </Tabs.Panel>

      <Tabs.Panel value='rejected'>
        {isRejectedLoading ? (
          <Center py='md'>
            <Loader size='sm' />
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
