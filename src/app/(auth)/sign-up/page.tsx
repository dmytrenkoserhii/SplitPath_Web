import { Center } from '@mantine/core';

import { SignUpForm } from '@/components/auth';

export default function SignUpPage() {
  return (
    <Center style={{ minHeight: '100dvh' }}>
      <SignUpForm />
    </Center>
  );
}
