import { XiorResponse } from 'xior';
import { xiorClient } from '@/lib';
import { Friend } from '@/types/friends';
import { PaginatedResponse } from '@/types/shared';
import {
  CreateFriendRequestType,
  GetFriendRequestsType,
} from '@/schemas/friends';

interface FriendsApi {
  sendFriendRequest: (
    data: CreateFriendRequestType
  ) => Promise<XiorResponse<Friend>>;
  acceptFriendRequest: (requestId: number) => Promise<XiorResponse<Friend>>;
  rejectFriendRequest: (requestId: number) => Promise<XiorResponse<Friend>>;
  deleteFriend: (friendId: number) => Promise<XiorResponse<Friend>>;
  getFriendsList: (
    page?: number,
    limit?: number
  ) => Promise<XiorResponse<PaginatedResponse<Friend>>>;
  getFriendRequests: (
    params: GetFriendRequestsType
  ) => Promise<XiorResponse<PaginatedResponse<Friend>>>;
  getFriendsOnlineStatus: () => Promise<
    XiorResponse<{ [key: number]: boolean }>
  >;
  resendFriendRequest: (requestId: number) => Promise<XiorResponse<Friend>>;
}

export const friendsService = (): FriendsApi => {
  return {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    deleteFriend,
    getFriendsList,
    getFriendRequests,
    getFriendsOnlineStatus,
    resendFriendRequest,
  };
};

const sendFriendRequest = (data: CreateFriendRequestType) => {
  return xiorClient.post<Friend>(`friends/request`, {
    email: data.email,
  });
};

const acceptFriendRequest = (requestId: number) => {
  return xiorClient.post<Friend>(`friends/accept/${requestId}`, {});
};

const rejectFriendRequest = (requestId: number) => {
  return xiorClient.post<Friend>(`friends/reject/${requestId}`, {});
};

const deleteFriend = (friendId: number) => {
  return xiorClient.delete<Friend>(`friends/${friendId}`);
};

const getFriendsList = (page = 1, limit = 10) => {
  return xiorClient.get<PaginatedResponse<Friend>>(`friends`, {
    params: { page, limit },
    next: {
      tags: ['friends'],
    },
  });
};

const getFriendRequests = (params: GetFriendRequestsType) => {
  return xiorClient.get<PaginatedResponse<Friend>>(`friends/requests`, {
    params,
  });
};

const getFriendsOnlineStatus = () => {
  return xiorClient.get<{ [key: number]: boolean }>(`friends/online-status`);
};

const resendFriendRequest = (requestId: number) => {
  return xiorClient.post<Friend>(`friends/resend/${requestId}`, {});
};
