import { Anchor, Center, Group, Paper, Title } from '@mantine/core';
import { ForgotPasswordForm } from '@/components/auth';
import Link from 'next/link';

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
        
        <ForgotPasswordForm />

        <Group justify='center' mt='md'>
          <Anchor component={Link} href='/sign-in' size='sm'>
            Return to Sign In
          </Anchor>
        </Group>
      </Paper>
    </Center>
  );
}
