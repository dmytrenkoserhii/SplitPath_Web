'use client';

import { AppShell, Burger, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useNavbarState } from '@/hooks/useNavbarState';

export function HeaderWithBurger() {
  const [opened, { toggle }] = useDisclosure();
  const { setNavbarOpen } = useNavbarState();

  const handleBurgerClick = () => {
    toggle();
    setNavbarOpen(!opened);
  };

  return (
    <AppShell.Header>
      <Group h='100%' px='md' justify='space-between'>
        <Group>
          <Burger
            opened={opened}
            onClick={handleBurgerClick}
            hiddenFrom='sm'
            size='sm'
          />
          <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
            SplitPath
          </span>
        </Group>
        <ThemeToggle />
      </Group>
    </AppShell.Header>
  );
}
