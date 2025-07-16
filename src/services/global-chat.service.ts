import { xiorClient } from '@/lib';
import { CreateGlobalMessagePayload, GlobalMessage } from '@/types/global-chat';
import { PaginatedResponse } from '@/types/shared';

interface GlobalChatApi {
  getAllMessages: (page: number, limit: number) => Promise<PaginatedResponse<GlobalMessage>>;
  sendMessage: (payload: CreateGlobalMessagePayload) => Promise<GlobalMessage>;
}

export const globalChatService = (): GlobalChatApi => {
  return {
    getAllMessages: async (page: number, limit: number) => {
      const response = await xiorClient.get<PaginatedResponse<GlobalMessage>>(
        `global-chat/messages?page=${page}&limit=${limit}`,
      );
      return response.data;
    },

    sendMessage: async (payload: CreateGlobalMessagePayload): Promise<GlobalMessage> => {
      const response = await xiorClient.post<GlobalMessage>(`global-chat`, payload);
      return response.data;
    },
  };
};
