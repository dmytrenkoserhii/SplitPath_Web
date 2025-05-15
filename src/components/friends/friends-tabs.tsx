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

export const FriendsTabs = () => {
  // Fetch current user data
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

  // Fetch friends list
  const { data: friendsData, isLoading: isFriendsLoading } = useQuery({
    queryKey: [ReactQueryTags.FRIENDS],
    queryFn: () =>
      friendsService()
        .getFriendsList()
        .then((res) => res.data),
    enabled: !!userData,
  });

  // Fetch incoming pending requests
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

  // Fetch outgoing pending requests
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

  // Fetch rejected incoming requests
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

  // Fetch rejected outgoing requests
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
