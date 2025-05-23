import { EmailConfirmationMessage } from '@/components/auth';
import { Center } from '@mantine/core';

export default function EmailConfirmationPage() {
  return (
    <Center style={{ minHeight: '100vh' }}>
      <EmailConfirmationMessage />
    </Center>
  );
}
