'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { signInAction } from '@/actions/auth';
import { SignInFormSchema } from '@/schemas/auth';
import {
  Anchor,
  Button,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import Link from 'next/link';

type SignInFormData = z.infer<typeof SignInFormSchema>;

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<SignInFormData>({
    validate: zodResolver(SignInFormSchema),
    initialValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    setIsLoading(true);
    try {
      const result = await signInAction(values);

      if (result.success) {
        router.push('/stories/selection');
      } else {
        notifications.show({
          title: 'Sign in failed',
          message:
            result.error || 'Please check your credentials and try again',
          color: 'red',
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'An unexpected error occurred',
        color: 'red',
      });
      console.error('Error during sign in:', error);
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
        Welcome back
      </Title>

      <form onSubmit={handleSubmit}>
        <Stack gap='md'>
          <TextInput
            label='Email'
            placeholder='your@email.com'
            required
            {...form.getInputProps('email')}
          />

          <PasswordInput
            label='Password'
            placeholder='Your password'
            required
            {...form.getInputProps('password')}
          />

          <Group justify='flex-end'>
            <Anchor component={Link} href='/forgot-password' size='sm'>
              Forgot password?
            </Anchor>
          </Group>

          <Button type='submit' fullWidth mt='xl' loading={isLoading}>
            Sign in
          </Button>
        </Stack>
      </form>

      <Divider label='Or continue with' labelPosition='center' my='lg' />

      <Button variant='outline' fullWidth disabled>
        Google
      </Button>

      <Group justify='center' mt='md'>
        <Anchor component={Link} href='/sign-up' size='sm'>
          Don't have an account? Register
        </Anchor>
      </Group>
    </Paper>
  );
}
