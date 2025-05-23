'use client';

import { Paper, Stack, Title, Text, Anchor } from '@mantine/core';
import Link from 'next/link';

export const EmailConfirmationMessage = () => {
  return (
    <Paper
      shadow='md'
      radius='md'
      p='xl'
      withBorder
      w={{ base: '90%', sm: 450 }}
    >
      <Stack gap='md'>
        <Title order={2} ta='center' mt='md' mb={30}>
          Verify Your Email
        </Title>
        
        <Text ta='center'>
          We&apos;ve sent a verification link to your email address.
        </Text>
        
        <Text ta='center'>
          Please check your inbox and click on the link to verify your account.
        </Text>

        <Text size="sm" c="dimmed" ta='center' mt="md">
          If you don&apos;t see the email, check your spam folder or try signing in - 
          you can request a new verification email from there.
        </Text>
        
        <Stack align="center" mt="xl">
          <Anchor component={Link} href="/stories/selection" size="sm">
            Continue to Dashboard
          </Anchor>
        </Stack>
      </Stack>
    </Paper>
  );
};