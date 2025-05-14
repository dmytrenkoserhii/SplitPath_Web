import { z } from 'zod';

export const CreateFriendRequestSchema = z.object({
  email: z.string().email({ message: 'Valid email is required' }),
});

export type CreateFriendRequestType = z.infer<typeof CreateFriendRequestSchema>;
