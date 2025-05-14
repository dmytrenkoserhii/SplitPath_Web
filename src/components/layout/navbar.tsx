'use client';

import { Stack } from '@mantine/core';
import { useNavbarState } from '@/hooks';
import { NAVIGATION_LINKS } from '@/constants';
import { NavigationLink } from '@/components/layout/navigation-link';
import { LogoutButton } from '@/components/auth';
import { useMediaQuery } from '@mantine/hooks';

// I don't use AppShell.Navbar because I don't see how it should be used
// with Next. We need to pass a 'open' value to the collapsed prop. in AppShell.
// But AppShell is located in the layout.tsx file, and layout.tsx is server component.
export const Navbar = () => {
  const { isNavbarOpen } = useNavbarState();
  const isMobile = useMediaQuery('(max-width: 48rem)');

  const showNavbar = isMobile ? isNavbarOpen : false;

  return (
    <div
      style={{
        padding: '1rem',
        display: showNavbar ? 'block' : 'none',
        position: 'fixed',
        top: 60,
        left: 0,
        width: '100%',
        // 100vh - 60px (header height) - 60px (footer height)
        height: 'calc(100vh - 60px - 60px)',
        background: 'var(--mantine-color-body)',
        zIndex: 100000,
      }}
    >
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
    </div>
  );
};
