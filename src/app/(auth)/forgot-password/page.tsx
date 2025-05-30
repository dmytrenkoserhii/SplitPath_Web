import { Anchor, Center, Group, Paper, Title } from '@mantine/core';
import { ForgotPasswordForm } from '@/components/auth';
import { authService } from '@/services';
import Link from 'next/link';

async function handleForgotPassword(email: string) {
  'use server'
  
  try {
    const { forgotPassword } = authService();
    const result = await forgotPassword(email);
    return { success: result.response.ok, error: result.response.statusText };
  } catch (err) {
    console.error('Forgot password error:', err);
    return { success: false, error: 'An error occurred while processing your request' };
  }
}

export default function ForgotPasswordPage() {
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
          Reset Password
        </Title>
        
        <ForgotPasswordForm handleForgotPassword={handleForgotPassword} />

        <Group justify='center' mt='md'>
          <Anchor component={Link} href='/sign-in' size='sm'>
            Return to Sign In
          </Anchor>
        </Group>
      </Paper>
    </Center>
  );
}
