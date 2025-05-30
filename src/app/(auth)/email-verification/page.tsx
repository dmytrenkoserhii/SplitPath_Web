import { Center, Stack, Title, Text, Paper } from '@mantine/core';
import { redirect } from 'next/navigation';
import { usersService } from '@/services';

export default async function EmailVerificationPage({
  searchParams,
}: {
  searchParams: { token?: string }
}) {
  const token = searchParams.token;
  
  if (!token) {
    redirect('/stories/selection');
  }

  const { success, error } = await (async () => {
    try {
      const { verifyEmail } = usersService();
      const result = await verifyEmail(token);
      return { success: result.response.ok, error: result.response.statusText };
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
      <Paper
        shadow='md'
        radius='md'
        p='xl'
        withBorder
        w={{ base: '90%', sm: 450 }}
      >
        <Stack gap='md'>
          <Title order={2} ta='center' mt='md' mb={30}>
            Email Verification Failed
          </Title>
          <Text ta='center' c='red'>{error}</Text>
          <Text ta='center' size="sm">You will be redirected to the dashboard...</Text>
        </Stack>
      </Paper>
    </Center>
  );
}
