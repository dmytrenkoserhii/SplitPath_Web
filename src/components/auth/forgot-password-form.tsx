'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import {
  Anchor,
  Button,
  Group,
  Paper,
  Stack,
  TextInput,
  Title,
  Text,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import Link from 'next/link';
import { authService } from '@/services';

const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

type ForgotPasswordSchemaType = z.infer<typeof ForgotPasswordSchema>;

export const ForgotPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const form = useForm<ForgotPasswordSchemaType>({
    validate: zodResolver(ForgotPasswordSchema),
    initialValues: {
      email: '',
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    setIsLoading(true);
    try {
      const { forgotPassword } = authService();
      const result = await forgotPassword(values.email);

      if (result.response.ok) {
        setIsSubmitted(true);
      } else {
        notifications.show({
          title: 'Error',
          message: result.response.statusText || 'Failed to process your request',
          color: 'red',
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'An unexpected error occurred',
        color: 'red',
      });
      console.error('Error during password reset request:', error);
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
        Reset Password
      </Title>

      {isSubmitted ? (
        <Stack gap="md">
          <Text ta="center">
            If an account with this email exists, we&apos;ve sent instructions to reset your password.
          </Text>
          <Button onClick={() => router.push('/sign-in')} fullWidth mt="xl">
            Return to Sign In
          </Button>
        </Stack>
      ) : (
        <form onSubmit={handleSubmit}>
          <Stack gap='md'>
            <TextInput
              label='Email'
              placeholder='your@email.com'
              required
              {...form.getInputProps('email')}
            />

            <Button type='submit' fullWidth mt='xl' loading={isLoading}>
              Send Reset Instructions
            </Button>
          </Stack>

          <Group justify='center' mt='md'>
            <Anchor component={Link} href='/sign-in' size='sm'>
              Return to Sign In
            </Anchor>
          </Group>
        </form>
      )}
    </Paper>
  );
};