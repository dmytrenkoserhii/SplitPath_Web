'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import { Button } from '@mantine/core';

import { ReactQueryTags } from '@/enums';
import { queryClient } from '@/lib';
import { authService } from '@/services';

/**
 * A button component that logs out the user and redirects to the sign-in page.
 *
 * @returns A button element that logs out the user and redirects to the sign-in page.
 */
export const LogoutButton = () => {
  const router = useRouter();

  const onLogout = async () => {
    const result = await authService().logout();
    if (result.response.ok) {
      queryClient.invalidateQueries({
        queryKey: [ReactQueryTags.USER],
      });
      router.push('/sign-in');
    }
  };

  return (
    <Button onClick={onLogout} variant="outline">
      Logout
    </Button>
  );
};
