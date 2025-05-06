'use client';

import { AppShell, Button, Stack, Text } from '@mantine/core';
import { useNavbarState } from '@/hooks';
import { NAVIGATION_LINKS } from '@/constants';
import { NavigationLink } from '@/components/layout/navigation-link';
import { LogOut } from 'lucide-react';
import { logoutAction } from '@/actions/auth';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';

export const MainNavbar = () => {
  const { isNavbarOpen } = useNavbarState();
  const router = useRouter();

  const handleLogout = async () => {
    const result = await logoutAction();
    if (result.success) {
      router.push('/sign-in');
    } else {
      notifications.show({
        title: 'Logout Failed',
        message: result.error || 'An unknown error occurred.',
        color: 'red',
      });
    }
  };

  return (
    <AppShell.Navbar p='md' hidden={!isNavbarOpen}>
      <Stack justify='space-between' h='100%'>
        <Stack>
          {NAVIGATION_LINKS.map((link) => (
            <NavigationLink key={link.href} link={link} />
          ))}
        </Stack>
        <Stack>
          <Button
            variant='outline'
            leftSection={<LogOut />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Stack>
      </Stack>
    </AppShell.Navbar>
  );
};
