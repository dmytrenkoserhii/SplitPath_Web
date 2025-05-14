import { z } from 'zod';
import { FriendStatus, FriendRequestDirection } from '@/enums';

export const GetFriendRequestsSchema = z.object({
  status: z.nativeEnum(FriendStatus).optional(),
  direction: z.nativeEnum(FriendRequestDirection).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(10),
});

export type GetFriendRequestsType = z.infer<typeof GetFriendRequestsSchema>;
