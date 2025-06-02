import { Anchor, Center, Group, Paper, Title } from '@mantine/core';
import { ResetPasswordForm } from '@/components/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

type Props = {
  searchParams: { token?: string }
}

export default function ResetPasswordPage({ searchParams }: Props) {
  const { token } = searchParams;

  if (!token) {
    redirect('/forgot-password');
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
        <Title order={2} ta='center' mt='md' mb={50}>
          Create New Password
        </Title>

        <ResetPasswordForm token={token} />

        <Group justify='center' mt='md'>
          <Anchor component={Link} href='/sign-in' size='sm'>
            Return to Sign In
          </Anchor>
        </Group>
      </Paper>
    </Center>
  );
}
