'use client';

import {
  Button,
  Stack,
  TextInput,
  Text,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { ForgotPasswordSchema, ForgotPasswordSchemaType } from '@/schemas/auth/forgot-password-form.schema';

interface ForgotPasswordFormProps {
  handleForgotPassword: (email: string) => Promise<{ success: boolean; error: string }>;
}

export const ForgotPasswordForm = ({ handleForgotPassword }: ForgotPasswordFormProps) => {
  const form = useForm<ForgotPasswordSchemaType>({
    validate: zodResolver(ForgotPasswordSchema),
    initialValues: {
      email: '',
    },
    validateInputOnChange: true,
  });

  const { mutate: forgotPassword, isPending, isSuccess } = useMutation({
    mutationFn: async (email: string) => {
      const result = await handleForgotPassword(email);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to process your request',
        color: 'red',
      });
    }
  });

  const handleSubmit = form.onSubmit((values) => {
    forgotPassword(values.email);
  });

  if (isSuccess) {
    return (
      <Stack gap="md">
        <Text ta="center">
          We&apos;ve sent password reset instructions to your email address.
          Please check your inbox and follow the instructions to reset your password.
        </Text>
        
      </Stack>
    );
  }

  const isEmailValid = !form.errors.email && form.values.email.length > 0;

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap='md'>
        <TextInput
          label='Email'
          placeholder='your@email.com'
          required
          {...form.getInputProps('email')}
        />

        <Button 
          type='submit' 
          fullWidth 
          mt='xl' 
          loading={isPending}
          disabled={!isEmailValid}
        >
          Send Reset Instructions
        </Button>
      </Stack>
    </form>
  );
};