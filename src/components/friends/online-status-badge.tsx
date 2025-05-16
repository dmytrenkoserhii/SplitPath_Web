'use client';

import { Badge } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { friendsService } from '@/services';
import { ReactQueryTags } from '@/enums';

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

  const isOnline =
    onlineStatuses && userId in onlineStatuses ? onlineStatuses[userId] : false;

  return (
    <Badge color={isOnline ? 'green' : 'gray'} variant='light' size='lg'>
      {isOnline ? 'Online' : 'Offline'}
    </Badge>
  );
};
