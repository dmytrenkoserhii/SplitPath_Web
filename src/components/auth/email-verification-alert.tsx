'use client';

import { Button, ButtonProps } from '@mantine/core';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

type EmailVerificationAlertProps = Omit<ButtonProps, 'onClick'>;

export const EmailVerificationAlert = (props: EmailVerificationAlertProps) => {
  const router = useRouter();

  return (
    <Button
      rightSection={<X size={18} />}
      variant='light'
      color="red"
      onClick={() => router.push('/email-confirmation')}
      {...props}
    >
      EMAIL NOT VERIFIED
    </Button>
  );
}; 