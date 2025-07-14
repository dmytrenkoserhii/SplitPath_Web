import { xiorClient } from '@/lib';
import { CreatePublicMessagePayload, PublicMessage } from '@/types/global-chat';
import { PaginatedResponse } from '@/types/shared';

interface GlobalChatApi {
  getAllMessages: (page: number, limit: number) => Promise<PaginatedResponse<PublicMessage>>;
  sendMessage: (payload: CreatePublicMessagePayload) => Promise<PublicMessage>;
}

export const globalChatService = (): GlobalChatApi => {
  return {
    getAllMessages: async (page: number, limit: number) => {
      const response = await xiorClient.get<PaginatedResponse<PublicMessage>>(
        `global-chat/messages?page=${page}&limit=${limit}`,
      );
      return response.data;
    },

    sendMessage: async (payload: CreatePublicMessagePayload): Promise<PublicMessage> => {
      const response = await xiorClient.post<PublicMessage>(`global-chat`, payload);
      return response.data;
    },
  };
};
