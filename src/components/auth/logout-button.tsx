'use client';

import React from 'react';
import { authService } from '@/services';
import { useRouter } from 'next/navigation';
import { Button } from '@mantine/core';
import { queryClient } from '@/lib';
import { ReactQueryTags } from '@/enums';

/**
 * A button component that logs out the user and redirects to the sign-in page.
 *
 * @returns A button element that logs out the user and redirects to the sign-in page.
 */
export const LogoutButton = () => {
  const router = useRouter();

  const onLogout = async () => {
    const { logout } = authService();
    const result = await logout();
    if (result.response.ok) {
      queryClient.invalidateQueries({
        queryKey: [ReactQueryTags.USER],
      });
      router.push('/sign-in');
    }
  };

  return <Button onClick={onLogout}>Logout</Button>;
};
