'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import {
  Anchor,
  Button,
  Paper,
  PasswordInput,
  Stack,
  Title,
  Text,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import Link from 'next/link';
import { authService } from '@/services';

const ResetPasswordSchema = z.object({
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  passwordConfirmation: z.string(),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Passwords don't match",
  path: ['passwordConfirmation'],
});

type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;

export const ResetPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (!urlToken) {
      setTokenError('No reset token found. Please request a new password reset link.');
    } else {
      setToken(urlToken);
    }
  }, [searchParams]);

  const form = useForm<ResetPasswordSchemaType>({
    validate: zodResolver(ResetPasswordSchema),
    initialValues: {
      password: '',
      passwordConfirmation: '',
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    if (!token) {
      return;
    }

    setIsLoading(true);
    try {
      const { resetPassword } = authService();
      const result = await resetPassword(token, values.password);

      if (result.response.ok) {
        setIsCompleted(true);
        setTimeout(() => {
          router.push('/sign-in');
        }, 3000);
      } else {
        notifications.show({
          title: 'Error',
          message: result.response.statusText || 'Failed to reset password',
          color: 'red',
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'An unexpected error occurred',
        color: 'red',
      });
      console.error('Error during password reset:', error);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <Paper
      shadow='md'
      radius='md'
      p='xl'
      withBorder
      w={{ base: '90%', sm: 450 }}
    >
      <Title order={2} ta='center' mt='md' mb={50}>
        Create New Password
      </Title>

      {tokenError ? (
        <Stack gap="md">
          <Text ta="center" c="red">
            {tokenError}
          </Text>
          <Button component={Link} href="/forgot-password" fullWidth mt="xl">
            Request New Reset Link
          </Button>
        </Stack>
      ) : isCompleted ? (
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
      ) : (
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
              {...form.getInputProps('passwordConfirmation')}
            />

            <Button type='submit' fullWidth mt='xl' loading={isLoading}>
              Reset Password
            </Button>
          </Stack>

          <Stack align="center" mt="md">
            <Anchor component={Link} href='/sign-in' size='sm'>
              Return to Sign In
            </Anchor>
          </Stack>
        </form>
      )}
    </Paper>
  );
};