'use client';

import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFriendsSocket, queryClient } from '@/lib';
import { ReactQueryTags } from '@/enums';
import { usersService } from '@/services';
import { User } from '@/types/user';
import { Friend } from '@/types/friends';

export const FriendsSocketManager = () => {
  const friendsSocket = React.useMemo(() => getFriendsSocket(), []);
  console.log('friendsSocket', friendsSocket);

  const { data: userData } = useQuery<User>({
    queryKey: [ReactQueryTags.USER],
    queryFn: () =>
      usersService()
        .getCurrent()
        .then((res) => res.data),
  });

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
      updateQueryItems(
        [ReactQueryTags.FRIEND_REQUESTS_INCOMING],
        (oldItems) => [request, ...(oldItems || [])]
      );
    };

    const onFriendRequestAccepted = (friend: Friend) => {
      updateQueryItems([ReactQueryTags.FRIEND_REQUESTS_OUTGOING], (oldItems) =>
        (oldItems || []).filter((req) => req.id !== friend.id)
      );
      updateQueryItems([ReactQueryTags.FRIENDS], (oldItems) => [
        friend,
        ...(oldItems || []),
      ]);
    };

    const onFriendRequestRejected = (request: Friend) => {
      updateQueryItems([ReactQueryTags.FRIEND_REQUESTS_OUTGOING], (oldItems) =>
        (oldItems || []).filter((req) => req.id !== request.id)
      );
      updateQueryItems(
        [ReactQueryTags.FRIEND_REQUESTS_REJECTED_OUTGOING],
        (oldItems) => [request, ...(oldItems || [])]
      );
    };

    const onFriendDeleted = (friend: Friend) => {
      updateQueryItems([ReactQueryTags.FRIENDS], (oldItems) =>
        (oldItems || []).filter((f) => f.id !== friend.id)
      );
    };

    const onFriendRequestResent = (request: Friend) => {
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
      if (!userData) return;

      // Update online status cache
      queryClient.setQueryData(
        [ReactQueryTags.FRIENDS_ONLINE_STATUS],
        (oldData: { [key: number]: boolean } | undefined) => {
          if (!oldData) return { [userId]: isOnline };
          return { ...oldData, [userId]: isOnline };
        }
      );

      // Also update the friends list if it exists
      queryClient.setQueryData(
        [ReactQueryTags.FRIENDS],
        (oldData: { items: Friend[]; meta?: any } | undefined) => {
          if (!oldData) return oldData;

          const updatedItems = oldData.items.map((friend) => {
            const friendUser =
              friend.sender.id === userData.id
                ? friend.receiver
                : friend.sender;

            if (friendUser.id !== userId) return friend;

            if (friend.sender.id === friendUser.id) {
              return { ...friend, sender: { ...friend.sender, isOnline } };
            } else {
              return { ...friend, receiver: { ...friend.receiver, isOnline } };
            }
          });

          return {
            ...oldData,
            items: updatedItems,
          };
        }
      );
    };

    // Set up socket listeners
    friendsSocket.on('new_friend_request', onNewFriendRequest);
    friendsSocket.on('friend_request_accepted', onFriendRequestAccepted);
    friendsSocket.on('friend_request_rejected', onFriendRequestRejected);
    friendsSocket.on('friend_deleted', onFriendDeleted);
    friendsSocket.on('friend_request_resent', onFriendRequestResent);
    friendsSocket.on('friend_status_changed', onFriendStatusChanged);

    // Clean up listeners
    return () => {
      friendsSocket.off('new_friend_request', onNewFriendRequest);
      friendsSocket.off('friend_request_accepted', onFriendRequestAccepted);
      friendsSocket.off('friend_request_rejected', onFriendRequestRejected);
      friendsSocket.off('friend_deleted', onFriendDeleted);
      friendsSocket.off('friend_request_resent', onFriendRequestResent);
      friendsSocket.off('friend_status_changed', onFriendStatusChanged);
    };
  }, [friendsSocket, userData]);

  useEffect(() => {
    friendsSocket.connect();

    return () => {
      friendsSocket.disconnect();
    };
  }, []);

  return null;
};
