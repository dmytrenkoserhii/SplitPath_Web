'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button, PasswordInput, Stack, Text } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';

import { useMutation } from '@tanstack/react-query';

import {
  ResetPasswordSchema,
  ResetPasswordSchemaType,
} from '@/schemas/auth/reset-password-form.schema';
import { authService } from '@/services';

type ResetPasswordFormProps = {
  token: string;
};

export const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const router = useRouter();

  const form = useForm<ResetPasswordSchemaType>({
    validate: zodResolver(ResetPasswordSchema),
    initialValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const {
    mutate: resetPassword,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: async ({ password }: { password: string }) => {
      const result = await authService().resetPassword(token, password);
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
        message: error.message,
        color: 'red',
      });
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    resetPassword({ password: values.password });
  });

  if (isSuccess) {
    return (
      <Stack gap="md">
        <Text ta="center" c="green">
          Your password has been successfully reset!
        </Text>
        <Text ta="center">You will be redirected to the sign in page shortly.</Text>
        <Button component={Link} href="/sign-in" fullWidth mt="xl">
          Sign In Now
        </Button>
      </Stack>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <PasswordInput
          label="New Password"
          placeholder="Enter new password"
          required
          {...form.getInputProps('password')}
        />

        <PasswordInput
          label="Confirm New Password"
          placeholder="Confirm new password"
          required
          {...form.getInputProps('confirmPassword')}
        />

        <Button type="submit" fullWidth mt="xl" loading={isPending} disabled={!form.isValid()}>
          Reset Password
        </Button>
      </Stack>
    </form>
  );
};
