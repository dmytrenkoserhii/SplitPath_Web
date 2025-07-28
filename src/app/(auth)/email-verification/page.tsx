import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Button, Center, Paper, Stack, Text, Title } from '@mantine/core';

import { usersService } from '@/services';

export default async function EmailVerificationPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams.token;

  if (!token) {
    redirect('/stories/selection');
  }

  const { success, error } = await (async () => {
    try {
      const result = await usersService().verifyEmail(token);
      return { success: result.response.ok, error: null };
    } catch (err) {
      console.error('Email verification error:', err);
      return { success: false, error: 'An error occurred during verification' };
    }
  })();

  if (success) {
    redirect('/stories/selection');
  }

  return (
    <Center style={{ minHeight: '100dvh' }}>
      <Paper shadow="md" radius="md" p="xl" withBorder w={{ base: '90%', sm: 450 }}>
        <Stack gap="md">
          <Title order={2} ta="center" mt="md" mb={30}>
            Email Verification Failed
          </Title>
          {error && (
            <Text ta="center" c="red">
              {error}
            </Text>
          )}
          <Button component={Link} href="/stories/selection" variant="light" fullWidth>
            Go to Dashboard
          </Button>
        </Stack>
      </Paper>
    </Center>
  );
}
