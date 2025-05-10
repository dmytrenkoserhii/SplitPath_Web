'use client';

import { AppShell, Stack } from '@mantine/core';
import { useNavbarState } from '@/hooks';
import { NAVIGATION_LINKS } from '@/constants';
import { NavigationLink } from '@/components/layout/navigation-link';
import { LogoutButton } from '@/components/auth';

export const MainNavbar = () => {
  const { isNavbarOpen } = useNavbarState();

  return (
    <AppShell.Navbar p='md' hidden={!isNavbarOpen}>
      <Stack justify='space-between' h='100%'>
        <Stack>
          {NAVIGATION_LINKS.map((link) => (
            <NavigationLink key={link.href} link={link} />
          ))}
        </Stack>
        <Stack>
          <LogoutButton />
        </Stack>
      </Stack>
    </AppShell.Navbar>
  );
};
