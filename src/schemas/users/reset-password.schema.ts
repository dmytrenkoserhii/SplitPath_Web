import { z } from "zod";

export const ResetPasswordSchema = z.object({
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
    passwordConfirmation: z.string(),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ['passwordConfirmation'],
  });
  
  export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;