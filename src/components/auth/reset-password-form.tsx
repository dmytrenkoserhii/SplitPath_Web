'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Button,
  PasswordInput,
  Stack,
  Text,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import Link from 'next/link';
import { ResetPasswordSchema, ResetPasswordSchemaType } from '@/schemas/auth/reset-password-form.schema';
import { useMutation } from '@tanstack/react-query';

interface ResetPasswordFormProps {
  handleResetPassword: (token: string, password: string) => Promise<{ success: boolean; error: string }>;
}

export const ResetPasswordForm = ({ handleResetPassword }: ResetPasswordFormProps) => {
  const router = useRouter();
  const token = useSearchParams().get('token');

  const form = useForm<ResetPasswordSchemaType>({
    validate: zodResolver(ResetPasswordSchema),
    initialValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const { mutate: resetPassword, isPending, isSuccess } = useMutation({
    mutationFn: async ({ password }: { password: string }) => {
      const result = await handleResetPassword(token!, password);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      setTimeout(() => {
        router.push('/sign-in');
      }, 3000);
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to reset password',
        color: 'red',
      });
    }
  });

  if (!token) {
    router.push('/forgot-password');
    return null;
  }

  const handleSubmit = form.onSubmit((values) => {
    resetPassword({ password: values.password });
  });

  if (isSuccess) {
    return (
      <Stack gap="md">
        <Text ta="center" c="green">
          Your password has been successfully reset!
        </Text>
        <Text ta="center">
          You will be redirected to the sign in page shortly.
        </Text>
        <Button component={Link} href="/sign-in" fullWidth mt="xl">
          Sign In Now
        </Button>
      </Stack>
    );
  }

  const isFormValid = !form.errors.password && !form.errors.confirmPassword && 
    form.values.password.length > 0 && form.values.confirmPassword.length > 0;

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap='md'>
        <PasswordInput
          label='New Password'
          placeholder='Enter new password'
          required
          {...form.getInputProps('password')}
        />

        <PasswordInput
          label='Confirm New Password'
          placeholder='Confirm new password'
          required
          {...form.getInputProps('confirmPassword')}
        />

        <Button 
          type='submit' 
          fullWidth 
          mt='xl' 
          loading={isPending}
          disabled={!isFormValid}
        >
          Reset Password
        </Button>
      </Stack>
    </form>
  );
};