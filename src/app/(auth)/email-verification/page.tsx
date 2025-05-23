import { EmailVerifier } from '@/components/auth/email-verifier';
import { Center } from '@mantine/core';

export default function EmailVerificationPage() {
  return (
    <Center style={{ minHeight: '100vh' }}>
      <EmailVerifier />
    </Center>
  );
}
