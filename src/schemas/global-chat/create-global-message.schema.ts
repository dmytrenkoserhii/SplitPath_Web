import { z } from 'zod';

export const CreateGlobalMessageSchema = z.object({
  content: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(1000, 'Message must be less than 1000 characters')
    .transform((val) => val.trim()),
});

export type CreateGlobalMessageSchemaType = z.infer<typeof CreateGlobalMessageSchema>;
