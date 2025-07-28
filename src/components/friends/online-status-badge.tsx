'use client';

import { Badge } from '@mantine/core';

import { useQuery } from '@tanstack/react-query';

import { ReactQueryTags } from '@/enums';
import { friendsService } from '@/services';

interface OnlineStatusBadgeProps {
  userId: number;
}

export const OnlineStatusBadge = ({ userId }: OnlineStatusBadgeProps) => {
  const { data: onlineStatuses } = useQuery({
    queryKey: [ReactQueryTags.FRIENDS_ONLINE_STATUS],
    queryFn: () =>
      friendsService()
        .getFriendsOnlineStatus()
        .then((res) => res.data),
  });

  const isOnline = onlineStatuses && userId in onlineStatuses ? onlineStatuses[userId] : false;

  return (
    <Badge color={isOnline ? 'green' : 'gray'} variant="light" size="lg">
      {isOnline ? 'Online' : 'Offline'}
    </Badge>
  );
};
