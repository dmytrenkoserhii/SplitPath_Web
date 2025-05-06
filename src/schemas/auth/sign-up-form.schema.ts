import { z } from 'zod';

export const SignUpFormSchema = z
  .object({
    username: z.string().min(3),
    email: z.string().email({ message: 'Email is required' }),
    password: z.string().min(6),
    passwordConfirmation: z.string(),
    terms: z.boolean().refine((terms) => terms === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine(
    (values) => {
      return values.password === values.passwordConfirmation;
    },
    {
      message: 'Passwords must match!',
      path: ['passwordConfirmation'],
    },
  )
  .superRefine(({ password }, checkPassComplexity) => {
    const containsUppercase = /[A-Z]/.test(password);
    const containsLowercase = /[a-z]/.test(password);
    const containsNumber = /\d/.test(password);
    const containsSpecialChar = /[`!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?~ ]/.test(password);
    if (!containsUppercase) {
      checkPassComplexity.addIssue({
        code: 'custom',
        path: ['password'],
        message: 'Password must contain at least one uppercase letter!',
      });
    }

    if (!containsLowercase) {
      checkPassComplexity.addIssue({
        code: 'custom',
        path: ['password'],
        message: 'Password must contain at least one lowercase letter!',
      });
    }

    if (!containsNumber) {
      checkPassComplexity.addIssue({
        code: 'custom',
        path: ['password'],
        message: 'Password must contain at least one number!',
      });
    }

    if (!containsSpecialChar) {
      checkPassComplexity.addIssue({
        code: 'custom',
        path: ['password'],
        message: 'Password must contain at least one special character!',
      });
    }
  });
