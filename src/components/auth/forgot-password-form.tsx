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
import { authService } from '@/services';

export const ForgotPasswordForm = () => {
  const form = useForm<ForgotPasswordSchemaType>({
    validate: zodResolver(ForgotPasswordSchema),
    initialValues: {
      email: '',
    },
    validateInputOnChange: true,
  });

  const { mutate: forgotPassword, isPending, isSuccess } = useMutation({
    mutationFn: async (email: string) => {
      const { forgotPassword } = authService();
      const result = await forgotPassword(email);
      return result;
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message,
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
          disabled={!form.isValid()}
        >
          Send Reset Instructions
        </Button>
      </Stack>
    </form>
  );
};