'use client';

import { useRouter } from 'next/navigation';

import { Button, ButtonProps } from '@mantine/core';

import { X } from 'lucide-react';

type EmailVerificationAlertProps = Omit<ButtonProps, 'onClick'>;

export const EmailVerificationAlert = (props: EmailVerificationAlertProps) => {
  const router = useRouter();

  return (
    <Button
      variant="light"
      color="red"
      onClick={() => router.push('/email-confirmation')}
      size="xs"
      {...props}
    >
      EMAIL NOT VERIFIED
    </Button>
  );
};
