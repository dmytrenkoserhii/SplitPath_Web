'use client';

import { Alert, Button, Group, Text } from '@mantine/core';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import { authService } from '@/services';

export const EmailVerificationBar = () => {
  const handleResendVerification = async () => {
    try {
      const { resendVerificationEmail } = authService();
      await resendVerificationEmail();  // No need to pass email, backend gets user ID from session
      // You might want to show a success notification here
    } catch (error) {
      // Handle error, maybe show an error notification
      console.error('Failed to resend verification email:', error);
    }
  };

  return (
    <Alert 
      color="blue" 
      title="Email Verification Required" 
      icon={<AiOutlineExclamationCircle />}
      styles={{
        root: {
          width: '100%',
          borderRadius: 0,
        }
      }}
    >
      <Group justify="space-between" align="center">
        <Text size="sm">
          Please verify your email address to access all features.
        </Text>
        <Button 
          variant="light" 
          size="xs"
          onClick={handleResendVerification}
        >
          Resend Verification Email
        </Button>
      </Group>
    </Alert>
  );
};