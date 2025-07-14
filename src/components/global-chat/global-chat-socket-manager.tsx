'use client';

import React from 'react';

import { InfiniteData, useQuery, useQueryClient } from '@tanstack/react-query';

import { ReactQueryTags } from '@/enums';
import { getGlobalChatSocket } from '@/lib';
import { usersService } from '@/services';
import { PublicMessage } from '@/types/global-chat/public-message.interface';
import { PaginatedResponse } from '@/types/shared';
import { User } from '@/types/user';

export const GlobalChatSocketManager = () => {
  const globalChatSocket = React.useMemo(() => getGlobalChatSocket(), []);
  const queryClient = useQueryClient();

  const { data: userData } = useQuery<User>({
    queryKey: [ReactQueryTags.USER],
    queryFn: () =>
      usersService()
        .getCurrent()
        .then((res) => res.data),
  });

  React.useEffect(() => {
    const onNewGlobalMessage = (message: PublicMessage) => {
      if (!userData) {
        return;
      }

      queryClient.setQueryData<InfiniteData<PaginatedResponse<PublicMessage>>>(
        [ReactQueryTags.GLOBAL_CHAT_MESSAGES],
        (oldData) => {
          if (!oldData) {
            return undefined;
          }

          const newData = {
            ...oldData,
            pages: oldData.pages.map((page, index) => {
              if (index === 0) {
                return {
                  ...page,
                  items: [message, ...page.items],
                };
              }
              return page;
            }),
          };
          return newData;
        },
      );
    };

    globalChatSocket.on('new_global_message', onNewGlobalMessage);

    return () => {
      globalChatSocket.off('new_global_message', onNewGlobalMessage);
    };
  }, [globalChatSocket, userData, queryClient]);

  React.useEffect(() => {
    globalChatSocket.connect();

    return () => {
      globalChatSocket.disconnect();
    };
  }, [globalChatSocket]);

  return null;
};
