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

  // --- WebSocket Logic ---
  React.useEffect(() => {
    // Helper function to update query data
    const updateQueryItems = (
      queryKey: any[], // Replace 'any[]' with the actual tuple type [ReactQueryTags, ...]
      updater: (items: Friend[] | undefined) => Friend[]
    ) => {
      queryClient.setQueryData(
        queryKey,
        (oldData: { items: Friend[]; meta?: any } | undefined) => {
          const oldItems = oldData?.items || [];
          const newItems = updater(oldItems);
          // Preserve metadata if it exists
          return { items: newItems, meta: oldData?.meta };
        }
      );
    };

    // Event: New Friend Request (You receive this if you are the receiver)
    const onNewFriendRequest = (request: Friend) => {
      console.log('WS Event: new_friend_request', request);
      // Add the new request to the incoming pending list
      updateQueryItems(
        [ReactQueryTags.FRIEND_REQUESTS_INCOMING],
        (oldItems) => [request, ...(oldItems || [])] // Add the new request to the beginning
      );
    };

    // Event: Friend Request Accepted (You receive this if you were the sender)
    const onFriendRequestAccepted = (friend: Friend) => {
      console.log('WS Event: friend_request_accepted', friend);
      // Remove from outgoing pending list
      updateQueryItems(
        [ReactQueryTags.FRIEND_REQUESTS_OUTGOING],
        (oldItems) => (oldItems || []).filter((req) => req.id !== friend.id) // Filter out the request
      );
      // Add to the friends list
      updateQueryItems(
        [ReactQueryTags.FRIENDS],
        (oldItems) => [friend, ...(oldItems || [])] // Add the new friend
      );
    };

    // Event: Friend Request Rejected (You receive this if you were the sender)
    const onFriendRequestRejected = (request: Friend) => {
      console.log('WS Event: friend_request_rejected', request);
      // Remove from outgoing pending list
      updateQueryItems([ReactQueryTags.FRIEND_REQUESTS_OUTGOING], (oldItems) =>
        (oldItems || []).filter((req) => req.id !== request.id)
      );
      // Add to the outgoing rejected list
      updateQueryItems(
        [ReactQueryTags.FRIEND_REQUESTS_REJECTED_OUTGOING],
        (oldItems) => [request, ...(oldItems || [])]
      );
    };

    // Event: Friend Deleted (You receive this if you were sender or receiver)
    const onFriendDeleted = (friend: Friend) => {
      console.log('WS Event: friend_deleted', friend);
      // Remove from friends list
      updateQueryItems(
        [ReactQueryTags.FRIENDS],
        (oldItems) => (oldItems || []).filter((f) => f.id !== friend.id) // Assuming Friend object has an 'id'
      );
    };

    // Event: Friend Request Resent (You receive this if you were the original receiver)
    // This implies a previously rejected request is now pending again.
    const onFriendRequestResent = (request: Friend) => {
      console.log('WS Event: friend_request_resent', request);
      // Remove from incoming rejected list
      updateQueryItems(
        [ReactQueryTags.FRIEND_REQUESTS_REJECTED_INCOMING],
        (oldItems) => (oldItems || []).filter((req) => req.id !== request.id)
      );
      // Add/update in incoming pending list
      // It might already be there if the list wasn't fetched after rejection
      // A safe approach is to remove if exists, then add
      updateQueryItems(
        [ReactQueryTags.FRIEND_REQUESTS_INCOMING],
        (oldItems) => {
          const filteredItems = (oldItems || []).filter(
            (req) => req.id !== request.id
          );
          return [request, ...filteredItems]; // Add the resent request
        }
      );
    };

    // Event: Friend Status Changed (You receive this if the user is your friend)
    // This is tricky. You could update the specific friend item in the friendsData cache.
    // The payload is { userId, isOnline }. You need to find the friend object
    // in the friendsData array that corresponds to this userId and update its status.
    // const onFriendStatusChanged = ({
    //   userId,
    //   isOnline,
    // }: {
    //   userId: number;
    //   isOnline: boolean;
    // }) => {
    //   console.log('WS Event: friend_status_changed', { userId, isOnline });
    //   updateQueryItems([ReactQueryTags.FRIENDS], (oldItems) => {
    //     return (oldItems || []).map((friend) => {
    //       // Assuming Friend object has a user property or directly the friend's id
    //       // You need to determine which user in the Friend object is the friend.
    //       // Based on your backend getFriendIds logic, the friend's ID
    //       // is either friend.sender.id or friend.receiver.id, whichever is NOT the current user's ID.
    //       const friendUserId =
    //         friend.sender.id === userData?.id
    //           ? friend.receiver.id
    //           : friend.sender.id;

    //       if (friendUserId === userId) {
    //         // Assuming your Friend type or a derived type has an 'isOnline' property
    //         // If not, you might need a more complex state solution or structure
    //         // to track online status per friend.
    //         // For now, let's assume you need to update the user object *within* the friend object.
    //         return {
    //           ...friend,
    //           sender:
    //             friend.sender.id === userId
    //               ? { ...friend.sender, isOnline }
    //               : friend.sender,
    //           receiver:
    //             friend.receiver.id === userId
    //               ? { ...friend.receiver, isOnline }
    //               : friend.receiver,
    //           // Or perhaps you have a separate property directly on the Friend entity
    //           // indicating the status of the 'other' user in the relationship?
    //           // This part depends heavily on your data structure.
    //           // Example hypothetical update:
    //           // onlineStatus: isOnline // If you added this field to Friend
    //         };
    //       }
    //       return friend;
    //     });
    //   });
    //   // Note: Updating nested data like this can be complex depending on your schema.
    //   // Ensure your Friend type includes the necessary user details and an online status indicator.
    //   // If the Friend type in the cache doesn't easily support this, you might
    //   // need a separate mechanism (like a map in state) to track online statuses.
    // };

    // Connection/Disconnection status (optional, but good for UI feedback)
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    // Attach listeners
    friendsSocket.on('new_friend_request', onNewFriendRequest);
    friendsSocket.on('friend_request_accepted', onFriendRequestAccepted);
    friendsSocket.on('friend_request_rejected', onFriendRequestRejected);
    friendsSocket.on('friend_deleted', onFriendDeleted);
    friendsSocket.on('friend_request_resent', onFriendRequestResent);
    // friendsSocket.on('friend_status_changed', onFriendStatusChanged); // Assuming this event is emitted

    // Socket connection status listeners
    friendsSocket.on('connect', onConnect);
    friendsSocket.on('disconnect', onDisconnect);

    // Cleanup function
    return () => {
      friendsSocket.off('new_friend_request', onNewFriendRequest);
      friendsSocket.off('friend_request_accepted', onFriendRequestAccepted);
      friendsSocket.off('friend_request_rejected', onFriendRequestRejected);
      friendsSocket.off('friend_deleted', onFriendDeleted);
      friendsSocket.off('friend_request_resent', onFriendRequestResent);
      // friendsSocket.off('friend_status_changed', onFriendStatusChanged);

      friendsSocket.off('connect', onConnect);
      friendsSocket.off('disconnect', onDisconnect);
    };
    // Add dependencies. userData is needed to potentially identify 'other' user for status updates.
    // queryClient is stable and doesn't need to be in deps. friendsSocket is also stable.
  }, [queryClient, userData?.id]); // Re-run effect if userData.id changes (e.g., user logs in/out)

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
