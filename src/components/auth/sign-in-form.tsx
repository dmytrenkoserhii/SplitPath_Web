'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SignInFormSchema, SignInFormSchemaType } from '@/schemas/auth';
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
import { authService } from '@/services';
import { queryClient } from '@/lib';
import { ReactQueryTags } from '@/enums';

// TODO: notifications doesn't work
export const SignInForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<SignInFormSchemaType>({
    validate: zodResolver(SignInFormSchema),
    initialValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    setIsLoading(true);
    try {
      const { signIn } = authService();
      const result = await signIn(values);

      if (result.response.ok) {
        queryClient.invalidateQueries({
          queryKey: [ReactQueryTags.USER],
        });
        router.push('/stories/selection');
      } else {
        notifications.show({
          title: 'Sign in failed',
          message:
            result.response.statusText ||
            'Please check your credentials and try again',
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

      <Button
        variant='outline'
        fullWidth
        onClick={() => authService().googleAuth()}
        loading={isLoading}
      >
        Google
      </Button>

      <Group justify='center' mt='md'>
        <Anchor component={Link} href='/sign-up' size='sm'>
          Don&apos;t have an account? Register
        </Anchor>
      </Group>
    </Paper>
  );
};
