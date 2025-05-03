'use client';

import { AppShell, Stack, Text } from '@mantine/core';
import { useNavbarState } from '@/hooks';
import { NAVIGATION_LINKS } from '@/constants';
import { NavigationLink } from '@/components/layout/navigation-link';

export const MainNavbar = () => {
  const { isNavbarOpen } = useNavbarState();

  return (
    <AppShell.Navbar p='md' hidden={!isNavbarOpen}>
      <Stack>
        {NAVIGATION_LINKS.map((link) => (
          <NavigationLink key={link.href} link={link} />
        ))}
      </Stack>
    </AppShell.Navbar>
  );
};
