import { z } from 'zod';

export const UpdateAccountFormSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(32, 'Username must not exceed 32 characters')
    .optional(),

  firstName: z
    .string()
    .min(1, 'First name must be at least 1 character')
    .max(50, 'First name must not exceed 50 characters')
    .optional()
    .or(z.literal('')),

  lastName: z
    .string()
    .min(1, 'Last name must be at least 1 character')
    .max(50, 'Last name must not exceed 50 characters')
    .optional()
    .or(z.literal('')),

  birthDate: z.date().optional().or(z.literal(null)),

  bio: z.string().max(500, 'Bio must not exceed 500 characters').optional().or(z.literal('')),
});

export type UpdateAccountFormSchemaType = z.infer<typeof UpdateAccountFormSchema>;
