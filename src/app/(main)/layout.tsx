import { AppShell, AppShellMain } from '@mantine/core';
import { HeaderWithBurger } from '@/components/layout/HeaderWithBurger';
import { MainNavbar } from '@/components/layout/MainNavbar';
import { MainFooter } from '@/components/layout/MainFooter';
import { NavbarProvider } from '@/hooks/useNavbarState';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NavbarProvider>
      <AppShell
        header={{ height: 60 }}
        footer={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: 'sm',
          collapsed: { mobile: true, desktop: false },
        }}
        padding='md'
      >
        <HeaderWithBurger />
        <MainNavbar />
        <AppShellMain>{children}</AppShellMain>
        <MainFooter />
      </AppShell>
    </NavbarProvider>
  );
}
