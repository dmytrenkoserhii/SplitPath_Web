'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm, zodResolver } from '@mantine/form';
import {
  Anchor,
  Button,
  Checkbox,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';

import { SignUpFormSchema } from '@/schemas/auth';
import { useRouter } from 'next/navigation';
import { authService } from '@/services';
import { SignUpFormSchemaType } from '@/schemas/auth';
import { queryClient } from '@/lib';
import { ReactQueryTags } from '@/enums';

// TODO: notifications doesn't work
export const SignUpForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signUp } = authService();

  const form = useForm<SignUpFormSchemaType>({
    validate: zodResolver(SignUpFormSchema),
    initialValues: {
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      terms: false,
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    setIsLoading(true);
    const { username, email, password } = values;
    const result = await signUp({ username, email, password });
    setIsLoading(false);

    if (result.response.ok) {
      notifications.show({
        title: 'Sign Up Successful',
        message: 'Please check your email for confirmation.',
        color: 'green',
      });
      form.reset();
      queryClient.invalidateQueries({
        queryKey: [ReactQueryTags.USER],
      });
      router.push('/email-confirmation');
    } else {
      notifications.show({
        title: 'Sign Up Failed',
        message: result.response.statusText || 'An unknown error occurred.',
        color: 'red',
      });
    }
  });

  const handleGoogleSignUp = () => {
    router.push(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`);
  };

  return (
    <Paper
      shadow='md'
      radius='md'
      p='xl'
      withBorder
      w={{ base: '90%', sm: 450 }}
    >
      <Title order={2} ta='center' mt='md' mb={50}>
        Create Account
      </Title>

      <form onSubmit={handleSubmit}>
        <Stack gap='md'>
          <TextInput
            label='Username'
            placeholder='Your username'
            required
            {...form.getInputProps('username')}
          />

          <TextInput
            label='Email'
            placeholder='hello@mantine.dev'
            required
            {...form.getInputProps('email')}
          />

          <PasswordInput
            label='Password'
            placeholder='Your password'
            required
            {...form.getInputProps('password')}
          />

          <PasswordInput
            label='Confirm password'
            placeholder='Confirm password'
            required
            {...form.getInputProps('passwordConfirmation')}
          />

          <Checkbox
            label='I accept terms and conditions'
            {...form.getInputProps('terms', { type: 'checkbox' })}
          />

          <Button type='submit' fullWidth mt='xl' loading={isLoading}>
            Sign Up
          </Button>
        </Stack>
      </form>

      <Divider label='Or continue with' labelPosition='center' my='lg' />

      <Button 
        variant='outline' 
        fullWidth 
        onClick={handleGoogleSignUp}
        loading={isLoading}
      >
        Google
      </Button>

      <Group justify='center' mt='md'>
        <Anchor component={Link} href='/sign-in' size='sm'>
          Already have an account? Sign In
        </Anchor>
      </Group>
    </Paper>
  );
};
