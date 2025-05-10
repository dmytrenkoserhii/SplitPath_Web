'use client';

import { AppShell, Burger, Button, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ThemeToggle } from '../ui';
import { useNavbarState } from '@/hooks';
import Link from 'next/link';
import React from 'react';

interface HeaderWithBurgerProps {
  user: any;
}

export const HeaderWithBurger = ({ user }: HeaderWithBurgerProps) => {
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
        <Group>
          {!user && (
            <Link href='/sign-in'>
              <Button variant='outline'>Sign In</Button>
            </Link>
          )}
          <ThemeToggle />
        </Group>
      </Group>
    </AppShell.Header>
  );
};
