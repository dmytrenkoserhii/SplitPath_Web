import { ChatPreview } from '@/types/chats/chat-preview.interface';
import { CreateMessagePayload, PrivateMessage } from '@/types/chats';
import { xiorClient } from '@/lib';
import { PaginatedResponse } from '@/types/shared';

interface ChatsApi {
  getChatPreviews: (limit?: number) => Promise<ChatPreview[]>;
  getChatMessages: (
    friendId: number,
    page?: number,
    limit?: number
  ) => Promise<PaginatedResponse<PrivateMessage>>;
  sendMessage: (payload: CreateMessagePayload) => Promise<PrivateMessage>;
  markMultipleAsRead: (messageIds: number[]) => Promise<void>;
  markAllAsRead: (fromUserId: number) => Promise<void>;
}

export const chatsService = (): ChatsApi => {
  return {
    getChatPreviews: async (limit = 20): Promise<ChatPreview[]> => {
      const response = await xiorClient.get<ChatPreview[]>(
        `private-messages/chats?limit=${limit}`
      );
      return response.data;
    },

    getChatMessages: async (
      friendId: number,
      page = 1,
      limit = 20
    ): Promise<PaginatedResponse<PrivateMessage>> => {
      const response = await xiorClient.get<PaginatedResponse<PrivateMessage>>(
        `private-messages/chats/${friendId}?page=${page}&limit=${limit}`
      );
      return response.data;
    },

    sendMessage: async (
      payload: CreateMessagePayload
    ): Promise<PrivateMessage> => {
      const response = await xiorClient.post<PrivateMessage>(
        `private-messages`,
        payload
      );
      return response.data;
    },

    markMultipleAsRead: async (messageIds: number[]): Promise<void> => {
      await xiorClient.post(`private-messages/mark-multiple-read`, {
        messageIds,
      });
    },

    markAllAsRead: async (fromUserId: number): Promise<void> => {
      await xiorClient.post(`private-messages/mark-all-read/${fromUserId}`);
    },
  };
};
