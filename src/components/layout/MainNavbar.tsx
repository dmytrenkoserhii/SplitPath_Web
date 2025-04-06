'use client';

import { AppShell, Stack, Text } from '@mantine/core';
import { useNavbarState } from '@/hooks/useNavbarState';

export function MainNavbar() {
  const { isNavbarOpen } = useNavbarState();

  return (
    <AppShell.Navbar p='md' hidden={!isNavbarOpen}>
      <Stack>
        <Text fw={500}>Navigation</Text>
        {/* Add your navigation links here */}
      </Stack>
    </AppShell.Navbar>
  );
}
