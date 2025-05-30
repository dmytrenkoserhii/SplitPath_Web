import { Anchor, Center, Group, Paper, Title } from '@mantine/core';
import { ResetPasswordForm } from '@/components/auth';
import { authService } from '@/services';
import Link from 'next/link';

async function handleResetPassword(token: string, password: string) {
  'use server'
  
  try {
    const { resetPassword } = authService();
    const result = await resetPassword(token, password);
    return { success: result.response.ok, error: result.response.statusText };
  } catch (err) {
    console.error('Reset password error:', err);
    return { success: false, error: 'An error occurred while resetting your password' };
  }
}

export default function ResetPasswordPage() {
  return (
    <Center style={{ minHeight: '100dvh' }}>
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

        <ResetPasswordForm handleResetPassword={handleResetPassword} />

        <Group justify='center' mt='md'>
          <Anchor component={Link} href='/sign-in' size='sm'>
            Return to Sign In
          </Anchor>
        </Group>
      </Paper>
    </Center>
  );
}
