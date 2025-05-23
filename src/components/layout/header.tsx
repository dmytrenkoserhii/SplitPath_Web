'use client';

import { AppShell, Box, Burger, Button, Group } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { ThemeToggle } from '../ui';
import { useNavbarState } from '@/hooks';
import Link from 'next/link';
import React from 'react';
import { LogoutButton } from '../auth';
import { NAVIGATION_LINKS } from '@/constants';
import { NavigationLink } from './navigation-link';
import { MdClose } from 'react-icons/md';

interface HeaderProps {
  user: any;
}

export const Header = ({ user }: HeaderProps) => {
  const { isNavbarOpen, setNavbarOpen } = useNavbarState();
  const isMobile = useMediaQuery('(max-width: 48rem)');

  const handleBurgerClick = () => {
    setNavbarOpen(!isNavbarOpen);
  };

  const handleVerificationClick = () => {
    window.location.href = '/email-confirmation';
  };

  return (
    <AppShell.Header>
      <Group h='100%' px='md' justify='space-between'>
        <Group>
          <Burger
            opened={isNavbarOpen}
            onClick={handleBurgerClick}
            hiddenFrom='sm'
            size='sm'
          />
          <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
            SplitPath
          </span>
        </Group>

        <Group
          gap='md'
          flex={1}
          justify='center'
          style={{ display: isMobile ? 'none' : 'flex' }}
        >
          {NAVIGATION_LINKS.map((link) => (
            <NavigationLink key={link.href} link={link} />
          ))}
        </Group>

        <Group>
        {user && !user.isEmailVerified && (
            <Button
            rightSection={<MdClose size={18} />}
            variant='light'
            color="red"
            onClick={handleVerificationClick}
          >
            EMAIL NOT VERIFIED
          </Button>
          )}
          <Box style={{ display: isMobile ? 'none' : 'flex' }}>
            {!user ? (
              <Link href='/sign-in'>
                <Button variant='outline'>Sign In</Button>
              </Link>
            ) : (
              <LogoutButton />
            )}
          </Box>
          <ThemeToggle />
        </Group>
      </Group>
    </AppShell.Header>
  );
};
