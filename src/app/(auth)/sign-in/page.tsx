import { Center } from '@mantine/core';

import { SignInForm } from '@/components/auth';

export default async function SignInPage() {
  return (
    <Center style={{ minHeight: '100dvh' }}>
      <SignInForm />
    </Center>
  );
}
