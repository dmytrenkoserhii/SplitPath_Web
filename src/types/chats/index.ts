export type { ChatPreview } from './chat-preview.interface';
export type { PrivateMessage } from './private-message.interface';
export type { CreateMessagePayload } from './create-message-payload.interface';

export type TypingStatusChangePayload = {
  receiverId: number;
  isTyping: boolean;
};
